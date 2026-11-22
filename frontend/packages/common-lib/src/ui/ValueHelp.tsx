import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Button,
  Col,
  Form,
  Input,
  Modal,
  Pagination,
  Row as AntRow,
  Select,
  Space,
  Spin,
} from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, SortChangedEvent } from 'ag-grid-community';
import { useValueHelpApi, useValueHelpOptions } from '../model/useValueHelp';
import type { ValueHelpOptions } from '../model/config';
import type { Row } from '../model/valueHelpApi';

type Props = {
  id: string;
  open: boolean;
  onClose: () => void;
  onSelect: (rows: Row[], keyField: string) => void;
  fixedFilters?: Row;
  options?: ValueHelpOptions;
};
const widths = { S: 480, M: 720, L: 960, XL: 1200, FULL: '95vw' };

/** 화면 설정으로 검색 폼과 그리드를 구성한다. 서버 메타데이터는 키와 명칭 필드만 제공한다. */
export function ValueHelpModal({ id, open, onClose, onSelect, fixedFilters = {}, options }: Props) {
  const config = useValueHelpOptions(id, options);
  const api = useValueHelpApi();
  const [form] = Form.useForm();
  const [filters, setFilters] = useState<Row>({});
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<{ field?: string; direction?: string }>({});
  const [selected, setSelected] = useState<Row[]>([]);
  const [nested, setNested] = useState<{
    id: string;
    field: string;
    filters: Row;
    options?: ValueHelpOptions;
  } | null>(null);
  const meta = useQuery({
    queryKey: ['metadata', id],
    queryFn: () => api.metadata(id),
    enabled: open,
  });
  const fixedKey = JSON.stringify(fixedFilters);
  const optionsKey = JSON.stringify(options);
  useEffect(() => {
    if (open) {
      form.resetFields();
      setFilters({});
      setPage(0);
      setSort({});
      setSelected([]);
    }
  }, [id, open, fixedKey, optionsKey, form]);
  const merged = { ...filters, ...fixedFilters };
  const result = useQuery({
    queryKey: ['search', id, merged, page, sort, config.pageSize],
    queryFn: () => api.search(id, merged, page, config.pageSize, sort.field, sort.direction),
    enabled: open && !!meta.data,
  });
  const cols = useMemo<ColDef<Row>[]>(
    () =>
      config.columns.map((c) => ({
        field: c.field,
        headerName: c.headerName,
        width: c.width ?? 150,
        sortable: c.sortable ?? true,
      })),
    [config.columns],
  );

  function changeSort(e: SortChangedEvent<Row>) {
    const c = e.api.getColumnState().find((x) => x.sort);
    setSort(c ? { field: c.colId, direction: c.sort! } : {});
    setPage(0);
    setSelected([]);
  }

  const m = meta.data;
  return (
    <>
      <Modal
        open={open}
        title={config.title}
        width={config.modal.width ?? widths[config.modal.size]}
        style={{ maxWidth: 'calc(100vw - 24px)', top: 20 }}
        styles={{ body: { maxHeight: config.modal.maxHeight, overflowY: 'auto' } }}
        onCancel={onClose}
        onOk={() => {
          if (m) onSelect(selected, m.keyField);
          onClose();
        }}
        okText="선택"
        cancelText="취소"
        okButtonProps={{ disabled: !selected.length }}
        destroyOnClose
      >
        {meta.isLoading && <Spin />}
        {meta.isError && (
          <Alert type="error" message="메타데이터를 불러오지 못했습니다." showIcon />
        )}
        {m && (
          <>
            {config.searchFields.length > 0 && (
              <Form
                form={form}
                layout="vertical"
                onFinish={(v) => {
                  setFilters(v);
                  setPage(0);
                  setSelected([]);
                }}
                onValuesChange={(changed) => {
                  const reset: Record<string, undefined> = {};
                  config.searchFields.forEach((f) => {
                    if ((f.dependsOn ?? []).some((d) => d in changed)) reset[f.name] = undefined;
                  });
                  form.setFieldsValue(reset);
                }}
              >
                <AntRow gutter={12}>
                  {config.searchFields
                    .filter((f) => !(f.name in fixedFilters))
                    .map((f) => (
                      <Col
                        xs={24}
                        sm={12}
                        lg={f.colSpan ?? Math.floor(24 / config.modal.searchColumns)}
                        key={f.name}
                      >
                        <Form.Item name={f.name} label={f.label} rules={[{ required: f.required }]}>
                          {f.type === 'select' ? (
                            <Select allowClear options={f.options} />
                          ) : f.type === 'valueHelp' ? (
                            <Input.Search
                              readOnly
                              allowClear
                              onSearch={() => {
                                const values = { ...form.getFieldsValue(), ...fixedFilters };
                                const deps: Row = {};
                                (f.dependsOn ?? []).forEach((k) => {
                                  if (values[k]) deps[k] = values[k];
                                });
                                if (f.valueHelpId)
                                  setNested({
                                    id: f.valueHelpId,
                                    field: f.name,
                                    filters: deps,
                                    options: f.valueHelpOptions,
                                  });
                              }}
                            />
                          ) : (
                            <Input allowClear />
                          )}
                        </Form.Item>
                      </Col>
                    ))}
                </AntRow>
                <Space className="actions">
                  <Button
                    onClick={() => {
                      form.resetFields();
                      setFilters({});
                      setPage(0);
                      setSelected([]);
                    }}
                  >
                    초기화
                  </Button>
                  <Button type="primary" htmlType="submit">
                    조회
                  </Button>
                </Space>
              </Form>
            )}
            {result.isError && (
              <Alert type="error" message="조회에 실패했습니다. 서버를 확인해 주세요." showIcon />
            )}
            <div
              className="ag-theme-quartz"
              style={{ height: config.modal.gridHeight, width: '100%' }}
            >
              <AgGridReact<Row>
                rowData={result.data?.items ?? []}
                columnDefs={cols}
                rowSelection={config.selectionMode === 'multiple' ? 'multiple' : 'single'}
                rowMultiSelectWithClick
                getRowId={(p) => p.data[m.keyField]}
                onSelectionChanged={(e) => setSelected(e.api.getSelectedRows())}
                onSortChanged={changeSort}
                suppressMultiSort
                onRowDoubleClicked={(e) => {
                  if (config.selectionMode === 'single' && e.data) {
                    onSelect([e.data], m.keyField);
                    onClose();
                  }
                }}
                overlayNoRowsTemplate="조회 결과가 없습니다."
              />
            </div>
            <div className="pager">
              <span>
                총 {result.data?.totalCount ?? 0}건 {result.isFetching ? ' · 조회 중' : ''}
              </span>
              <Pagination
                size="small"
                current={page + 1}
                pageSize={config.pageSize}
                total={result.data?.totalCount ?? 0}
                onChange={(p) => {
                  setPage(p - 1);
                  setSelected([]);
                }}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </Modal>
      {nested && (
        <ValueHelpModal
          id={nested.id}
          open
          onClose={() => setNested(null)}
          fixedFilters={nested.filters}
          options={{ ...nested.options, selectionMode: 'single' }}
          onSelect={(rows, key) => {
            form.setFieldValue(nested.field, rows[0][key]);
            const reset: Record<string, undefined> = {};
            config.searchFields.forEach((f) => {
              if ((f.dependsOn ?? []).includes(nested.field)) reset[f.name] = undefined;
            });
            form.setFieldsValue(reset);
          }}
        />
      )}
    </>
  );
}

/** 입력창에는 명칭(코드)을 표시하고 Form의 value/onChange에는 코드만 전달한다. */
export function ValueHelpInput({
  id,
  value,
  onChange,
  filters = {},
  options,
  displayFormat,
}: {
  id: string;
  value?: string;
  onChange?: (value?: string) => void;
  filters?: Row;
  options?: ValueHelpOptions;
  /** options 및 항목별 기본값보다 우선하는 입력창 표시 함수. */
  displayFormat?: ValueHelpOptions['displayFormat'];
}) {
  const [open, setOpen] = useState(false);
  const api = useValueHelpApi();
  const queryClient = useQueryClient();
  const config = useValueHelpOptions(id, options);
  const meta = useQuery({ queryKey: ['metadata', id], queryFn: () => api.metadata(id) });
  const detail = useQuery({
    queryKey: ['item', id, value],
    queryFn: () => api.item(id, value!),
    enabled: !!value,
    retry: false,
    staleTime: 30_000,
  });
  // 표시 필드만 바꾼다. value/onChange의 저장 코드는 metadata.keyField를 유지한다.
  const textField = config.displayFields?.text ?? meta.data?.textField;
  const codeField = config.displayFields?.code ?? meta.data?.keyField;
  const text = textField ? (detail.data?.[textField] ?? '') : '';
  const shownCode = (codeField ? detail.data?.[codeField] : undefined) ?? value ?? '';
  const row = detail.data ?? {};
  const renderedValue = value ? (displayFormat ?? config.displayFormat)(shownCode, text, row) : '';
  const isInputValue = typeof renderedValue === 'string' || typeof renderedValue === 'number';

  // readOnly에서는 Ant Design의 allowClear가 숨겨지므로 suffix에 clear 아이콘을 배치한다.
  const clearIcon = value ? (
    <Button
      type="text"
      size="small"
      aria-label="선택값 지우기"
      onMouseDown={(event) => event.preventDefault()}
      onClick={(event) => {
        event.stopPropagation();
        onChange?.(undefined);
      }}
      icon={
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm3 9.3-.7.7L8 8.7 5.7 11l-.7-.7L7.3 8 5 5.7l.7-.7L8 7.3 10.3 5l.7.7L8.7 8 11 10.3Z" />
        </svg>
      }
    />
  ) : null;

  return (
    <>
      <Input.Search
        value={isInputValue ? renderedValue : ''}
        prefix={
          isInputValue ? undefined : <span className="value-help-display">{renderedValue}</span>
        }
        styles={isInputValue ? undefined : { input: { width: 0, minWidth: 0, padding: 0 } }}
        aria-label={isInputValue ? undefined : `선택값 ${value ?? ''}`}
        placeholder={value ? undefined : '검색하여 선택하세요'}
        readOnly
        suffix={<span>{clearIcon}</span>}
        onSearch={() => setOpen(true)}
        enterButton="검색"
      />
      {value && detail.isError && (
        <div className="description">일치하는 코드를 조회할 수 없습니다.</div>
      )}
      <ValueHelpModal
        id={id}
        open={open}
        onClose={() => setOpen(false)}
        fixedFilters={filters}
        options={{ ...options, selectionMode: 'single' }}
        onSelect={(rows, keyField) => {
          const row = rows[0];
          const code = row?.[keyField];
          if (!code) return;
          // 선택한 행을 캐시해 명칭을 즉시 표시한다. Form에는 코드만 저장한다.
          queryClient.setQueryData(['item', id, code], row);
          onChange?.(code);
          setOpen(false);
        }}
      />
    </>
  );
}
