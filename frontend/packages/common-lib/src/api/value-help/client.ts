import axios, { type AxiosInstance } from 'axios';

export type Row = Record<string, string>;
export type Metadata = { id: string; keyField: string; textField: string };
export type Page = { items: Row[]; totalCount: number; page: number; size: number };
type Envelope<T> = { success: boolean; data: T; message: string };
export type ValueHelpApi = ReturnType<typeof createValueHelpApi>;

export function createValueHelpApi(http: AxiosInstance = axios) {
  return {
    metadata: async (id: string) =>
      (await http.get<Envelope<Metadata>>(`/api/v1/value-helps/${encodeURIComponent(id)}/metadata`))
        .data.data,
    search: async (
      id: string,
      filters: Row,
      page: number,
      size: number,
      sortField?: string,
      sortDirection?: string,
    ) =>
      (
        await http.post<Envelope<Page>>(`/api/v1/value-helps/${encodeURIComponent(id)}/search`, {
          filters,
          page,
          size,
          sortField,
          sortDirection,
        })
      ).data.data,
    item: async (id: string, key: string) =>
      (
        await http.get<Envelope<Row>>(
          `/api/v1/value-helps/${encodeURIComponent(id)}/items/${encodeURIComponent(key)}`,
        )
      ).data.data,
  };
}
