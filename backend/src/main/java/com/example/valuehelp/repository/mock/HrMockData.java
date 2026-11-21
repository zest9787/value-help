package com.example.valuehelp.repository.mock;

import java.util.*;

/** 데모용 가상 코드이며 실제 SAP 표준 코드가 아니다. */
final class HrMockData {
    private HrMockData() {}
    static Map<String, List<Map<String, Object>>> create() {
        Map<String, List<Map<String, Object>>> data = new LinkedHashMap<>();
        data.put("PERSONNEL_AREA", List.of(row("personnelArea", "A100", "personnelAreaName", "서울 인사영역", "companyCode", "1000"), row("personnelArea", "A200", "personnelAreaName", "부산 인사영역", "companyCode", "2000")));
        data.put("PERSONNEL_SUBAREA", List.of(row("personnelSubarea", "S110", "personnelSubareaName", "서울 사무직", "personnelArea", "A100"), row("personnelSubarea", "S210", "personnelSubareaName", "부산 현장직", "personnelArea", "A200")));
        data.put("EMPLOYEE_GROUP", List.of(row("employeeGroup", "G1", "employeeGroupName", "정규직"), row("employeeGroup", "G2", "employeeGroupName", "비정규직")));
        data.put("EMPLOYEE_SUBGROUP", List.of(row("employeeSubgroup", "SG1", "employeeSubgroupName", "일반직", "employeeGroup", "G1"), row("employeeSubgroup", "SG2", "employeeSubgroupName", "계약직", "employeeGroup", "G2")));
        data.put("PAYROLL_AREA", List.of(row("payrollArea", "P1", "payrollAreaName", "월급여", "companyCode", "1000"), row("payrollArea", "P2", "payrollAreaName", "현장 월급여", "companyCode", "2000")));
        data.put("BUSINESS_AREA", List.of(row("businessArea", "B100", "businessAreaName", "국내사업"), row("businessArea", "B200", "businessAreaName", "해외사업")));
        data.put("POSITION", List.of(row("positionId", "POS100", "positionName", "인사 담당", "departmentId", "D101"), row("positionId", "POS200", "positionName", "개발 담당", "departmentId", "D102")));
        data.put("JOB", List.of(row("jobId", "JOB100", "jobName", "인사관리"), row("jobId", "JOB200", "jobName", "소프트웨어 개발")));
        data.put("JOB_FAMILY", List.of(row("jobFamilyId", "JF01", "jobFamilyName", "경영지원"), row("jobFamilyId", "JF02", "jobFamilyName", "기술")));
        data.put("COST_CENTER", List.of(row("costCenter", "CC100", "costCenterName", "본사 관리", "companyCode", "1000"), row("costCenter", "CC200", "costCenterName", "부산 영업", "companyCode", "2000")));
        data.put("WORK_LOCATION", List.of(row("workLocation", "L100", "workLocationName", "서울", "companyCode", "1000"), row("workLocation", "L200", "workLocationName", "부산", "companyCode", "2000")));
        data.put("PERSONNEL_ACTION", List.of(row("actionType", "A01", "actionTypeName", "입사"), row("actionType", "A02", "actionTypeName", "퇴직")));
        data.put("ACTION_REASON", List.of(row("actionReason", "R01", "actionReasonName", "신규 채용", "actionType", "A01"), row("actionReason", "R02", "actionReasonName", "자발적 퇴사", "actionType", "A02")));
        data.put("EMPLOYMENT_STATUS", List.of(row("employmentStatus", "ACTIVE", "employmentStatusName", "재직"), row("employmentStatus", "RETIRED", "employmentStatusName", "퇴직")));
        data.put("CONTRACT_TYPE", List.of(row("contractType", "CT01", "contractTypeName", "기간의 정함 없음"), row("contractType", "CT02", "contractTypeName", "기간제")));
        data.put("WORK_SCHEDULE", List.of(row("workSchedule", "WS01", "workScheduleName", "주 5일"), row("workSchedule", "WS02", "workScheduleName", "교대 근무")));
        data.put("SHIFT", List.of(row("shiftCode", "SH01", "shiftName", "주간조"), row("shiftCode", "SH02", "shiftName", "야간조")));
        data.put("ATTENDANCE_TYPE", List.of(row("attendanceType", "AT01", "attendanceTypeName", "정상 근무"), row("attendanceType", "AT02", "attendanceTypeName", "교육 참석")));
        data.put("ABSENCE_TYPE", List.of(row("absenceType", "AB01", "absenceTypeName", "연차 휴가"), row("absenceType", "AB02", "absenceTypeName", "병가")));
        data.put("ABSENCE_QUOTA_TYPE", List.of(row("quotaType", "Q01", "quotaTypeName", "연차"), row("quotaType", "Q02", "quotaTypeName", "병가 정원")));
        data.put("HOLIDAY_CALENDAR", List.of(row("holidayCalendar", "HC01", "holidayCalendarName", "한국 달력"), row("holidayCalendar", "HC02", "holidayCalendarName", "미국 달력")));
        data.put("TIME_EVENT_TYPE", List.of(row("timeEventType", "TE01", "timeEventTypeName", "출근"), row("timeEventType", "TE02", "timeEventTypeName", "퇴근")));
        data.put("WAGE_TYPE", List.of(row("wageType", "WT01", "wageTypeName", "기본급"), row("wageType", "WT02", "wageTypeName", "연장근로수당")));
        data.put("PAY_SCALE_TYPE", List.of(row("payScaleType", "PT01", "payScaleTypeName", "사무직"), row("payScaleType", "PT02", "payScaleTypeName", "현장직")));
        data.put("PAY_SCALE_AREA", List.of(row("payScaleArea", "PA01", "payScaleAreaName", "수도권"), row("payScaleArea", "PA02", "payScaleAreaName", "부산권")));
        data.put("PAY_SCALE_GROUP", List.of(row("payScaleGroup", "PG01", "payScaleGroupName", "일반직 등급", "payScaleType", "PT01"), row("payScaleGroup", "PG02", "payScaleGroupName", "현장직 등급", "payScaleType", "PT02")));
        data.put("PAY_SCALE_LEVEL", List.of(row("payScaleLevel", "PL01", "payScaleLevelName", "1단계", "payScaleGroup", "PG01"), row("payScaleLevel", "PL02", "payScaleLevelName", "2단계", "payScaleGroup", "PG02")));
        data.put("COUNTRY", List.of(row("country", "KR", "countryName", "대한민국"), row("country", "US", "countryName", "미국")));
        data.put("REGION", List.of(row("region", "KR11", "regionName", "서울", "country", "KR"), row("region", "USCA", "regionName", "캘리포니아", "country", "US")));
        data.put("LANGUAGE", List.of(row("language", "KO", "languageName", "한국어"), row("language", "EN", "languageName", "영어")));
        data.put("MARITAL_STATUS", List.of(row("maritalStatus", "M1", "maritalStatusName", "미혼"), row("maritalStatus", "M2", "maritalStatusName", "기혼")));
        data.put("NATIONALITY", List.of(row("nationality", "KR", "nationalityName", "대한민국"), row("nationality", "US", "nationalityName", "미국")));
        data.put("BANK", List.of(row("bankCode", "BK01", "bankName", "예시 은행 A"), row("bankCode", "BK02", "bankName", "예시 은행 B")));
        data.put("EDUCATION_LEVEL", List.of(row("educationLevel", "ED01", "educationLevelName", "고등학교"), row("educationLevel", "ED02", "educationLevelName", "대학교")));
        data.put("QUALIFICATION", List.of(row("qualificationId", "QU01", "qualificationName", "정보기술 자격"), row("qualificationId", "QU02", "qualificationName", "회계 자격")));
        data.put("TRAINING_COURSE", List.of(row("courseId", "TR01", "courseName", "정보보호 교육"), row("courseId", "TR02", "courseName", "리더십 교육")));
        // 회사별 필터를 적용한 상태에서도 기본 페이지 크기 10건을 넘도록 구성한다.
        List<Map<String, Object>> areas = new ArrayList<>(data.get("PERSONNEL_AREA"));
        for (int i = 1; i <= 12; i++) {
            areas.add(row("personnelArea", String.format(Locale.ROOT, "A%03d", 100 + i),
                    "personnelAreaName", String.format(Locale.ROOT, "서울 인사영역 %02d", i), "companyCode", "1000"));
            areas.add(row("personnelArea", String.format(Locale.ROOT, "A%03d", 200 + i),
                    "personnelAreaName", String.format(Locale.ROOT, "부산 인사영역 %02d", i), "companyCode", "2000"));
        }
        data.put("PERSONNEL_AREA", List.copyOf(areas));
        return data;
    }
    private static Map<String, Object> row(String... values) {
        Map<String, Object> result = new LinkedHashMap<>();
        for (int i = 0; i < values.length; i += 2) result.put(values[i], values[i + 1]);
        return result;
    }
}
