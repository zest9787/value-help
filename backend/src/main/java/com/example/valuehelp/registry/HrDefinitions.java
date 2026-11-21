package com.example.valuehelp.registry;

import java.util.List;
import java.util.Set;

/** HCM 업무용 예제. EntitySet은 실제 SAP 서비스 연결 시 교체한다. */
final class HrDefinitions {
    private HrDefinitions() {}
    static void register(Registry registry) {
        registry.add("PERSONNEL_AREA", "PersonnelAreaValues", "personnelArea", "personnelAreaName", List.of(Registry.filter("personnelAreaName", "contains"), Registry.filter("companyCode", "eq")), Set.of("personnelArea", "personnelAreaName", "companyCode"));
        registry.add("PERSONNEL_SUBAREA", "PersonnelSubareaValues", "personnelSubarea", "personnelSubareaName", List.of(Registry.filter("personnelSubareaName", "contains"), Registry.filter("personnelArea", "eq")), Set.of("personnelSubarea", "personnelSubareaName", "personnelArea"));
        registry.add("EMPLOYEE_GROUP", "EmployeeGroupValues", "employeeGroup", "employeeGroupName", List.of(Registry.filter("employeeGroupName", "contains")), Set.of("employeeGroup", "employeeGroupName"));
        registry.add("EMPLOYEE_SUBGROUP", "EmployeeSubgroupValues", "employeeSubgroup", "employeeSubgroupName", List.of(Registry.filter("employeeSubgroupName", "contains"), Registry.filter("employeeGroup", "eq")), Set.of("employeeSubgroup", "employeeSubgroupName", "employeeGroup"));
        registry.add("PAYROLL_AREA", "PayrollAreaValues", "payrollArea", "payrollAreaName", List.of(Registry.filter("payrollAreaName", "contains"), Registry.filter("companyCode", "eq")), Set.of("payrollArea", "payrollAreaName", "companyCode"));
        registry.add("BUSINESS_AREA", "BusinessAreaValues", "businessArea", "businessAreaName", List.of(Registry.filter("businessAreaName", "contains")), Set.of("businessArea", "businessAreaName"));
        registry.add("POSITION", "PositionValues", "positionId", "positionName", List.of(Registry.filter("positionName", "contains"), Registry.filter("departmentId", "eq")), Set.of("positionId", "positionName", "departmentId"));
        registry.add("JOB", "JobValues", "jobId", "jobName", List.of(Registry.filter("jobName", "contains")), Set.of("jobId", "jobName"));
        registry.add("JOB_FAMILY", "JobFamilyValues", "jobFamilyId", "jobFamilyName", List.of(Registry.filter("jobFamilyName", "contains")), Set.of("jobFamilyId", "jobFamilyName"));
        registry.add("COST_CENTER", "CostCenterValues", "costCenter", "costCenterName", List.of(Registry.filter("costCenterName", "contains"), Registry.filter("companyCode", "eq")), Set.of("costCenter", "costCenterName", "companyCode"));
        registry.add("WORK_LOCATION", "WorkLocationValues", "workLocation", "workLocationName", List.of(Registry.filter("workLocationName", "contains"), Registry.filter("companyCode", "eq")), Set.of("workLocation", "workLocationName", "companyCode"));
        registry.add("PERSONNEL_ACTION", "PersonnelActionValues", "actionType", "actionTypeName", List.of(Registry.filter("actionTypeName", "contains")), Set.of("actionType", "actionTypeName"));
        registry.add("ACTION_REASON", "ActionReasonValues", "actionReason", "actionReasonName", List.of(Registry.filter("actionReasonName", "contains"), Registry.filter("actionType", "eq")), Set.of("actionReason", "actionReasonName", "actionType"));
        registry.add("EMPLOYMENT_STATUS", "EmploymentStatusValues", "employmentStatus", "employmentStatusName", List.of(Registry.filter("employmentStatusName", "contains")), Set.of("employmentStatus", "employmentStatusName"));
        registry.add("CONTRACT_TYPE", "ContractTypeValues", "contractType", "contractTypeName", List.of(Registry.filter("contractTypeName", "contains")), Set.of("contractType", "contractTypeName"));
        registry.add("WORK_SCHEDULE", "WorkScheduleValues", "workSchedule", "workScheduleName", List.of(Registry.filter("workScheduleName", "contains")), Set.of("workSchedule", "workScheduleName"));
        registry.add("SHIFT", "ShiftValues", "shiftCode", "shiftName", List.of(Registry.filter("shiftName", "contains")), Set.of("shiftCode", "shiftName"));
        registry.add("ATTENDANCE_TYPE", "AttendanceTypeValues", "attendanceType", "attendanceTypeName", List.of(Registry.filter("attendanceTypeName", "contains")), Set.of("attendanceType", "attendanceTypeName"));
        registry.add("ABSENCE_TYPE", "AbsenceTypeValues", "absenceType", "absenceTypeName", List.of(Registry.filter("absenceTypeName", "contains")), Set.of("absenceType", "absenceTypeName"));
        registry.add("ABSENCE_QUOTA_TYPE", "AbsenceQuotaTypeValues", "quotaType", "quotaTypeName", List.of(Registry.filter("quotaTypeName", "contains")), Set.of("quotaType", "quotaTypeName"));
        registry.add("HOLIDAY_CALENDAR", "HolidayCalendarValues", "holidayCalendar", "holidayCalendarName", List.of(Registry.filter("holidayCalendarName", "contains")), Set.of("holidayCalendar", "holidayCalendarName"));
        registry.add("TIME_EVENT_TYPE", "TimeEventTypeValues", "timeEventType", "timeEventTypeName", List.of(Registry.filter("timeEventTypeName", "contains")), Set.of("timeEventType", "timeEventTypeName"));
        registry.add("WAGE_TYPE", "WageTypeValues", "wageType", "wageTypeName", List.of(Registry.filter("wageTypeName", "contains")), Set.of("wageType", "wageTypeName"));
        registry.add("PAY_SCALE_TYPE", "PayScaleTypeValues", "payScaleType", "payScaleTypeName", List.of(Registry.filter("payScaleTypeName", "contains")), Set.of("payScaleType", "payScaleTypeName"));
        registry.add("PAY_SCALE_AREA", "PayScaleAreaValues", "payScaleArea", "payScaleAreaName", List.of(Registry.filter("payScaleAreaName", "contains")), Set.of("payScaleArea", "payScaleAreaName"));
        registry.add("PAY_SCALE_GROUP", "PayScaleGroupValues", "payScaleGroup", "payScaleGroupName", List.of(Registry.filter("payScaleGroupName", "contains"), Registry.filter("payScaleType", "eq")), Set.of("payScaleGroup", "payScaleGroupName", "payScaleType"));
        registry.add("PAY_SCALE_LEVEL", "PayScaleLevelValues", "payScaleLevel", "payScaleLevelName", List.of(Registry.filter("payScaleLevelName", "contains"), Registry.filter("payScaleGroup", "eq")), Set.of("payScaleLevel", "payScaleLevelName", "payScaleGroup"));
        registry.add("COUNTRY", "CountryValues", "country", "countryName", List.of(Registry.filter("countryName", "contains")), Set.of("country", "countryName"));
        registry.add("REGION", "RegionValues", "region", "regionName", List.of(Registry.filter("regionName", "contains"), Registry.filter("country", "eq")), Set.of("region", "regionName", "country"));
        registry.add("LANGUAGE", "LanguageValues", "language", "languageName", List.of(Registry.filter("languageName", "contains")), Set.of("language", "languageName"));
        registry.add("MARITAL_STATUS", "MaritalStatusValues", "maritalStatus", "maritalStatusName", List.of(Registry.filter("maritalStatusName", "contains")), Set.of("maritalStatus", "maritalStatusName"));
        registry.add("NATIONALITY", "NationalityValues", "nationality", "nationalityName", List.of(Registry.filter("nationalityName", "contains")), Set.of("nationality", "nationalityName"));
        registry.add("BANK", "BankValues", "bankCode", "bankName", List.of(Registry.filter("bankName", "contains")), Set.of("bankCode", "bankName"));
        registry.add("EDUCATION_LEVEL", "EducationLevelValues", "educationLevel", "educationLevelName", List.of(Registry.filter("educationLevelName", "contains")), Set.of("educationLevel", "educationLevelName"));
        registry.add("QUALIFICATION", "QualificationValues", "qualificationId", "qualificationName", List.of(Registry.filter("qualificationName", "contains")), Set.of("qualificationId", "qualificationName"));
        registry.add("TRAINING_COURSE", "TrainingCourseValues", "courseId", "courseName", List.of(Registry.filter("courseName", "contains")), Set.of("courseId", "courseName"));
    }
}
