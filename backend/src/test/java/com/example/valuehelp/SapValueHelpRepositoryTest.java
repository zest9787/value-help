package com.example.valuehelp;

import com.example.valuehelp.dto.SearchRequest;
import com.example.valuehelp.odata.ODataFilterBuilder;
import com.example.valuehelp.registry.Registry;
import com.example.valuehelp.repository.mock.MockValueHelpRepository;
import com.example.valuehelp.repository.sap.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.client.ExpectedCount.once;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.response.MockRestResponseCreators.*;

class SapValueHelpRepositoryTest {
    private final Registry registry = new Registry();
    private MockRestServiceServer server;
    private SapValueHelpRepository repository;

    @BeforeEach
    void setup() {
        RestClient.Builder builder = RestClient.builder();
        server = MockRestServiceServer.bindTo(builder).build();
        RapProperties props = new RapProperties("https://sap.example.test/odata/v4/", "", "100", null, null);
        repository = new SapValueHelpRepository(new RapClient(builder.build(), props), props,
                new ODataFilterBuilder(), new MockValueHelpRepository());
    }

    @Test
    void searchesRapWithEncodedFilterPaginationSortAndMappedResponse() {
        server.expect(once(), request -> {
            assertEquals("/odata/v4/Employees", request.getURI().getPath());
            String raw = request.getURI().getRawQuery();
            assertTrue(raw.contains("%25"));
            assertFalse(raw.contains("%2525"));
            String query = URLDecoder.decode(raw, StandardCharsets.UTF_8);
            assertTrue(query.contains("contains(EmployeeName,'O''Brien 한%')"), query);
            assertTrue(query.contains("CompanyCode eq '1000'"), query);
            assertTrue(query.contains("$skip=20"), query);
            assertTrue(query.contains("$top=10"), query);
            assertTrue(query.contains("$count=true"), query);
            assertTrue(query.contains("$orderby=EmployeeName desc,EmployeeId asc"), query);
            assertTrue(query.contains("sap-client=100"), query);
        }).andExpect(method(HttpMethod.GET)).andRespond(withSuccess("""
            {"@odata.count":21,"value":[{"EmployeeId":"10001","EmployeeName":"김민수",
            "CompanyCode":"1000","DepartmentId":"D101","DepartmentName":"인사팀","EmploymentStatus":"ACTIVE"}]}
            """, MediaType.APPLICATION_JSON));
        var result = repository.search(registry.get("EMPLOYEE"),
                new SearchRequest(Map.of("employeeName", "O'Brien 한%", "companyCode", "1000"), 2, 10, "employeeName", "desc"));
        assertEquals(21, result.totalCount());
        assertEquals("김민수", result.items().get(0).get("employeeName"));
        assertEquals("D101", result.items().get(0).get("departmentId"));
        server.verify();
    }

    @Test
    void usesConfiguredRelativePathForSearchAndLookup() {
        var original = registry.get("EMPLOYEE");
        var definition = new com.example.valuehelp.registry.Definition(
                "/employee_service/0001/Employees", original.metadata(), original.filters(), original.sortFields());
        server.expect(request -> assertEquals("/odata/v4/employee_service/0001/Employees", request.getURI().getPath()))
                .andRespond(withSuccess("{\"@odata.count\":0,\"value\":[]}", MediaType.APPLICATION_JSON));
        server.expect(request -> assertEquals("/odata/v4/employee_service/0001/Employees", request.getURI().getPath()))
                .andRespond(withSuccess("{\"value\":[]}", MediaType.APPLICATION_JSON));
        assertEquals(0, repository.search(definition, new SearchRequest(Map.of(), 0, 10, null, null)).totalCount());
        assertTrue(repository.findByKey(definition, "10001").isEmpty());
        server.verify();
    }

    @Test
    void rejectsUnsafePathsBeforeMakingRequest() {
        var original = registry.get("EMPLOYEE");
        for (String path : java.util.List.of("https://other.test/Employees", "../Employees", "Employees?$top=1", "a/%2e%2e/Employees", "//other.test")) {
            var definition = new com.example.valuehelp.registry.Definition(
                    path, original.metadata(), original.filters(), original.sortFields());
            assertThrows(IllegalArgumentException.class, () -> repository.findByKey(definition, "10001"));
        }
        server.verify();
    }

    @Test
    void looksUpEscapedSingleKeyAndReturnsEmptyForMissingKey() {
        server.expect(request -> assertTrue(URLDecoder.decode(request.getURI().getRawQuery(), StandardCharsets.UTF_8)
                .contains("EmployeeId eq 'O''Brien'"))).andRespond(withSuccess("{\"value\":[]}", MediaType.APPLICATION_JSON));
        assertTrue(repository.findByKey(registry.get("EMPLOYEE"), "O'Brien").isEmpty());
        server.verify();
    }

    @Test
    void mapsSingleItem() {
        server.expect(once(), request -> {}).andRespond(withSuccess(
                "{\"value\":[{\"EmployeeId\":\"10001\",\"EmployeeName\":\"김민수\"}]}", MediaType.APPLICATION_JSON));
        assertEquals("김민수", repository.findByKey(registry.get("EMPLOYEE"), "10001").orElseThrow().get("employeeName"));
        server.verify();
    }

    @Test
    void rejectsPartialServerDrivenPage() {
        server.expect(once(), request -> {}).andRespond(withSuccess(
                "{\"@odata.count\":100,\"@odata.nextLink\":\"next\",\"value\":[]}", MediaType.APPLICATION_JSON));
        assertThrows(RapConnectionException.class, () -> repository.search(registry.get("EMPLOYEE"), new SearchRequest(Map.of(), 0, 10, null, null)));
        server.verify();
    }

    @Test
    void keepsOtherIdsOnMockAndRejectsIncompleteOrFailedRapResponses() {
        assertEquals(2, repository.search(registry.get("COMPANY"), new SearchRequest(Map.of(), 0, 10, null, null)).totalCount());
        server.expect(once(), request -> {}).andRespond(withSuccess("{\"value\":[]}", MediaType.APPLICATION_JSON));
        assertThrows(RapConnectionException.class, () -> repository.search(registry.get("EMPLOYEE"), new SearchRequest(Map.of(), 0, 10, null, null)));
        server.verify();
    }

    @Test
    void reportsSapHttpFailuresWithoutExposingResponse() {
        server.expect(once(), request -> {}).andRespond(withUnauthorizedRequest());
        var ex = assertThrows(RapConnectionException.class, () -> repository.search(registry.get("EMPLOYEE"), new SearchRequest(Map.of(), 0, 10, null, null)));
        assertEquals("SAP RAP 요청에 실패했습니다.", ex.getMessage());
        server.verify();
    }
}
