package com.example.valuehelp.registry;

import com.example.valuehelp.dto.Metadata;

import java.util.List;
import java.util.Set;

/**
 * Value Help의 서버 매핑과 허용 검색·정렬 필드. path는 공통 baseUrl 아래에 붙는 항목별 상대 경로다.
 */
public record Definition(String path, Metadata metadata, List<Filter> filters, Set<String> sortFields) {
}
