import { useEffect, useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Select, Space } from 'antd';
import { useValueHelpApi, useValueHelpError } from '../model/useValueHelp';
import type { ValueHelpAutoCompleteOptions } from '../model/config';
import type { Metadata, Row } from '../model/valueHelpApi';

type Props = {
  id: string;
  value?: string;
  label: ReactNode;
  metadata?: Metadata;
  filters: Row;
  options: ValueHelpAutoCompleteOptions;
  format: (row: Row) => ReactNode;
  onSelect: (row: Row) => void;
  onClear: () => void;
  onOpenModal: () => void;
};

/** 검색어는 임시 상태로만 보관하며, 항목을 선택할 때만 Form의 코드값을 변경한다. */
export function ValueHelpAutoComplete({
  id,
  value,
  label,
  metadata,
  filters,
  options,
  format,
  onSelect,
  onClear,
  onOpenModal,
}: Props) {
  const api = useValueHelpApi();
  const [searchText, setSearchText] = useState('');
  const [debounced, setDebounced] = useState('');
  const [focused, setFocused] = useState(false);
  const searchField = options.searchField ?? metadata?.textField;
  const minLength = options.minLength ?? 1;
  const debounceMs = options.debounceMs ?? 300;
  const pageSize = options.pageSize ?? 10;
  if (
    !Number.isInteger(minLength) ||
    minLength < 1 ||
    minLength > 100 ||
    !Number.isInteger(debounceMs) ||
    debounceMs < 0 ||
    debounceMs > 5000 ||
    !Number.isInteger(pageSize) ||
    pageSize < 1 ||
    pageSize > 200
  ) {
    throw new Error(
      '자동완성 옵션: minLength는 1~100, debounceMs는 0~5000, pageSize는 1~200의 정수여야 합니다.',
    );
  }
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(searchText.trim()), debounceMs);
    return () => window.clearTimeout(timer);
  }, [searchText, debounceMs]);
  const active =
    focused &&
    !!metadata &&
    !!searchField &&
    debounced.length >= minLength &&
    searchText.trim() === debounced;
  // 업무 화면의 고정조건이 검색어보다 우선한다.
  const requestFilters = { ...(searchField ? { [searchField]: debounced } : {}), ...filters };
  const result = useQuery({
    queryKey: ['autocomplete', id, requestFilters, pageSize],
    queryFn: () => api.search(id, requestFilters, 0, pageSize),
    enabled: active,
    retry: false,
  });
  useValueHelpError(
    `autocomplete:${id}:${JSON.stringify([requestFilters, pageSize])}`,
    result.errorUpdatedAt,
    '자동완성 목록을 불러오지 못했습니다.',
    active && result.isError,
  );
  const rows = active ? (result.data?.items ?? []) : [];
  const choices = metadata
    ? rows.map((row) => ({ value: row[metadata.keyField], label: format(row) }))
    : [];
  return (
    <Space.Compact style={{ width: '100%' }}>
      <Select
        aria-label={`${id} 자동완성`}
        style={{ width: '100%' }}
        showSearch
        allowClear
        labelInValue
        filterOption={false}
        value={value ? { value, label } : undefined}
        searchValue={searchText}
        onSearch={setSearchText}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          setSearchText('');
        }}
        onSelect={(selected) => {
          const row = rows.find((candidate) => candidate[metadata!.keyField] === selected.value);
          if (row) onSelect(row);
          setSearchText('');
        }}
        onClear={() => {
          setSearchText('');
          onClear();
        }}
        options={choices}
        loading={active && result.isFetching}
        placeholder="명칭을 입력하거나 검색하세요"
        notFoundContent={
          searchText.trim().length < minLength
            ? `${minLength}자 이상 입력하세요.`
            : result.isFetching || searchText.trim() !== debounced
              ? '조회 중...'
              : '조회 결과가 없습니다.'
        }
      />
      <Button
        onClick={() => {
          setSearchText('');
          onOpenModal();
        }}
      >
        검색
      </Button>
    </Space.Compact>
  );
}
