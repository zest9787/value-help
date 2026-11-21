package com.example.valuehelp.controller;

import com.example.valuehelp.dto.*;
import com.example.valuehelp.service.ValueHelpService;
import com.example.valuehelp.repository.sap.RapConnectionException;

import java.util.*;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/value-helps")
public class ValueHelpController {
    private final ValueHelpService service;

    public ValueHelpController(ValueHelpService service) {
        this.service = service;
    }

    @GetMapping("/{id}/metadata")
    public Response<Metadata> metadata(@PathVariable String id) {
        return Response.ok(service.metadata(id));
    }

    @PostMapping("/{id}/search")
    public Response<Page> search(@PathVariable String id, @RequestBody SearchRequest request) {
        return Response.ok(service.search(id, request));
    }

    @GetMapping("/{id}/items/{key}")
    public Response<Map<String, Object>> item(@PathVariable String id, @PathVariable String key) {
        return Response.ok(service.item(id, key));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    ResponseEntity<Response<Void>> bad(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(new Response<>(false, "BAD_REQUEST", e.getMessage(), null));
    }

    @ExceptionHandler(NoSuchElementException.class)
    ResponseEntity<Response<Void>> missing(NoSuchElementException e) {
        return ResponseEntity.status(404).body(new Response<>(false, "NOT_FOUND", e.getMessage(), null));
    }

    @ExceptionHandler(RapConnectionException.class)
    ResponseEntity<Response<Void>> sapFailure(RapConnectionException e) {
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .body(new Response<>(false, "SAP_ERROR", "SAP RAP 조회에 실패했습니다. 서버 설정과 연결을 확인하세요.", null));
    }
}
