package com.example.valuehelp.registry;

import com.example.valuehelp.dto.Metadata;
import org.springframework.stereotype.Component;
import java.util.*;

/** SAP 매핑과 허용 검색·정렬 필드만 정의한다. UI 설정은 프런트엔드가 관리한다. */
@Component
public class Registry {
    private final Map<String, Definition> definitions = new LinkedHashMap<>();

    public Registry() {
        add("COMPANY", "CompanyCodes", "companyCode", "companyName",
            List.of(filter("companyName", "contains"), filter("companyCode", "eq")),
            Set.of("companyCode", "companyName", "country"));
        add("DEPARTMENT", "Departments", "departmentId", "departmentName",
            List.of(filter("companyCode", "eq"), filter("departmentName", "contains")),
            Set.of("departmentId", "departmentName", "companyCode"));
        add("EMPLOYEE", "Employees", "employeeId", "employeeName",
            List.of(filter("companyCode", "eq"), filter("employeeName", "contains"),
                    filter("departmentId", "eq"), filter("employmentStatus", "eq")),
            Set.of("employeeId", "employeeName", "departmentName", "companyCode", "employmentStatus"));
        add("CURRENCY", "Currencies", "currency", "currencyName", List.of(),
            Set.of("currency", "currencyName"));
        HrDefinitions.register(this);
    }
    static Filter filter(String field, String operator) {
        return new Filter(field, Character.toUpperCase(field.charAt(0)) + field.substring(1), operator);
    }
    void add(String id, String entity, String key, String text, List<Filter> filters, Set<String> sortFields) {
        definitions.put(id, new Definition(entity, new Metadata(id, key, text), filters, sortFields));
    }
    public Definition get(String id) {
        Definition definition = definitions.get(id.toUpperCase(Locale.ROOT));
        if (definition == null) throw new NoSuchElementException("등록되지 않은 Value Help: " + id);
        return definition;
    }

    public Set<String> registeredIds() {
        return Set.copyOf(definitions.keySet());
    }
}
