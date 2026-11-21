import axios from 'axios';
import type { Metadata, Page, Row, ValueHelpApi } from 'common-lib/value-help';

type Envelope<T> = {
  success: boolean;
  data: T;
  message: string;
};

// 데모 앱의 URL, 인증 헤더, 인터셉터 정책은 이 Axios 인스턴스에서 관리한다.
const http = axios.create({ baseURL: '/api/v1/value-helps' });

export const valueHelpApi: ValueHelpApi = {
  async metadata(id) {
    return (await http.get<Envelope<Metadata>>(`/${encodeURIComponent(id)}/metadata`)).data.data;
  },

  async search(id, filters, page, size, sortField, sortDirection) {
    return (
      await http.post<Envelope<Page>>(`/${encodeURIComponent(id)}/search`, {
        filters,
        page,
        size,
        sortField,
        sortDirection,
      })
    ).data.data;
  },

  async item(id, key) {
    return (
      await http.get<Envelope<Row>>(`/${encodeURIComponent(id)}/items/${encodeURIComponent(key)}`)
    ).data.data;
  },
};
