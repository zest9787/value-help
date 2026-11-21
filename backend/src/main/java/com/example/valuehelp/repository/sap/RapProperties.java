package com.example.valuehelp.repository.sap;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** 비밀번호는 환경 변수 또는 외부 비밀 저장소에서 주입한다. */
@ConfigurationProperties(prefix = "sap.rap")
public record RapProperties(String baseUrl, String employeeEntitySet, String client,
                            String username, String password) {
    public RapProperties {
        if (employeeEntitySet == null || employeeEntitySet.isBlank()) employeeEntitySet = "Employees";
    }
}
