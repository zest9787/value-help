package com.example.valuehelp.dto;

import java.util.Map;

public record SearchRequest(Map<String, Object> filters, int page, int size, String sortField, String sortDirection) {
}
