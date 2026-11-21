import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import type { Row } from '../api/value-help/client';
import { useValueHelpApi, useValueHelpOptions } from '../model/useValueHelp';
import type { ValueHelpOptions } from '../model/config';

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

/** Ant Design Form에서 코드 값으로 사용할 수 있는 입력 컴포넌트. */
export function ValueHelpInput({
  id,
  value,
  onChange,
  filters = {},
  options,
}: {
  id: string;
  value?: string;
  onChange?: (value?: string) => void;
  filters?: Row;
  options?: ValueHelpOptions;
}) {
  const [open, setOpen] = useState(false);
  const api = useValueHelpApi();
  const meta = useQuery({ queryKey: ['metadata', id], queryFn: () => api.metadata(id) });
  const detail = useQuery({
    queryKey: ['item', id, value],
    queryFn: () => api.item(id, value!),
    enabled: !!value,
    retry: false,
  });
  return (
    <>
      <Input.Search
        value={value ?? ''}
        placeholder="코드 입력 또는 검색"
        onChange={(e) => onChange?.(e.target.value || undefined)}
        onSearch={() => setOpen(true)}
        enterButton="검색"
      />
      <div className="description">
        {detail.data && meta.data
          ? detail.data[meta.data.textField]
          : value && detail.isError
            ? '일치하는 코드가 없습니다.'
            : '\u00a0'}
      </div>
      <ValueHelpModal
        id={id}
        open={open}
        onClose={() => setOpen(false)}
        fixedFilters={filters}
        options={{ ...options, selectionMode: 'single' }}
        onSelect={(rows, keyField) => onChange?.(rows[0]?.[keyField])}
      />
    </>
  );
}
