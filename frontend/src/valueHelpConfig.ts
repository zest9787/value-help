import { hrValueHelpDefinitions } from './hrValueHelpConfig';

export type ModalSize = 'S' | 'M' | 'L' | 'XL' | 'FULL';
export type SelectionMode = 'single' | 'multiple';
export type SearchField = {
  name: string;
  label: string;
  type: 'text' | 'select' | 'valueHelp';
  required?: boolean;
  valueHelpId?: string;
  dependsOn?: string[];
  options?: { label: string; value: string }[];
  colSpan?: number;
  valueHelpOptions?: ValueHelpOptions;
};
export type ValueHelpColumn = {
  field: string;
  headerName: string;
  width?: number;
  sortable?: boolean;
};
export type ModalOptions = {
  size?: ModalSize;
  width?: number | string;
  maxHeight?: string;
  searchColumns?: number;
  gridHeight?: number;
};
export type ValueHelpOptions = {
  title?: string;
  selectionMode?: SelectionMode;
  searchFields?: SearchField[];
  columns?: ValueHelpColumn[];
  modal?: ModalOptions;
  pageSize?: number;
};
export type ResolvedOptions = {
  title: string;
  selectionMode: SelectionMode;
  searchFields: SearchField[];
  columns: ValueHelpColumn[];
  modal: Required<Omit<ModalOptions, 'width'>> & Pick<ModalOptions, 'width'>;
  pageSize: number;
};

/** 화면별로 반복해서 사용하는 기본 표시 설정. 배열은 호출 화면에서 통째로 교체할 수 있다. */
export const valueHelpDefaults: Record<string, ValueHelpOptions> = {
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

/** 우선순위: 공통 기본값 < 종류별 설정 < 호출 화면 옵션. 배열은 병합하지 않고 교체한다. */
export function resolveValueHelpOptions(
  id: string,
  options: ValueHelpOptions = {},
): ResolvedOptions {
  const preset = valueHelpDefaults[id.toUpperCase()] ?? {};
  const modal = {
    size: 'M' as ModalSize,
    maxHeight: '75vh',
    searchColumns: 3,
    gridHeight: 350,
    ...preset.modal,
    ...options.modal,
  };
  const pageSize = options.pageSize ?? preset.pageSize ?? 10;
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 200)
    throw new Error('pageSize는 1~200 사이의 정수여야 합니다.');
  if (!Number.isInteger(modal.searchColumns) || modal.searchColumns < 1 || modal.searchColumns > 4)
    throw new Error('searchColumns는 1~4 사이의 정수여야 합니다.');
  return {
    title: options.title ?? preset.title ?? id,
    selectionMode: options.selectionMode ?? preset.selectionMode ?? 'single',
    searchFields: options.searchFields ?? preset.searchFields ?? [],
    columns: options.columns ?? preset.columns ?? [],
    modal,
    pageSize,
  };
}
