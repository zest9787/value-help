package com.example.valuehelp.registry;

/**
 * 웹 검색 필드와 SAP OData 필드의 매핑.
 */
public record Filter(String webField, String sapField, FilterOperator operator) {
}
