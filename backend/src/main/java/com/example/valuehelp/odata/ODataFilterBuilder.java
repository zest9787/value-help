package com.example.valuehelp.odata;

import com.example.valuehelp.registry.*;

import java.util.*;

import org.springframework.stereotype.Component;

/**
 * Registry의 필드만 허용하며 문자열 리터럴을 이스케이프한다.
 */
@Component
public class ODataFilterBuilder {
    public String build(Definition d, Map<String, Object> filters) {
        if (filters == null) return "";
        List<String> parts = new ArrayList<>();
        for (var e : filters.entrySet()) {
            Filter f = d.filters().stream().filter(x -> x.webField().equals(e.getKey())).findFirst().orElseThrow(() -> new IllegalArgumentException("허용되지 않은 필터"));
            if (e.getValue() == null || e.getValue().toString().isBlank()) continue;
            String v = e.getValue().toString().replace("'", "''");
            parts.add(switch (f.operator()) {
                case EQ -> f.sapField() + " eq '" + v + "'";
                case CONTAINS -> "contains(" + f.sapField() + ",'" + v + "')";
                default -> throw new IllegalArgumentException("지원하지 않는 연산자");
            });
        }
        return String.join(" and ", parts);
    }
}
