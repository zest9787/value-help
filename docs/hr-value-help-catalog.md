# SAP HCM Value Help 예제 목록

이 목록은 HCM / S/4HANA 인사 업무에 활용할 수 있는 목 데이터 예제 40종이다. 회사별 커스터마이징, 국가, 적용 모듈과 서비스 범위가 다르므로 SAP에서 제공하는 모든 Value Help의 확정 목록은 아니다. `ValueHelpType`의 EntitySet, SAP 필드 이름과 `HrMockData`의 코드·이름은 실제 시스템의 표준 서비스나 실제 코드값이 아닌 예제다. 신규 항목은 기본적으로 두 개의 샘플 행을 포함하며 인사영역은 페이징 확인을 위해 총 26건을 제공한다.

| 업무 영역 | Value Help ID |
| --- | --- |
| 인사구조 | `COMPANY`, `PERSONNEL_AREA`, `PERSONNEL_SUBAREA`, `EMPLOYEE_GROUP`, `EMPLOYEE_SUBGROUP`, `PAYROLL_AREA`, `BUSINESS_AREA` |
| 조직 및 직무 | `DEPARTMENT`, `POSITION`, `JOB`, `JOB_FAMILY`, `COST_CENTER`, `WORK_LOCATION` |
| 인사관리 | `EMPLOYEE`, `PERSONNEL_ACTION`, `ACTION_REASON`, `EMPLOYMENT_STATUS`, `CONTRACT_TYPE` |
| 근태 | `WORK_SCHEDULE`, `SHIFT`, `ATTENDANCE_TYPE`, `ABSENCE_TYPE`, `ABSENCE_QUOTA_TYPE`, `HOLIDAY_CALENDAR`, `TIME_EVENT_TYPE` |
| 급여 | `CURRENCY`, `WAGE_TYPE`, `PAY_SCALE_TYPE`, `PAY_SCALE_AREA`, `PAY_SCALE_GROUP`, `PAY_SCALE_LEVEL` |
| 기본정보 | `COUNTRY`, `REGION`, `LANGUAGE`, `MARITAL_STATUS`, `NATIONALITY`, `BANK` |
| 인재관리 | `EDUCATION_LEVEL`, `QUALIFICATION`, `TRAINING_COURSE` |

화면에서 사용하는 검색조건과 컬럼은 `frontend/src/hrValueHelpConfig.ts`, 서버의 엔티티·필터 허용 목록은 `backend/src/main/java/com/example/valuehelp/registry/ValueHelpType.java`, 샘플 데이터는 `backend/src/main/java/com/example/valuehelp/repository/mock/HrMockData.java`에서 관리한다. 회사·부서·사원·통화도 같은 Enum에서 관리한다.

## 종속 검색 예시

| 대상 | 부모 필터 | 예제 |
| --- | --- | --- |
| 인사영역 | 회사 | `companyCode=1000` → `A100` |
| 인사하위영역 | 인사영역 | `personnelArea=A100` → `S110` |
| 사원하위그룹 | 사원그룹 | `employeeGroup=G1` → `SG1` |
| 인사발령 사유 | 인사발령 유형 | `actionType=A02` → `R02` |
| 지역 | 국가 | `country=KR` → `KR11` |
| 급여등급 그룹 | 급여등급 유형 | `payScaleType=PT01` → `PG01` |
| 급여등급 단계 | 급여등급 그룹 | `payScaleGroup=PG01` → `PL01` |

예를 들어 `POST /api/v1/value-helps/PERSONNEL_SUBAREA/search`에 다음을 전송한다.

```json
{"filters":{"personnelArea":"A100"},"page":0,"size":10,"sortField":"personnelSubarea","sortDirection":"asc"}
```

## 실제 SAP 연결 시 확인 사항

실제 서비스의 `$metadata`와 CDS, 고객 커스터마이징을 기준으로 EntitySet, 필드명, 검색 및 정렬 지원 여부, 부모 조건을 다시 매핑한다. 일부 값은 국가 그룹, 인사영역, 그룹핑, 유효기간 등의 복합 조건에 종속될 수 있다. 현재 예제의 키 단건 조회는 **단일 문자열 키**와 단순 부모 필터만 지원하므로 실제 복합 키나 유효기간을 처리하려면 API 계약과 저장소를 확장해야 한다. 현재 부서는 평면 목록이며 조직 계층 트리 조회는 구현되어 있지 않다. 인사·급여 데이터의 권한과 접근 범위는 실제 연동 계층에서 적용해야 한다.

범위를 정할 때 참고한 SAP 공식 문서: [Personnel Structure](https://help.sap.com/docs/ERP_HCM/d3bc4479e3344626be836c03a5c6962f/a645dd538636424de10000000a174cb4.html), [Organizational Assignment](https://help.sap.com/docs/ERP_HCM_SPV/d3bc4479e3344626be836c03a5c6962f/f465e65e7f994ec6b6eab889a5e6f763.html), [Absences/Attendances](https://help.sap.com/docs/ERP_HCM/fc1543655f9c422091f7ff85bd372c66/3ee9c053f89eb64ce10000000a174cb4.html).
