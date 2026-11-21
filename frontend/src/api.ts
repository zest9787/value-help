import axios from 'axios';

export type Row = Record<string, string>;
export type Metadata = { id: string; keyField: string; textField: string };
export type Page = { items: Row[]; totalCount: number; page: number; size: number };
type Envelope<T> = { success: boolean; data: T; message: string };
export const metadata = async (id: string) =>
  (await axios.get<Envelope<Metadata>>(`/api/v1/value-helps/${encodeURIComponent(id)}/metadata`))
    .data.data;
export const search = async (
  id: string,
  filters: Row,
  page: number,
  size: number,
  sortField?: string,
  sortDirection?: string,
) =>
  (
    await axios.post<Envelope<Page>>(`/api/v1/value-helps/${encodeURIComponent(id)}/search`, {
      filters,
      page,
      size,
      sortField,
      sortDirection,
    })
  ).data.data;
export const item = async (id: string, key: string) =>
  (
    await axios.get<Envelope<Row>>(
      `/api/v1/value-helps/${encodeURIComponent(id)}/items/${encodeURIComponent(key)}`,
    )
  ).data.data;
