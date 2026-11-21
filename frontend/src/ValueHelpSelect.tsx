import { useQuery } from '@tanstack/react-query';
import { Select } from 'antd';
import { item, metadata, search, type Row } from './api';

type ValueHelpSelectProps = {
  valueHelpId: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
  filters?: Row;
  placeholder?: string;
  disabled?: boolean;
  /** Form.Item이 전달하는 접근성용 HTML id */
  id?: string;
};

const MAX_OPTIONS = 200;

/** 건수가 적은 Value Help를 한 번 조회해 Select에서 선택한다. */
export function ValueHelpSelect({
  valueHelpId,
  value,
  onChange,
  filters = {},
  placeholder = '선택하세요',
  disabled = false,
  id,
}: ValueHelpSelectProps) {
  const meta = useQuery({
    queryKey: ['metadata', valueHelpId],
    queryFn: () => metadata(valueHelpId),
    staleTime: 60_000,
  });
  const list = useQuery({
    queryKey: ['search', valueHelpId, filters, 0, {}, MAX_OPTIONS],
    queryFn: () => search(valueHelpId, filters, 0, MAX_OPTIONS),
    enabled: !!meta.data,
    staleTime: 60_000,
  });
  const rows = list.data?.items ?? [];
  const selectedInList = !!meta.data && rows.some((row) => row[meta.data!.keyField] === value);
  // 기존 저장값이 현재 목록에 없더라도 단건 조회로 표시명을 복원한다.
  const selected = useQuery({
    queryKey: ['item', valueHelpId, value],
    queryFn: () => item(valueHelpId, value!),
    enabled: !!value && !!meta.data && list.isSuccess && !selectedInList,
    retry: false,
    staleTime: 60_000,
  });

  const options = meta.data
    ? [...rows, ...(selected.data && !selectedInList ? [selected.data] : [])].map((row) => ({
        value: row[meta.data!.keyField],
        label: `${row[meta.data!.textField]} (${row[meta.data!.keyField]})`,
      }))
    : [];
  const tooMany = (list.data?.totalCount ?? 0) > MAX_OPTIONS;
  const failed = meta.isError || list.isError;

  return (
    <>
      <Select
        id={id}
        value={value}
        onChange={(next) => onChange?.(next)}
        options={options}
        placeholder={placeholder}
        loading={meta.isLoading || list.isFetching}
        disabled={disabled || failed || tooMany}
        status={failed || tooMany ? 'error' : undefined}
        allowClear
        showSearch
        optionFilterProp="label"
        style={{ width: '100%' }}
        notFoundContent={list.isFetching ? '조회 중...' : '조회 결과가 없습니다.'}
      />
      {(failed || tooMany || selected.isError) && (
        <div className="value-help-select-message" role="alert">
          {failed
            ? '목록을 불러오지 못했습니다. 서버 연결을 확인하세요.'
            : tooMany
              ? '목록이 200건을 초과합니다. 검색 모달을 사용하세요.'
              : '선택된 코드의 명칭을 찾을 수 없습니다.'}
        </div>
      )}
    </>
  );
}
