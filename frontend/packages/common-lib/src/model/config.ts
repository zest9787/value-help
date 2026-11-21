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

export type ValueHelpDefinitions = Record<string, ValueHelpOptions>;

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
    title: options.title ?? preset.title ?? id,
    selectionMode: options.selectionMode ?? preset.selectionMode ?? 'single',
    searchFields: options.searchFields ?? preset.searchFields ?? [],
    columns: options.columns ?? preset.columns ?? [],
    modal,
    pageSize,
  };
}
