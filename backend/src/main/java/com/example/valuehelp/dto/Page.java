package com.example.valuehelp.dto;

import java.util.List;
import java.util.Map;

public record Page(List<Map<String, Object>> items, long totalCount, int page, int size) {
}
