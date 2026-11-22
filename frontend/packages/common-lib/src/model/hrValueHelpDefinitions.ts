import type { ValueHelpDefinitions } from './config';

/** HCM 데모 화면 기본값. 실제 SAP 필드는 서비스 계약에 맞게 조정한다. */
export const hrValueHelpDefinitions: ValueHelpDefinitions = {
  COMPANY: {
    title: '회사 검색',
    displayFormat: 'textCode',
    searchFields: [{ name: 'companyName', label: '회사명', type: 'text' }],
    columns: [
      { field: 'companyCode', headerName: '회사코드' },
      { field: 'companyName', headerName: '회사명' },
      { field: 'country', headerName: '국가' },
    ],
  },
  DEPARTMENT: {
    title: '부서 검색',
    searchFields: [{ name: 'departmentName', label: '부서명', type: 'text' }],
    columns: [
      { field: 'departmentId', headerName: '부서코드' },
      { field: 'departmentName', headerName: '부서명' },
      { field: 'companyCode', headerName: '회사코드' },
    ],
  },
  EMPLOYEE: {
    title: '사원 검색',
    displayFormat: 'textCode',
    modal: { size: 'L' },
    searchFields: [
      { name: 'companyCode', label: '회사', type: 'valueHelp', valueHelpId: 'COMPANY' },
      { name: 'employeeName', label: '사원명', type: 'text' },
      {
        name: 'departmentId',
        label: '부서',
        type: 'valueHelp',
        valueHelpId: 'DEPARTMENT',
        dependsOn: ['companyCode'],
      },
      {
        name: 'employmentStatus',
        label: '재직상태',
        type: 'select',
        options: [
          { label: '재직', value: 'ACTIVE' },
          { label: '퇴직', value: 'RETIRED' },
        ],
      },
    ],
    columns: [
      { field: 'employeeId', headerName: '사번' },
      { field: 'employeeName', headerName: '사원명' },
      { field: 'departmentName', headerName: '부서' },
      { field: 'companyCode', headerName: '회사코드' },
      { field: 'employmentStatus', headerName: '상태' },
    ],
  },
  CURRENCY: {
    title: '통화 선택',
    selectionMode: 'multiple',
    modal: { size: 'S' },
    searchFields: [],
    columns: [
      { field: 'currency', headerName: '통화코드' },
      { field: 'currencyName', headerName: '통화명' },
    ],
  },
  PERSONNEL_AREA: {
    title: '인사영역 검색',
    searchFields: [
      { name: 'companyCode', label: '회사', type: 'valueHelp', valueHelpId: 'COMPANY' },
      { name: 'personnelAreaName', label: '인사영역명', type: 'text' },
    ],
    columns: [
      { field: 'personnelArea', headerName: '코드' },
      { field: 'personnelAreaName', headerName: '인사영역' },
      { field: 'companyCode', headerName: '회사 코드' },
    ],
  },
  PERSONNEL_SUBAREA: {
    title: '인사하위영역 검색',
    searchFields: [
      {
        name: 'personnelArea',
        label: '인사영역',
        type: 'valueHelp',
        valueHelpId: 'PERSONNEL_AREA',
      },
      { name: 'personnelSubareaName', label: '인사하위영역명', type: 'text' },
    ],
    columns: [
      { field: 'personnelSubarea', headerName: '코드' },
      { field: 'personnelSubareaName', headerName: '인사하위영역' },
      { field: 'personnelArea', headerName: '인사영역 코드' },
    ],
  },
  EMPLOYEE_GROUP: {
    title: '사원그룹 검색',
    searchFields: [{ name: 'employeeGroupName', label: '사원그룹명', type: 'text' }],
    columns: [
      { field: 'employeeGroup', headerName: '코드' },
      { field: 'employeeGroupName', headerName: '사원그룹' },
    ],
  },
  EMPLOYEE_SUBGROUP: {
    title: '사원하위그룹 검색',
    searchFields: [
      {
        name: 'employeeGroup',
        label: '사원그룹',
        type: 'valueHelp',
        valueHelpId: 'EMPLOYEE_GROUP',
      },
      { name: 'employeeSubgroupName', label: '사원하위그룹명', type: 'text' },
    ],
    columns: [
      { field: 'employeeSubgroup', headerName: '코드' },
      { field: 'employeeSubgroupName', headerName: '사원하위그룹' },
      { field: 'employeeGroup', headerName: '사원그룹 코드' },
    ],
  },
  PAYROLL_AREA: {
    title: '급여영역 검색',
    searchFields: [
      { name: 'companyCode', label: '회사', type: 'valueHelp', valueHelpId: 'COMPANY' },
      { name: 'payrollAreaName', label: '급여영역명', type: 'text' },
    ],
    columns: [
      { field: 'payrollArea', headerName: '코드' },
      { field: 'payrollAreaName', headerName: '급여영역' },
      { field: 'companyCode', headerName: '회사 코드' },
    ],
  },
  BUSINESS_AREA: {
    title: '사업영역 검색',
    searchFields: [{ name: 'businessAreaName', label: '사업영역명', type: 'text' }],
    columns: [
      { field: 'businessArea', headerName: '코드' },
      { field: 'businessAreaName', headerName: '사업영역' },
    ],
  },
  POSITION: {
    title: '포지션(직위) 검색',
    searchFields: [
      { name: 'departmentId', label: '부서', type: 'valueHelp', valueHelpId: 'DEPARTMENT' },
      { name: 'positionName', label: '포지션(직위)명', type: 'text' },
    ],
    columns: [
      { field: 'positionId', headerName: '코드' },
      { field: 'positionName', headerName: '포지션(직위)' },
      { field: 'departmentId', headerName: '부서 코드' },
    ],
  },
  JOB: {
    title: '직무 검색',
    searchFields: [{ name: 'jobName', label: '직무명', type: 'text' }],
    columns: [
      { field: 'jobId', headerName: '코드' },
      { field: 'jobName', headerName: '직무' },
    ],
  },
  JOB_FAMILY: {
    title: '직무군 검색',
    searchFields: [{ name: 'jobFamilyName', label: '직무군명', type: 'text' }],
    columns: [
      { field: 'jobFamilyId', headerName: '코드' },
      { field: 'jobFamilyName', headerName: '직무군' },
    ],
  },
  COST_CENTER: {
    title: '코스트센터 검색',
    searchFields: [
      { name: 'companyCode', label: '회사', type: 'valueHelp', valueHelpId: 'COMPANY' },
      { name: 'costCenterName', label: '코스트센터명', type: 'text' },
    ],
    columns: [
      { field: 'costCenter', headerName: '코드' },
      { field: 'costCenterName', headerName: '코스트센터' },
      { field: 'companyCode', headerName: '회사 코드' },
    ],
  },
  WORK_LOCATION: {
    title: '근무지 검색',
    searchFields: [
      { name: 'companyCode', label: '회사', type: 'valueHelp', valueHelpId: 'COMPANY' },
      { name: 'workLocationName', label: '근무지명', type: 'text' },
    ],
    columns: [
      { field: 'workLocation', headerName: '코드' },
      { field: 'workLocationName', headerName: '근무지' },
      { field: 'companyCode', headerName: '회사 코드' },
    ],
  },
  PERSONNEL_ACTION: {
    title: '인사발령 유형 검색',
    searchFields: [{ name: 'actionTypeName', label: '인사발령 유형명', type: 'text' }],
    columns: [
      { field: 'actionType', headerName: '코드' },
      { field: 'actionTypeName', headerName: '인사발령 유형' },
    ],
  },
  ACTION_REASON: {
    title: '인사발령 사유 검색',
    searchFields: [
      {
        name: 'actionType',
        label: '발령 유형',
        type: 'valueHelp',
        valueHelpId: 'PERSONNEL_ACTION',
      },
      { name: 'actionReasonName', label: '인사발령 사유명', type: 'text' },
    ],
    columns: [
      { field: 'actionReason', headerName: '코드' },
      { field: 'actionReasonName', headerName: '인사발령 사유' },
      { field: 'actionType', headerName: '발령 유형 코드' },
    ],
  },
  EMPLOYMENT_STATUS: {
    title: '고용 상태 검색',
    searchFields: [{ name: 'employmentStatusName', label: '고용 상태명', type: 'text' }],
    columns: [
      { field: 'employmentStatus', headerName: '코드' },
      { field: 'employmentStatusName', headerName: '고용 상태' },
    ],
  },
  CONTRACT_TYPE: {
    title: '계약 유형 검색',
    searchFields: [{ name: 'contractTypeName', label: '계약 유형명', type: 'text' }],
    columns: [
      { field: 'contractType', headerName: '코드' },
      { field: 'contractTypeName', headerName: '계약 유형' },
    ],
  },
  WORK_SCHEDULE: {
    title: '근무계획 규칙 검색',
    searchFields: [{ name: 'workScheduleName', label: '근무계획 규칙명', type: 'text' }],
    columns: [
      { field: 'workSchedule', headerName: '코드' },
      { field: 'workScheduleName', headerName: '근무계획 규칙' },
    ],
  },
  SHIFT: {
    title: '근무조 검색',
    searchFields: [{ name: 'shiftName', label: '근무조명', type: 'text' }],
    columns: [
      { field: 'shiftCode', headerName: '코드' },
      { field: 'shiftName', headerName: '근무조' },
    ],
  },
  ATTENDANCE_TYPE: {
    title: '출근 유형 검색',
    searchFields: [{ name: 'attendanceTypeName', label: '출근 유형명', type: 'text' }],
    columns: [
      { field: 'attendanceType', headerName: '코드' },
      { field: 'attendanceTypeName', headerName: '출근 유형' },
    ],
  },
  ABSENCE_TYPE: {
    title: '결근 유형 검색',
    searchFields: [{ name: 'absenceTypeName', label: '결근 유형명', type: 'text' }],
    columns: [
      { field: 'absenceType', headerName: '코드' },
      { field: 'absenceTypeName', headerName: '결근 유형' },
    ],
  },
  ABSENCE_QUOTA_TYPE: {
    title: '휴가 정원 유형 검색',
    searchFields: [{ name: 'quotaTypeName', label: '휴가 정원 유형명', type: 'text' }],
    columns: [
      { field: 'quotaType', headerName: '코드' },
      { field: 'quotaTypeName', headerName: '휴가 정원 유형' },
    ],
  },
  HOLIDAY_CALENDAR: {
    title: '휴일 달력 검색',
    searchFields: [{ name: 'holidayCalendarName', label: '휴일 달력명', type: 'text' }],
    columns: [
      { field: 'holidayCalendar', headerName: '코드' },
      { field: 'holidayCalendarName', headerName: '휴일 달력' },
    ],
  },
  TIME_EVENT_TYPE: {
    title: '시간 이벤트 유형 검색',
    searchFields: [{ name: 'timeEventTypeName', label: '시간 이벤트 유형명', type: 'text' }],
    columns: [
      { field: 'timeEventType', headerName: '코드' },
      { field: 'timeEventTypeName', headerName: '시간 이벤트 유형' },
    ],
  },
  WAGE_TYPE: {
    title: '임금 유형 검색',
    searchFields: [{ name: 'wageTypeName', label: '임금 유형명', type: 'text' }],
    columns: [
      { field: 'wageType', headerName: '코드' },
      { field: 'wageTypeName', headerName: '임금 유형' },
    ],
  },
  PAY_SCALE_TYPE: {
    title: '급여등급 유형 검색',
    searchFields: [{ name: 'payScaleTypeName', label: '급여등급 유형명', type: 'text' }],
    columns: [
      { field: 'payScaleType', headerName: '코드' },
      { field: 'payScaleTypeName', headerName: '급여등급 유형' },
    ],
  },
  PAY_SCALE_AREA: {
    title: '급여등급 영역 검색',
    searchFields: [{ name: 'payScaleAreaName', label: '급여등급 영역명', type: 'text' }],
    columns: [
      { field: 'payScaleArea', headerName: '코드' },
      { field: 'payScaleAreaName', headerName: '급여등급 영역' },
    ],
  },
  PAY_SCALE_GROUP: {
    title: '급여등급 그룹 검색',
    searchFields: [
      {
        name: 'payScaleType',
        label: '급여등급 유형',
        type: 'valueHelp',
        valueHelpId: 'PAY_SCALE_TYPE',
      },
      { name: 'payScaleGroupName', label: '급여등급 그룹명', type: 'text' },
    ],
    columns: [
      { field: 'payScaleGroup', headerName: '코드' },
      { field: 'payScaleGroupName', headerName: '급여등급 그룹' },
      { field: 'payScaleType', headerName: '급여등급 유형 코드' },
    ],
  },
  PAY_SCALE_LEVEL: {
    title: '급여등급 단계 검색',
    searchFields: [
      {
        name: 'payScaleGroup',
        label: '급여등급 그룹',
        type: 'valueHelp',
        valueHelpId: 'PAY_SCALE_GROUP',
      },
      { name: 'payScaleLevelName', label: '급여등급 단계명', type: 'text' },
    ],
    columns: [
      { field: 'payScaleLevel', headerName: '코드' },
      { field: 'payScaleLevelName', headerName: '급여등급 단계' },
      { field: 'payScaleGroup', headerName: '급여등급 그룹 코드' },
    ],
  },
  COUNTRY: {
    title: '국가 검색',
    searchFields: [{ name: 'countryName', label: '국가명', type: 'text' }],
    columns: [
      { field: 'country', headerName: '코드' },
      { field: 'countryName', headerName: '국가' },
    ],
  },
  REGION: {
    title: '지역 검색',
    searchFields: [
      { name: 'country', label: '국가', type: 'valueHelp', valueHelpId: 'COUNTRY' },
      { name: 'regionName', label: '지역명', type: 'text' },
    ],
    columns: [
      { field: 'region', headerName: '코드' },
      { field: 'regionName', headerName: '지역' },
      { field: 'country', headerName: '국가 코드' },
    ],
  },
  LANGUAGE: {
    title: '언어 검색',
    searchFields: [{ name: 'languageName', label: '언어명', type: 'text' }],
    columns: [
      { field: 'language', headerName: '코드' },
      { field: 'languageName', headerName: '언어' },
    ],
  },
  MARITAL_STATUS: {
    title: '혼인 상태 검색',
    searchFields: [{ name: 'maritalStatusName', label: '혼인 상태명', type: 'text' }],
    columns: [
      { field: 'maritalStatus', headerName: '코드' },
      { field: 'maritalStatusName', headerName: '혼인 상태' },
    ],
  },
  NATIONALITY: {
    title: '국적 검색',
    searchFields: [{ name: 'nationalityName', label: '국적명', type: 'text' }],
    columns: [
      { field: 'nationality', headerName: '코드' },
      { field: 'nationalityName', headerName: '국적' },
    ],
  },
  BANK: {
    title: '은행 검색',
    searchFields: [{ name: 'bankName', label: '은행명', type: 'text' }],
    columns: [
      { field: 'bankCode', headerName: '코드' },
      { field: 'bankName', headerName: '은행' },
    ],
  },
  EDUCATION_LEVEL: {
    title: '학력 검색',
    searchFields: [{ name: 'educationLevelName', label: '학력명', type: 'text' }],
    columns: [
      { field: 'educationLevel', headerName: '코드' },
      { field: 'educationLevelName', headerName: '학력' },
    ],
  },
  QUALIFICATION: {
    title: '자격 검색',
    searchFields: [{ name: 'qualificationName', label: '자격명', type: 'text' }],
    columns: [
      { field: 'qualificationId', headerName: '코드' },
      { field: 'qualificationName', headerName: '자격' },
    ],
  },
  TRAINING_COURSE: {
    title: '교육 과정 검색',
    searchFields: [{ name: 'courseName', label: '교육 과정명', type: 'text' }],
    columns: [
      { field: 'courseId', headerName: '코드' },
      { field: 'courseName', headerName: '교육 과정' },
    ],
  },
};

export const hrCatalog = [
  { id: 'COMPANY', label: '회사', category: '인사구조' },
  { id: 'DEPARTMENT', label: '부서', category: '조직 및 직무' },
  { id: 'EMPLOYEE', label: '사원', category: '인사관리' },
  { id: 'CURRENCY', label: '통화', category: '급여' },
  { id: 'PERSONNEL_AREA', label: '인사영역', category: '인사구조' },
  { id: 'PERSONNEL_SUBAREA', label: '인사하위영역', category: '인사구조' },
  { id: 'EMPLOYEE_GROUP', label: '사원그룹', category: '인사구조' },
  { id: 'EMPLOYEE_SUBGROUP', label: '사원하위그룹', category: '인사구조' },
  { id: 'PAYROLL_AREA', label: '급여영역', category: '인사구조' },
  { id: 'BUSINESS_AREA', label: '사업영역', category: '인사구조' },
  { id: 'POSITION', label: '포지션(직위)', category: '조직 및 직무' },
  { id: 'JOB', label: '직무', category: '조직 및 직무' },
  { id: 'JOB_FAMILY', label: '직무군', category: '조직 및 직무' },
  { id: 'COST_CENTER', label: '코스트센터', category: '조직 및 직무' },
  { id: 'WORK_LOCATION', label: '근무지', category: '조직 및 직무' },
  { id: 'PERSONNEL_ACTION', label: '인사발령 유형', category: '인사관리' },
  { id: 'ACTION_REASON', label: '인사발령 사유', category: '인사관리' },
  { id: 'EMPLOYMENT_STATUS', label: '고용 상태', category: '인사관리' },
  { id: 'CONTRACT_TYPE', label: '계약 유형', category: '인사관리' },
  { id: 'WORK_SCHEDULE', label: '근무계획 규칙', category: '근태' },
  { id: 'SHIFT', label: '근무조', category: '근태' },
  { id: 'ATTENDANCE_TYPE', label: '출근 유형', category: '근태' },
  { id: 'ABSENCE_TYPE', label: '결근 유형', category: '근태' },
  { id: 'ABSENCE_QUOTA_TYPE', label: '휴가 정원 유형', category: '근태' },
  { id: 'HOLIDAY_CALENDAR', label: '휴일 달력', category: '근태' },
  { id: 'TIME_EVENT_TYPE', label: '시간 이벤트 유형', category: '근태' },
  { id: 'WAGE_TYPE', label: '임금 유형', category: '급여' },
  { id: 'PAY_SCALE_TYPE', label: '급여등급 유형', category: '급여' },
  { id: 'PAY_SCALE_AREA', label: '급여등급 영역', category: '급여' },
  { id: 'PAY_SCALE_GROUP', label: '급여등급 그룹', category: '급여' },
  { id: 'PAY_SCALE_LEVEL', label: '급여등급 단계', category: '급여' },
  { id: 'COUNTRY', label: '국가', category: '기본정보' },
  { id: 'REGION', label: '지역', category: '기본정보' },
  { id: 'LANGUAGE', label: '언어', category: '기본정보' },
  { id: 'MARITAL_STATUS', label: '혼인 상태', category: '기본정보' },
  { id: 'NATIONALITY', label: '국적', category: '기본정보' },
  { id: 'BANK', label: '은행', category: '기본정보' },
  { id: 'EDUCATION_LEVEL', label: '학력', category: '인재관리' },
  { id: 'QUALIFICATION', label: '자격', category: '인재관리' },
  { id: 'TRAINING_COURSE', label: '교육 과정', category: '인재관리' },
] as const;
