package com.example.valuehelp;

import com.example.valuehelp.dto.SearchRequest;
import com.example.valuehelp.registry.Registry;
import com.example.valuehelp.repository.mock.MockValueHelpRepository;
import com.example.valuehelp.service.ValueHelpService;
import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class MockPagingTest {
    private final ValueHelpService service = new ValueHelpService(new Registry(), new MockValueHelpRepository());

    @Test
    void companyFilterProducesThreeDistinctEmployeePages() {
        var seen = new HashSet<String>();
        int[] expectedSizes = {10, 10, 2};
        for (int page = 0; page < expectedSizes.length; page++) {
            var result = service.search("EMPLOYEE", new SearchRequest(Map.of("companyCode", "1000"), page, 10, "employeeId", "asc"));
            assertEquals(22, result.totalCount());
            assertEquals(expectedSizes[page], result.items().size());
            for (var employee : result.items()) {
                assertEquals("1000", employee.get("companyCode"));
                assertTrue(seen.add(employee.get("employeeId").toString()), "duplicate employee across pages");
            }
        }
        assertEquals(22, seen.size());
        assertTrue(service.search("EMPLOYEE", new SearchRequest(Map.of("companyCode", "1000"), 3, 10, "employeeId", "asc")).items().isEmpty());
    }

    @Test
    void employeeRowsPreserveDepartmentAndEmploymentStatusFilters() {
        var result = service.search("EMPLOYEE", new SearchRequest(
                Map.of("companyCode", "1000", "departmentId", "D101", "employmentStatus", "ACTIVE"),
                0, 10, "employeeId", "desc"));
        assertTrue(result.totalCount() > 0);
        assertTrue(result.items().stream().allMatch(row -> "1000".equals(row.get("companyCode"))
                && "D101".equals(row.get("departmentId")) && "ACTIVE".equals(row.get("employmentStatus"))));
    }
}
