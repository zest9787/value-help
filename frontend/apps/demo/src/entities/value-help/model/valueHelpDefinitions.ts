import type { ValueHelpDefinitions } from 'common-lib/value-help';
import { hrValueHelpDefinitions } from './hrValueHelpConfig';

export const valueHelpDefinitions: ValueHelpDefinitions = {
  ...hrValueHelpDefinitions,
  COMPANY: {
    title: '회사 검색',
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
};
