package com.example.valuehelp.service;

import com.example.valuehelp.dto.*;
import com.example.valuehelp.registry.*;
import com.example.valuehelp.repository.ValueHelpRepository;

import java.util.*;

import org.springframework.stereotype.Service;

@Service
public class ValueHelpService {
    private final Registry registry;
    private final ValueHelpRepository repository;

    public ValueHelpService(Registry registry, ValueHelpRepository repository) {
        this.registry = registry;
        this.repository = repository;
    }

    public Metadata metadata(String id) {
        return registry.get(id).metadata();
    }

    public Page search(String id, SearchRequest request) {
        Definition d = registry.get(id);
        if (request.page() < 0 || request.size() < 1 || request.size() > 200)
            throw new IllegalArgumentException("page는 0 이상, size는 1~200이어야 합니다.");
        if (request.filters() != null) for (var e : request.filters().entrySet()) {
            if (d.filters().stream().noneMatch(f -> f.webField().equals(e.getKey())))
                throw new IllegalArgumentException("허용되지 않은 검색조건: " + e.getKey());
            if (e.getValue() != null && !(e.getValue() instanceof String))
                throw new IllegalArgumentException("검색조건은 문자열이어야 합니다: " + e.getKey());
        }
        if (request.sortField() != null && !request.sortField().isBlank() && !d.sortFields().contains(request.sortField()))
            throw new IllegalArgumentException("허용되지 않은 정렬 필드");
        if (request.sortDirection() != null && !request.sortDirection().isBlank() && !List.of("asc", "desc").contains(request.sortDirection().toLowerCase(Locale.ROOT)))
            throw new IllegalArgumentException("정렬 방향은 asc 또는 desc입니다.");
        return repository.search(d, request);
    }

    public Map<String, Object> item(String id, String key) {
        return repository.findByKey(registry.get(id), key).orElseThrow(() -> new NoSuchElementException("조회 결과가 없습니다."));
    }
}
