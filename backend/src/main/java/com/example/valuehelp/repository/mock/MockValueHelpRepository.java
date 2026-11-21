package com.example.valuehelp.repository.mock;

import com.example.valuehelp.dto.*;
import com.example.valuehelp.registry.*;
import com.example.valuehelp.repository.ValueHelpRepository;

import java.util.*;

import org.springframework.stereotype.Repository;

@Repository
public class MockValueHelpRepository implements ValueHelpRepository {
    private final Map<String, List<Map<String, Object>>> data = new LinkedHashMap<>(Map.of(
            "COMPANY", List.of(row("companyCode", "1000", "companyName", "서울 본사", "country", "KR"), row("companyCode", "2000", "companyName", "부산 사업장", "country", "KR")),
            "DEPARTMENT", List.of(row("departmentId", "D101", "departmentName", "인사팀", "companyCode", "1000"), row("departmentId", "D102", "departmentName", "개발팀", "companyCode", "1000"), row("departmentId", "D201", "departmentName", "영업팀", "companyCode", "2000")),
            "EMPLOYEE", List.of(row("employeeId", "10001", "employeeName", "김민수", "departmentId", "D101", "departmentName", "인사팀", "companyCode", "1000", "employmentStatus", "ACTIVE"), row("employeeId", "10002", "employeeName", "이서연", "departmentId", "D102", "departmentName", "개발팀", "companyCode", "1000", "employmentStatus", "ACTIVE"), row("employeeId", "10003", "employeeName", "박지훈", "departmentId", "D201", "departmentName", "영업팀", "companyCode", "2000", "employmentStatus", "RETIRED")),
            "CURRENCY", List.of(row("currency", "KRW", "currencyName", "대한민국 원"), row("currency", "USD", "currencyName", "미국 달러"), row("currency", "EUR", "currencyName", "유로"), row("currency", "JPY", "currencyName", "일본 엔"))));

    public MockValueHelpRepository() {
        data.putAll(HrMockData.create());
        data.put("EMPLOYEE", employeesForPaging());
    }

    /** 기존 예제 사원은 유지하고 페이징·필터 테스트용 사원을 추가한다. */
    private List<Map<String, Object>> employeesForPaging() {
        List<Map<String, Object>> employees = new ArrayList<>(data.get("EMPLOYEE"));
        for (int number = 4; number <= 33; number++) {
            boolean busan = number % 3 == 0;
            boolean hr = !busan && number % 2 == 0;
            String departmentId = busan ? "D201" : hr ? "D101" : "D102";
            String departmentName = busan ? "영업팀" : hr ? "인사팀" : "개발팀";
            employees.add(row(
                    "employeeId", Integer.toString(10000 + number),
                    "employeeName", String.format(Locale.ROOT, "테스트 사원 %05d", number),
                    "departmentId", departmentId,
                    "departmentName", departmentName,
                    "companyCode", busan ? "2000" : "1000",
                    "employmentStatus", number % 5 == 0 ? "RETIRED" : "ACTIVE"));
        }
        return List.copyOf(employees);
    }

    private static Map<String, Object> row(String... v) {
        Map<String, Object> r = new LinkedHashMap<>();
        for (int i = 0; i < v.length; i += 2) r.put(v[i], v[i + 1]);
        return r;
    }

    public Page search(Definition d, SearchRequest req) {
        Map<String, Object> filters = req.filters() == null ? Map.of() : req.filters();
        List<Map<String, Object>> rows = data.get(d.metadata().id()).stream().filter(row -> filters.entrySet().stream().allMatch(e -> {
            if (e.getValue() == null || e.getValue().toString().isBlank()) return true;
            String actual = String.valueOf(row.getOrDefault(e.getKey(), "")), expected = e.getValue().toString();
            String op = d.filters().stream().filter(f -> f.webField().equals(e.getKey())).findFirst().orElseThrow().operator();
            return op.equals("contains") ? actual.toLowerCase(Locale.ROOT).contains(expected.toLowerCase(Locale.ROOT)) : actual.equals(expected);
        })).sorted(comparator(d, req)).toList();
        int from = (int) Math.min((long) req.page() * req.size(), rows.size()), to = Math.min(from + req.size(), rows.size());
        return new Page(rows.subList(from, to), rows.size(), req.page(), req.size());
    }

    private Comparator<Map<String, Object>> comparator(Definition d, SearchRequest r) {
        String field = r.sortField() == null || r.sortField().isBlank() ? d.metadata().keyField() : r.sortField();
        Comparator<Map<String, Object>> c = Comparator.comparing(row -> String.valueOf(row.getOrDefault(field, "")), String.CASE_INSENSITIVE_ORDER);
        return "desc".equalsIgnoreCase(r.sortDirection()) ? c.reversed() : c;
    }

    public Optional<Map<String, Object>> findByKey(Definition d, String key) {
        return data.get(d.metadata().id()).stream().filter(r -> key.equals(r.get(d.metadata().keyField()))).findFirst();
    }
}
