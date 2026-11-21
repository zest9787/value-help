import type { Row, ValueHelpApi, ValueHelpDefinitions } from 'common-lib/value-help';

const rows: Record<string, Row[]> = {
  COMPANY: [
    { companyCode: '1000', companyName: '서울 본사', country: 'KR' },
    { companyCode: '2000', companyName: '부산 사업장', country: 'KR' },
  ],
  DEPARTMENT: [
    { departmentId: 'D101', departmentName: '인사팀', companyCode: '1000' },
    { departmentId: 'D102', departmentName: '개발팀', companyCode: '1000' },
    { departmentId: 'D201', departmentName: '영업팀', companyCode: '2000' },
  ],
  EMPLOYEE: [
    {
      employeeId: '10001',
      employeeName: '김민수',
      departmentId: 'D101',
      departmentName: '인사팀',
      companyCode: '1000',
      employmentStatus: 'ACTIVE',
    },
    {
      employeeId: '10002',
      employeeName: '이서연',
      departmentId: 'D102',
      departmentName: '개발팀',
      companyCode: '1000',
      employmentStatus: 'ACTIVE',
    },
    {
      employeeId: '10003',
      employeeName: '박지훈',
      departmentId: 'D201',
      departmentName: '영업팀',
      companyCode: '2000',
      employmentStatus: 'RETIRED',
    },
  ],
  LANGUAGE: [
    { language: 'KO', languageName: '한국어' },
    { language: 'EN', languageName: '영어' },
    { language: 'JA', languageName: '일본어' },
  ],
  CURRENCY: [
    { currency: 'KRW', currencyName: '대한민국 원' },
    { currency: 'USD', currencyName: '미국 달러' },
    { currency: 'EUR', currencyName: '유로' },
  ],
};

const metadata = {
  COMPANY: { id: 'COMPANY', keyField: 'companyCode', textField: 'companyName' },
  DEPARTMENT: { id: 'DEPARTMENT', keyField: 'departmentId', textField: 'departmentName' },
  EMPLOYEE: { id: 'EMPLOYEE', keyField: 'employeeId', textField: 'employeeName' },
  LANGUAGE: { id: 'LANGUAGE', keyField: 'language', textField: 'languageName' },
  CURRENCY: { id: 'CURRENCY', keyField: 'currency', textField: 'currencyName' },
} as const;

export const storyDefinitions: ValueHelpDefinitions = {
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
  LANGUAGE: {
    title: '언어 선택',
    columns: [
      { field: 'language', headerName: '언어코드' },
      { field: 'languageName', headerName: '언어명' },
    ],
  },
  CURRENCY: {
    title: '통화 선택',
    selectionMode: 'multiple',
    searchFields: [],
    columns: [
      { field: 'currency', headerName: '통화코드' },
      { field: 'currencyName', headerName: '통화명' },
    ],
  },
};

const pause = () => new Promise((resolve) => setTimeout(resolve, 120));

export const mockApi: ValueHelpApi = {
  async metadata(id) {
    await pause();
    const result = metadata[id.toUpperCase() as keyof typeof metadata];
    if (!result) throw new Error(`Unknown Value Help: ${id}`);
    return result;
  },
  async search(id, filters, page, size, sortField, sortDirection) {
    await pause();
    const result = [...(rows[id.toUpperCase()] ?? [])].filter((row) =>
      Object.entries(filters).every(
        ([key, value]) => !value || row[key]?.toLowerCase().includes(value.toLowerCase()),
      ),
    );
    if (sortField)
      result.sort(
        (a, b) =>
          (a[sortField] ?? '').localeCompare(b[sortField] ?? '') *
          (sortDirection === 'desc' ? -1 : 1),
      );
    return {
      items: result.slice(page * size, (page + 1) * size),
      totalCount: result.length,
      page,
      size,
    };
  },
  async item(id, key) {
    await pause();
    const meta = metadata[id.toUpperCase() as keyof typeof metadata];
    const result = meta && rows[id.toUpperCase()]?.find((row) => row[meta.keyField] === key);
    if (!result) throw new Error(`Unknown item: ${id}/${key}`);
    return result;
  },
};
