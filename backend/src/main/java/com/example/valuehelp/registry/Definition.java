package com.example.valuehelp.registry;

import com.example.valuehelp.dto.Metadata;

import java.util.List;
import java.util.Set;

/**
 * Value Help의 서버 매핑과 허용 검색·정렬 필드.
 */
public record Definition(String entitySet, Metadata metadata, List<Filter> filters, Set<String> sortFields) {
}
