package com.example.valuehelp.repository;

import com.example.valuehelp.dto.*;
import com.example.valuehelp.registry.*;

import java.util.*;

/**
 * 실제 SAP 클라이언트로 교체할 수 있는 조회 경계.
 */
public interface ValueHelpRepository {
    Page search(Definition definition, SearchRequest request);

    Optional<Map<String, Object>> findByKey(Definition definition, String key);
}
