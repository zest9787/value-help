package com.example.valuehelp.dto;

public record Response<T>(boolean success, String code, String message, T data) {
    public static <T> Response<T> ok(T data) {
        return new Response<>(true, "SUCCESS", "정상 처리되었습니다.", data);
    }
}
