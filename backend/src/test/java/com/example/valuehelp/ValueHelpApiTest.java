package com.example.valuehelp;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ValueHelpApiTest {
    @Autowired MockMvc mvc;

    @Test
    void metadataProvidesIdentityWithoutUiConfiguration() throws Exception {
        mvc.perform(get("/api/v1/value-helps/EMPLOYEE/metadata"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.keyField").value("employeeId"))
            .andExpect(jsonPath("$.data.textField").value("employeeName"))
            .andExpect(jsonPath("$.data.columns").doesNotExist())
            .andExpect(jsonPath("$.data.searchFields").doesNotExist());
    }

    @Test
    void fixedFiltersAndSortAreValidatedByServer() throws Exception {
        mvc.perform(post("/api/v1/value-helps/DEPARTMENT/search")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"filters\":{\"companyCode\":\"1000\"},\"page\":0,\"size\":10,\"sortField\":\"departmentId\",\"sortDirection\":\"asc\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.totalCount").value(2))
            .andExpect(jsonPath("$.data.items[0].departmentId").value("D101"));
        mvc.perform(post("/api/v1/value-helps/DEPARTMENT/search")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"filters\":{},\"page\":0,\"size\":10,\"sortField\":\"unknown\"}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    void personnelAreasCanBePagedWithinOneCompany() throws Exception {
        String firstPage = "{\"filters\":{\"companyCode\":\"1000\"},\"page\":0,\"size\":10,\"sortField\":\"personnelArea\",\"sortDirection\":\"asc\"}";
        String secondPage = "{\"filters\":{\"companyCode\":\"1000\"},\"page\":1,\"size\":10,\"sortField\":\"personnelArea\",\"sortDirection\":\"asc\"}";
        mvc.perform(post("/api/v1/value-helps/PERSONNEL_AREA/search").contentType(MediaType.APPLICATION_JSON).content(firstPage))
            .andExpect(status().isOk()).andExpect(jsonPath("$.data.totalCount").value(13))
            .andExpect(jsonPath("$.data.items.length()").value(10))
            .andExpect(jsonPath("$.data.items[0].personnelArea").value("A100"));
        mvc.perform(post("/api/v1/value-helps/PERSONNEL_AREA/search").contentType(MediaType.APPLICATION_JSON).content(secondPage))
            .andExpect(status().isOk()).andExpect(jsonPath("$.data.totalCount").value(13))
            .andExpect(jsonPath("$.data.items.length()").value(3))
            .andExpect(jsonPath("$.data.items[0].personnelArea").value("A110"));
    }
}
