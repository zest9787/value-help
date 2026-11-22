package com.example.valuehelp.repository.sap;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.LinkedHashMap;
import java.util.Map;

/** OData 쿼리의 값은 원문으로 받아 URI 템플릿 확장 시 한 번만 인코딩한다. */
public class RapClient {
    private final RestClient client;
    private final URI baseUri;
    private final String sapClient;

    public RapClient(RestClient client, RapProperties properties) {
        this.client = client;
        this.sapClient = properties.client();
        try {
            baseUri = URI.create(properties.baseUrl());
            if (!("http".equalsIgnoreCase(baseUri.getScheme()) || "https".equalsIgnoreCase(baseUri.getScheme()))
                    || baseUri.getHost() == null || baseUri.getRawQuery() != null
                    || baseUri.getRawFragment() != null || baseUri.getUserInfo() != null) {
                throw new IllegalArgumentException("SAP_RAP_BASE_URL은 쿼리와 인증정보가 없는 HTTP(S) 서비스 루트여야 합니다.");
            }
        } catch (NullPointerException | IllegalArgumentException ex) {
            throw new IllegalArgumentException("유효한 SAP_RAP_BASE_URL을 설정하세요.", ex);
        }
    }

    public JsonNode get(String path, Map<String, String> parameters) {
        // 경로는 서버 Enum/설정에서만 가져온다. 절대 URL·쿼리·상위 경로 이동은 허용하지 않는다.
        if (path == null || !path.matches("/?[A-Za-z0-9_-]+(?:/[A-Za-z0-9_-]+)*")) {
            throw new IllegalArgumentException("잘못된 RAP 상대 path 설정입니다.");
        }
        String relativePath = path.startsWith("/") ? path.substring(1) : path;
        var builder = UriComponentsBuilder.fromUri(baseUri).pathSegment(relativePath.split("/"));
        var values = new LinkedHashMap<String, Object>();
        int index = 0;
        for (var entry : parameters.entrySet()) {
            String variable = "p" + index++;
            builder.queryParam(entry.getKey(), "{" + variable + "}");
            values.put(variable, entry.getValue());
        }
        if (sapClient != null && !sapClient.isBlank()) {
            builder.queryParam("sap-client", "{sapClient}");
            values.put("sapClient", sapClient);
        }
        URI uri = builder.encode().buildAndExpand(values).toUri();
        try {
            JsonNode body = client.get().uri(uri).accept(MediaType.APPLICATION_JSON).retrieve().body(JsonNode.class);
            if (body == null || !body.isObject()) throw new RapConnectionException("SAP 응답 형식이 올바르지 않습니다.");
            return body;
        } catch (RestClientException ex) {
            throw new RapConnectionException("SAP RAP 요청에 실패했습니다.", ex);
        }
    }
}
