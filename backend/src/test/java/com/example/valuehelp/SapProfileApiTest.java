package com.example.valuehelp;

import com.example.valuehelp.repository.sap.RapClient;
import com.example.valuehelp.repository.sap.RapConnectionException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = "sap.rap.base-url=https://sap.example.test/odata/v4/")
@ActiveProfiles("sap")
@AutoConfigureMockMvc
class SapProfileApiTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;
    @MockitoBean RapClient client;

    @Test
    void routesEmployeeToRapAndOtherIdsToMock() throws Exception {
        when(client.get(eq("Employees"), anyMap())).thenReturn(mapper.readTree("""
                {"@odata.count":1,"value":[{"EmployeeId":"SAP01","EmployeeName":"SAP 사원"}]}
                """));
        String request = "{\"filters\":{},\"page\":0,\"size\":10}";
        mvc.perform(post("/api/v1/value-helps/EMPLOYEE/search").contentType(MediaType.APPLICATION_JSON).content(request))
                .andExpect(status().isOk()).andExpect(jsonPath("$.data.items[0].employeeId").value("SAP01"));
        mvc.perform(post("/api/v1/value-helps/COMPANY/search").contentType(MediaType.APPLICATION_JSON).content(request))
                .andExpect(status().isOk()).andExpect(jsonPath("$.data.totalCount").value(2));
        verify(client, times(1)).get(eq("Employees"), anyMap());
    }

    @Test
    void masksRapFailureFromApiCaller() throws Exception {
        when(client.get(eq("Employees"), anyMap())).thenThrow(new RapConnectionException("upstream secret detail"));
        mvc.perform(post("/api/v1/value-helps/EMPLOYEE/search").contentType(MediaType.APPLICATION_JSON)
                .content("{\"filters\":{},\"page\":0,\"size\":10}"))
                .andExpect(status().isBadGateway()).andExpect(jsonPath("$.code").value("SAP_ERROR"))
                .andExpect(jsonPath("$.message").value("SAP RAP 조회에 실패했습니다. 서버 설정과 연결을 확인하세요."));
    }
}
