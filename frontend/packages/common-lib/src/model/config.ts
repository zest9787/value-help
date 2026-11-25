import type { ReactNode } from 'react';
import type { Row } from './valueHelpApi';

export type ValueHelpDisplayFormat = (code: string, text: string, row: Row) => ReactNode;

export const defaultDisplayFormat: ValueHelpDisplayFormat = (code, text) =>
  text ? `${text}(${code})` : code;

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
export type ValueHelpAutoCompleteOptions = {
  /** 서버 Registry가 허용한 문자열 검색 필드. 기본값은 메타데이터 textField. */
  searchField?: string;
  minLength?: number;
  debounceMs?: number;
  pageSize?: number;
};
export type ValueHelpOptions = {
  /** 표시할 응답 필드명. Form에 저장하는 키는 서버 메타데이터를 따른다. */
  displayFields?: { code?: string; text?: string };
  /** 입력창 표시 형식. Form에는 항상 코드만 저장한다. */
  displayFormat?: ValueHelpDisplayFormat;
  /** 기본 비활성화. true 또는 설정 객체로 자동완성을 사용한다. */
  autoComplete?: boolean | ValueHelpAutoCompleteOptions;
  title?: string;
  selectionMode?: SelectionMode;
  searchFields?: SearchField[];
  columns?: ValueHelpColumn[];
  modal?: ModalOptions;
  pageSize?: number;
};
export type ResolvedOptions = {
  displayFields?: ValueHelpOptions['displayFields'];
  displayFormat: NonNullable<ValueHelpOptions['displayFormat']>;
  autoComplete: boolean | ValueHelpAutoCompleteOptions;
  title: string;
  selectionMode: SelectionMode;
  searchFields: SearchField[];
  columns: ValueHelpColumn[];
  modal: Required<Omit<ModalOptions, 'width'>> & Pick<ModalOptions, 'width'>;
  pageSize: number;
};

export type ValueHelpDefinitions = Record<string, ValueHelpOptions>;

/**
 * 공통 정의에 앱 정의를 ID 단위로 병합한다.
 * modal은 속성별로 병합하고 columns/searchFields 배열은 앱 정의가 통째로 교체한다.
 */
export function mergeValueHelpDefinitions(
  base: ValueHelpDefinitions,
  overrides: ValueHelpDefinitions = {},
): ValueHelpDefinitions {
  const result: ValueHelpDefinitions = { ...base };
  for (const [id, override] of Object.entries(overrides)) {
    const key = id.toUpperCase();
    const original = result[key] ?? {};
    result[key] = {
      ...original,
      ...override,
      ...(original.displayFields || override.displayFields
        ? { displayFields: { ...original.displayFields, ...override.displayFields } }
        : {}),
      ...(original.modal || override.modal
        ? { modal: { ...original.modal, ...override.modal } }
        : {}),
    };
  }
  return result;
}

/** 우선순위: 공통 기본값 < 종류별 설정 < 호출 화면 옵션. 배열은 병합하지 않고 교체한다. */
export function resolveValueHelpOptions(
  id: string,
  options: ValueHelpOptions = {},
  definitions: ValueHelpDefinitions = {},
): ResolvedOptions {
  const preset = definitions[id.toUpperCase()] ?? {};
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
    displayFields: { ...preset.displayFields, ...options.displayFields },
    displayFormat: options.displayFormat ?? preset.displayFormat ?? defaultDisplayFormat,
    autoComplete: options.autoComplete ?? preset.autoComplete ?? false,
    title: options.title ?? preset.title ?? id,
    selectionMode: options.selectionMode ?? preset.selectionMode ?? 'single',
    searchFields: options.searchFields ?? preset.searchFields ?? [],
    columns: options.columns ?? preset.columns ?? [],
    modal,
    pageSize,
  };
}
