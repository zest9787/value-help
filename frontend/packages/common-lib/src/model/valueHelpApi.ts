export type Row = Record<string, string>;

export type Metadata = {
  id: string;
  keyField: string;
  textField: string;
};

export type Page = {
  items: Row[];
  totalCount: number;
  page: number;
  size: number;
};

/** 앱이 인증, URL, 오류 처리 정책에 맞게 구현해야 하는 데이터 계약이다. */
export type ValueHelpApi = {
  metadata: (id: string) => Promise<Metadata>;
  search: (
    id: string,
    filters: Row,
    page: number,
    size: number,
    sortField?: string,
    sortDirection?: string,
  ) => Promise<Page>;
  item: (id: string, key: string) => Promise<Row>;
};
