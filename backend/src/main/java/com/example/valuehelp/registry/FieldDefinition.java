package com.example.valuehelp.registry;

import java.util.Objects;

/** 웹 필드, SAP 속성, 검색 연산자(NONE은 검색 불가), 정렬 허용 여부. */
public record FieldDefinition(String webField, String sapField, FilterOperator filter, boolean sortable) {
    public FieldDefinition {
        Objects.requireNonNull(webField);
        Objects.requireNonNull(sapField);
        Objects.requireNonNull(filter);
    }
}
