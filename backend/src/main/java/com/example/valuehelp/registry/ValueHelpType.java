package com.example.valuehelp.registry;

import com.example.valuehelp.dto.Metadata;
import java.util.*;
import static com.example.valuehelp.registry.FilterOperator.*;

/** 단일 카탈로그. 각 필드에 SAP 이름·검색 연산자·정렬 허용 여부를 함께 선언한다. */
public enum ValueHelpType {
    COMPANY("CompanyCodes", "companyCode", "companyName",
            new FieldDefinition("companyCode", "CompanyCode", EQ, true),
            new FieldDefinition("companyName", "CompanyName", CONTAINS, true),
            new FieldDefinition("country", "Country", NONE, true)),

    DEPARTMENT("Departments", "departmentId", "departmentName",
            new FieldDefinition("departmentId", "DepartmentId", NONE, true),
            new FieldDefinition("departmentName", "DepartmentName", CONTAINS, true),
            new FieldDefinition("companyCode", "CompanyCode", EQ, true)),

    EMPLOYEE("Employees", "employeeId", "employeeName",
            new FieldDefinition("employeeId", "EmployeeId", NONE, true),
            new FieldDefinition("employeeName", "EmployeeName", CONTAINS, true),
            new FieldDefinition("departmentId", "DepartmentId", EQ, false),
            new FieldDefinition("departmentName", "DepartmentName", NONE, true),
            new FieldDefinition("companyCode", "CompanyCode", EQ, true),
            new FieldDefinition("employmentStatus", "EmploymentStatus", EQ, true)),

    CURRENCY("Currencies", "currency", "currencyName",
            new FieldDefinition("currency", "Currency", NONE, true),
            new FieldDefinition("currencyName", "CurrencyName", NONE, true)),

    PERSONNEL_AREA("PersonnelAreaValues", "personnelArea", "personnelAreaName",
            new FieldDefinition("personnelArea", "PersonnelArea", NONE, true),
            new FieldDefinition("personnelAreaName", "PersonnelAreaName", CONTAINS, true),
            new FieldDefinition("companyCode", "CompanyCode", EQ, true)),

    PERSONNEL_SUBAREA("PersonnelSubareaValues", "personnelSubarea", "personnelSubareaName",
            new FieldDefinition("personnelSubarea", "PersonnelSubarea", NONE, true),
            new FieldDefinition("personnelSubareaName", "PersonnelSubareaName", CONTAINS, true),
            new FieldDefinition("personnelArea", "PersonnelArea", EQ, true)),

    EMPLOYEE_GROUP("EmployeeGroupValues", "employeeGroup", "employeeGroupName",
            new FieldDefinition("employeeGroup", "EmployeeGroup", NONE, true),
            new FieldDefinition("employeeGroupName", "EmployeeGroupName", CONTAINS, true)),

    EMPLOYEE_SUBGROUP("EmployeeSubgroupValues", "employeeSubgroup", "employeeSubgroupName",
            new FieldDefinition("employeeSubgroup", "EmployeeSubgroup", NONE, true),
            new FieldDefinition("employeeSubgroupName", "EmployeeSubgroupName", CONTAINS, true),
            new FieldDefinition("employeeGroup", "EmployeeGroup", EQ, true)),

    PAYROLL_AREA("PayrollAreaValues", "payrollArea", "payrollAreaName",
            new FieldDefinition("payrollArea", "PayrollArea", NONE, true),
            new FieldDefinition("payrollAreaName", "PayrollAreaName", CONTAINS, true),
            new FieldDefinition("companyCode", "CompanyCode", EQ, true)),

    BUSINESS_AREA("BusinessAreaValues", "businessArea", "businessAreaName",
            new FieldDefinition("businessArea", "BusinessArea", NONE, true),
            new FieldDefinition("businessAreaName", "BusinessAreaName", CONTAINS, true)),

    POSITION("PositionValues", "positionId", "positionName",
            new FieldDefinition("positionId", "PositionId", NONE, true),
            new FieldDefinition("positionName", "PositionName", CONTAINS, true),
            new FieldDefinition("departmentId", "DepartmentId", EQ, true)),

    JOB("JobValues", "jobId", "jobName",
            new FieldDefinition("jobId", "JobId", NONE, true),
            new FieldDefinition("jobName", "JobName", CONTAINS, true)),

    JOB_FAMILY("JobFamilyValues", "jobFamilyId", "jobFamilyName",
            new FieldDefinition("jobFamilyId", "JobFamilyId", NONE, true),
            new FieldDefinition("jobFamilyName", "JobFamilyName", CONTAINS, true)),

    COST_CENTER("CostCenterValues", "costCenter", "costCenterName",
            new FieldDefinition("costCenter", "CostCenter", NONE, true),
            new FieldDefinition("costCenterName", "CostCenterName", CONTAINS, true),
            new FieldDefinition("companyCode", "CompanyCode", EQ, true)),

    WORK_LOCATION("WorkLocationValues", "workLocation", "workLocationName",
            new FieldDefinition("workLocation", "WorkLocation", NONE, true),
            new FieldDefinition("workLocationName", "WorkLocationName", CONTAINS, true),
            new FieldDefinition("companyCode", "CompanyCode", EQ, true)),

    PERSONNEL_ACTION("PersonnelActionValues", "actionType", "actionTypeName",
            new FieldDefinition("actionType", "ActionType", NONE, true),
            new FieldDefinition("actionTypeName", "ActionTypeName", CONTAINS, true)),

    ACTION_REASON("ActionReasonValues", "actionReason", "actionReasonName",
            new FieldDefinition("actionReason", "ActionReason", NONE, true),
            new FieldDefinition("actionReasonName", "ActionReasonName", CONTAINS, true),
            new FieldDefinition("actionType", "ActionType", EQ, true)),

    EMPLOYMENT_STATUS("EmploymentStatusValues", "employmentStatus", "employmentStatusName",
            new FieldDefinition("employmentStatus", "EmploymentStatus", NONE, true),
            new FieldDefinition("employmentStatusName", "EmploymentStatusName", CONTAINS, true)),

    CONTRACT_TYPE("ContractTypeValues", "contractType", "contractTypeName",
            new FieldDefinition("contractType", "ContractType", NONE, true),
            new FieldDefinition("contractTypeName", "ContractTypeName", CONTAINS, true)),

    WORK_SCHEDULE("WorkScheduleValues", "workSchedule", "workScheduleName",
            new FieldDefinition("workSchedule", "WorkSchedule", NONE, true),
            new FieldDefinition("workScheduleName", "WorkScheduleName", CONTAINS, true)),

    SHIFT("ShiftValues", "shiftCode", "shiftName",
            new FieldDefinition("shiftCode", "ShiftCode", NONE, true),
            new FieldDefinition("shiftName", "ShiftName", CONTAINS, true)),

    ATTENDANCE_TYPE("AttendanceTypeValues", "attendanceType", "attendanceTypeName",
            new FieldDefinition("attendanceType", "AttendanceType", NONE, true),
            new FieldDefinition("attendanceTypeName", "AttendanceTypeName", CONTAINS, true)),

    ABSENCE_TYPE("AbsenceTypeValues", "absenceType", "absenceTypeName",
            new FieldDefinition("absenceType", "AbsenceType", NONE, true),
            new FieldDefinition("absenceTypeName", "AbsenceTypeName", CONTAINS, true)),

    ABSENCE_QUOTA_TYPE("AbsenceQuotaTypeValues", "quotaType", "quotaTypeName",
            new FieldDefinition("quotaType", "QuotaType", NONE, true),
            new FieldDefinition("quotaTypeName", "QuotaTypeName", CONTAINS, true)),

    HOLIDAY_CALENDAR("HolidayCalendarValues", "holidayCalendar", "holidayCalendarName",
            new FieldDefinition("holidayCalendar", "HolidayCalendar", NONE, true),
            new FieldDefinition("holidayCalendarName", "HolidayCalendarName", CONTAINS, true)),

    TIME_EVENT_TYPE("TimeEventTypeValues", "timeEventType", "timeEventTypeName",
            new FieldDefinition("timeEventType", "TimeEventType", NONE, true),
            new FieldDefinition("timeEventTypeName", "TimeEventTypeName", CONTAINS, true)),

    WAGE_TYPE("WageTypeValues", "wageType", "wageTypeName",
            new FieldDefinition("wageType", "WageType", NONE, true),
            new FieldDefinition("wageTypeName", "WageTypeName", CONTAINS, true)),

    PAY_SCALE_TYPE("PayScaleTypeValues", "payScaleType", "payScaleTypeName",
            new FieldDefinition("payScaleType", "PayScaleType", NONE, true),
            new FieldDefinition("payScaleTypeName", "PayScaleTypeName", CONTAINS, true)),

    PAY_SCALE_AREA("PayScaleAreaValues", "payScaleArea", "payScaleAreaName",
            new FieldDefinition("payScaleArea", "PayScaleArea", NONE, true),
            new FieldDefinition("payScaleAreaName", "PayScaleAreaName", CONTAINS, true)),

    PAY_SCALE_GROUP("PayScaleGroupValues", "payScaleGroup", "payScaleGroupName",
            new FieldDefinition("payScaleGroup", "PayScaleGroup", NONE, true),
            new FieldDefinition("payScaleGroupName", "PayScaleGroupName", CONTAINS, true),
            new FieldDefinition("payScaleType", "PayScaleType", EQ, true)),

    PAY_SCALE_LEVEL("PayScaleLevelValues", "payScaleLevel", "payScaleLevelName",
            new FieldDefinition("payScaleLevel", "PayScaleLevel", NONE, true),
            new FieldDefinition("payScaleLevelName", "PayScaleLevelName", CONTAINS, true),
            new FieldDefinition("payScaleGroup", "PayScaleGroup", EQ, true)),

    COUNTRY("CountryValues", "country", "countryName",
            new FieldDefinition("country", "Country", NONE, true),
            new FieldDefinition("countryName", "CountryName", CONTAINS, true)),

    REGION("RegionValues", "region", "regionName",
            new FieldDefinition("region", "Region", NONE, true),
            new FieldDefinition("regionName", "RegionName", CONTAINS, true),
            new FieldDefinition("country", "Country", EQ, true)),

    LANGUAGE("LanguageValues", "language", "languageName",
            new FieldDefinition("language", "Language", NONE, true),
            new FieldDefinition("languageName", "LanguageName", CONTAINS, true)),

    MARITAL_STATUS("MaritalStatusValues", "maritalStatus", "maritalStatusName",
            new FieldDefinition("maritalStatus", "MaritalStatus", NONE, true),
            new FieldDefinition("maritalStatusName", "MaritalStatusName", CONTAINS, true)),

    NATIONALITY("NationalityValues", "nationality", "nationalityName",
            new FieldDefinition("nationality", "Nationality", NONE, true),
            new FieldDefinition("nationalityName", "NationalityName", CONTAINS, true)),

    BANK("BankValues", "bankCode", "bankName",
            new FieldDefinition("bankCode", "BankCode", NONE, true),
            new FieldDefinition("bankName", "BankName", CONTAINS, true)),

    EDUCATION_LEVEL("EducationLevelValues", "educationLevel", "educationLevelName",
            new FieldDefinition("educationLevel", "EducationLevel", NONE, true),
            new FieldDefinition("educationLevelName", "EducationLevelName", CONTAINS, true)),

    QUALIFICATION("QualificationValues", "qualificationId", "qualificationName",
            new FieldDefinition("qualificationId", "QualificationId", NONE, true),
            new FieldDefinition("qualificationName", "QualificationName", CONTAINS, true)),

    TRAINING_COURSE("TrainingCourseValues", "courseId", "courseName",
            new FieldDefinition("courseId", "CourseId", NONE, true),
            new FieldDefinition("courseName", "CourseName", CONTAINS, true));

    private final Definition definition;

    ValueHelpType(String entitySet, String key, String text, FieldDefinition... fields) {
        Set<String> names = new HashSet<>();
        List<Filter> filters = new ArrayList<>();
        Set<String> sorts = new LinkedHashSet<>();
        for (FieldDefinition field : fields) {
            if (!names.add(field.webField()))
                throw new IllegalArgumentException("중복 필드: " + field.webField());
            if (field.filter() != NONE)
                filters.add(new Filter(field.webField(), field.sapField(), field.filter()));
            if (field.sortable()) sorts.add(field.webField());
        }
        definition = new Definition(entitySet, new Metadata(name(), key, text), List.copyOf(filters), Set.copyOf(sorts));
    }

    public Definition definition() { return definition; }
}
