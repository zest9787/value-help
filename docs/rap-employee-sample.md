# RAP 사원 Value Help 연결 샘플

이 샘플은 `sap` 프로파일에서 `EMPLOYEE` 검색과 단건 조회를 실제 RAP OData V4 서비스로 전달한다. 나머지 39종은 계속 목 데이터를 사용한다. 회사·부서 검색도 목 데이터이므로 실제 사원 데이터와 코드가 맞지 않을 수 있다. 기본 프로파일은 모든 항목이 목 데이터다. 실제 SAP에 접속하려면 서비스 주소, 네트워크 경로 및 인증정보가 필요하다.

## 실행

PowerShell에서 다음을 설정하고 백엔드를 실행한다. 서비스 루트 URL은 EntitySet 이름을 제외한 OData V4 서비스 경로다. 아래 주소는 설명용이므로 실제 주소로 교체한다.

```powershell
cd backend
$env:SPRING_PROFILES_ACTIVE = 'sap'
$env:SAP_RAP_BASE_URL = 'https://sap.example.com/sap/opu/odata4/서비스경로/0001/'
$env:SAP_RAP_EMPLOYEE_ENTITY_SET = 'Employees'
$env:SAP_RAP_CLIENT = '100' # 필요한 시스템에서만 설정

# 서비스가 Basic 인증을 요구하는 경우에만 실행한다.
$rapCredential = Get-Credential -Message 'SAP RAP 사용자'
$env:SAP_RAP_USERNAME = $rapCredential.UserName
$env:SAP_RAP_PASSWORD = $rapCredential.GetNetworkCredential().Password

.\gradlew.bat bootRun
```

Basic 인증을 사용하지 않는다면 사용자명과 비밀번호를 둘 다 설정하지 않는다. 이 샘플에는 OAuth, SSO, SAP Destination 및 사용자 토큰 전달이 구현되어 있지 않다. 실제 인증 정책에 맞게 `RapConfiguration`의 클라이언트를 교체해야 한다. 인증정보는 소스에 기록하지 말고 TLS가 적용된 서비스에 연결한다.

프런트엔드는 기존대로 `pnpm dev`를 실행한다. API를 직접 테스트하려면:

```powershell
Invoke-RestMethod -Method Post -Uri 'http://localhost:8080/api/v1/value-helps/EMPLOYEE/search' -ContentType 'application/json; charset=utf-8' -Body '{"filters":{"companyCode":"1000"},"page":0,"size":10,"sortField":"employeeName","sortDirection":"asc"}'
Invoke-RestMethod 'http://localhost:8080/api/v1/value-helps/EMPLOYEE/items/10001'
```

## 실제 RAP에 맞게 변경할 곳

1. `SAP_RAP_BASE_URL`, `SAP_RAP_EMPLOYEE_ENTITY_SET`을 실제 OData V4 서비스에 맞춘다. `SAP_RAP_CLIENT`는 선택 사항이다.
2. `Registry`의 `EMPLOYEE` 필터 정의에서 웹 필드와 SAP 필드 및 지원 연산자를 실제 `$metadata`에 맞춘다.
3. `SapValueHelpRepository`의 `FIELDS`와 `SELECT`를 실제 응답 속성에 맞춘다. 예제는 `EmployeeId`, `EmployeeName`, `DepartmentId`, `DepartmentName`, `CompanyCode`, `EmploymentStatus`를 선택하며 사원 ID와 이름을 문자열 필수값으로 취급한다. `$select` 대상 속성은 실제 서비스에 존재해야 한다.
4. `SapProfileApiTest`와 `SapValueHelpRepositoryTest`를 실제 계약에 맞춰 수정한다. 현재 테스트는 가짜 RAP 응답을 사용하며 실제 SAP 연결 여부를 보증하지 않는다.

`RapClient`는 쿼리 값을 URI 템플릿으로 한 번 인코딩하고, 연결 및 응답 시간 제한을 둔다. `SapValueHelpRepository`는 허용된 필터와 정렬 필드로 `$filter`, `$select`, `$top`, `$skip`, `$count`, `$orderby`를 생성하고 OData V4의 `value`와 `@odata.count`를 웹 응답에 매핑한다. 서비스가 이 쿼리 옵션을 지원해야 한다. 조회 오류나 응답 형식 오류는 공통 API에서 `502 SAP_ERROR`로 반환하며 상세 SAP 응답은 노출하지 않는다.

단건 조회는 `EmployeeId`에 대한 문자열 동등 필터를 사용한다. 사원 키는 유일한 문자열이라고 가정하며, 실제 서비스의 복합 키·유효기간·권한 조건은 별도 설계가 필요하다. 서버 주도 페이징의 `@odata.nextLink`는 아직 이어서 읽지 않으므로 응답에 포함되면 오류로 처리한다. 필요하면 페이지를 이어 읽는 기능을 추가해야 한다.
