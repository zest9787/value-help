package com.example.valuehelp.repository.sap;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;
import java.net.http.HttpClient;
import java.time.Duration;

@Configuration
@Profile("sap")
@EnableConfigurationProperties(RapProperties.class)
public class RapConfiguration {
    @Bean
    RapClient rapClient(RestClient.Builder builder, RapProperties properties) {
        HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5))
                .followRedirects(HttpClient.Redirect.NEVER).build();
        var requestFactory = new JdkClientHttpRequestFactory(http);
        requestFactory.setReadTimeout(Duration.ofSeconds(15));
        builder.requestFactory(requestFactory);
        boolean hasUser = properties.username() != null && !properties.username().isBlank();
        boolean hasPassword = properties.password() != null && !properties.password().isEmpty();
        if (hasUser != hasPassword) throw new IllegalArgumentException("SAP RAP 사용자명과 비밀번호를 함께 설정하세요.");
        if (hasUser) builder.defaultHeaders(headers -> headers.setBasicAuth(properties.username(), properties.password()));
        return new RapClient(builder.build(), properties);
    }
}
