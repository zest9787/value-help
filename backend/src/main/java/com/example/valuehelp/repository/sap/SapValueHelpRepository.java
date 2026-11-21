package com.example.valuehelp.repository.sap;

import com.example.valuehelp.dto.Page;
import com.example.valuehelp.dto.SearchRequest;
import com.example.valuehelp.odata.ODataFilterBuilder;
import com.example.valuehelp.registry.Definition;
import com.example.valuehelp.repository.ValueHelpRepository;
import com.example.valuehelp.repository.mock.MockValueHelpRepository;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

import java.util.*;

/** EMPLOYEE만 RAP에 연결하는 샘플. 나머지 Value Help는 명시적으로 목 저장소를 사용한다. */
@Repository
@Primary
@Profile("sap")
public class SapValueHelpRepository implements ValueHelpRepository {
    // 웹 필드와 RAP 속성의 명시적 매핑. 실제 $metadata에 맞게 조정한다.
    private static final Map<String, String> FIELDS = Map.of(
            "employeeId", "EmployeeId", "employeeName", "EmployeeName",
            "departmentId", "DepartmentId", "departmentName", "DepartmentName",
            "companyCode", "CompanyCode", "employmentStatus", "EmploymentStatus");
    private static final String SELECT = "EmployeeId,EmployeeName,DepartmentId,DepartmentName,CompanyCode,EmploymentStatus";
    private final RapClient client;
    private final RapProperties properties;
    private final ODataFilterBuilder filterBuilder;
    private final MockValueHelpRepository mock;

    public SapValueHelpRepository(RapClient client, RapProperties properties,
                                  ODataFilterBuilder filterBuilder, MockValueHelpRepository mock) {
        this.client = client;
        this.properties = properties;
        this.filterBuilder = filterBuilder;
        this.mock = mock;
    }

    @Override
    public Page search(Definition definition, SearchRequest request) {
        if (!isEmployee(definition)) return mock.search(definition, request);
        Map<String, String> params = new LinkedHashMap<>();
        String filter = filterBuilder.build(definition, request.filters());
        if (!filter.isBlank()) params.put("$filter", filter);
        params.put("$select", SELECT);
        params.put("$top", Integer.toString(request.size()));
        params.put("$skip", Long.toString((long) request.page() * request.size()));
        params.put("$count", "true");
        // 정렬 값은 Service가 허용 목록으로 검증하고, RAP 필드명은 서버 매핑에서만 가져온다.
        String sort = request.sortField() == null || request.sortField().isBlank()
                ? "employeeId" : request.sortField();
        String sapSort = FIELDS.get(sort);
        if (sapSort == null || !definition.sortFields().contains(sort)) throw new IllegalArgumentException("허용되지 않은 정렬 필드");
        String direction = "desc".equalsIgnoreCase(request.sortDirection()) ? "desc" : "asc";
        params.put("$orderby", sapSort + " " + direction + (sort.equals("employeeId") ? "" : ",EmployeeId asc"));
        JsonNode response = client.get(properties.employeeEntitySet(), params);
        List<Map<String, Object>> items = readRows(response);
        JsonNode count = response.get("@odata.count");
        try {
            if (count == null || (!count.isIntegralNumber() && !count.isTextual())) throw new NumberFormatException();
            long total = Long.parseLong(count.asText());
            if (total < 0 || total < items.size()) throw new NumberFormatException();
            return new Page(items, total, request.page(), request.size());
        } catch (NumberFormatException ex) {
            throw new RapConnectionException("SAP 응답에 유효한 @odata.count가 없습니다.", ex);
        }
    }

    @Override
    public Optional<Map<String, Object>> findByKey(Definition definition, String key) {
        if (!isEmployee(definition)) return mock.findByKey(definition, key);
        // 키 리터럴의 작은따옴표는 OData 규칙에 맞게 두 번 쓴다.
        Map<String, String> params = new LinkedHashMap<>();
        params.put("$filter", "EmployeeId eq '" + key.replace("'", "''") + "'");
        params.put("$select", SELECT);
        params.put("$top", "2");
        List<Map<String, Object>> rows = readRows(client.get(properties.employeeEntitySet(), params));
        if (rows.size() > 1) throw new RapConnectionException("SAP 사원 키가 고유하지 않습니다.");
        return rows.stream().findFirst();
    }

    private boolean isEmployee(Definition definition) { return "EMPLOYEE".equals(definition.metadata().id()); }

    private List<Map<String, Object>> readRows(JsonNode response) {
        JsonNode rows = response.get("value");
        if (rows == null || !rows.isArray()) throw new RapConnectionException("SAP 응답에 value 배열이 없습니다.");
        // 서버 주도 페이징을 미구현 상태에서 일부 결과를 전체 페이지로 오인하지 않는다.
        if (response.hasNonNull("@odata.nextLink")) throw new RapConnectionException("SAP 서버 주도 페이징은 이 샘플에서 지원하지 않습니다.");
        List<Map<String, Object>> result = new ArrayList<>();
        for (JsonNode source : rows) {
            if (!source.isObject() || !source.path("EmployeeId").isTextual() || !source.path("EmployeeName").isTextual())
                throw new RapConnectionException("SAP 사원 코드 또는 명칭 응답이 올바르지 않습니다.");
            Map<String, Object> row = new LinkedHashMap<>();
            for (var mapping : FIELDS.entrySet()) {
                JsonNode value = source.get(mapping.getValue());
                if (value != null && !value.isNull()) {
                    if (!value.isTextual()) throw new RapConnectionException("SAP 사원 필드 타입이 올바르지 않습니다.");
                    row.put(mapping.getKey(), value.asText());
                }
            }
            result.add(row);
        }
        return result;
    }
}
