package com.example.valuehelp.dto;

/** 데이터 식별 필드만 제공하며 화면 구성은 프런트엔드에서 관리한다. */
public record Metadata(String id, String keyField, String textField) {}
