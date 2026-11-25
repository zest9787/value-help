// @vitest-environment jsdom
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ValueHelpAutoComplete } from './ValueHelpAutoComplete';
import { ValueHelpProvider } from '../model/ValueHelpProvider';
import type { Page, ValueHelpApi } from '../model/valueHelpApi';

const modalError = vi.hoisted(() => vi.fn());
vi.mock('antd', () => ({
  Modal: { useModal: () => [{ error: modalError }, null] },
  Space: { Compact: ({ children }: { children: ReactNode }) => <div>{children}</div> },
  Button: ({ children, onClick }: { children: ReactNode; onClick: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
  Select: ({
    searchValue,
    onSearch,
    onFocus,
    onBlur,
    onSelect,
    onClear,
    options,
  }: {
    searchValue: string;
    onSearch: (value: string) => void;
    onFocus: () => void;
    onBlur: () => void;
    onSelect: (value: { value: string }) => void;
    onClear: () => void;
    options: { value: string; label: ReactNode }[];
  }) => (
    <div>
      <input
        aria-label="자동완성 검색"
        value={searchValue}
        onChange={(event) => onSearch(event.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {options.map((option) => (
        <button key={option.value} onClick={() => onSelect({ value: option.value })}>
          {option.label}
        </button>
      ))}
      <button onClick={onClear}>지우기</button>
    </div>
  ),
}));

const employeeMetadata = { id: 'EMPLOYEE', keyField: 'employeeId', textField: 'employeeName' };
const employee = { employeeId: '10001', employeeName: '김민수', companyCode: '1000' };
const page = (items: (typeof employee)[]): Page => ({
  items,
  totalCount: items.length,
  page: 0,
  size: 10,
});
const api: ValueHelpApi = { metadata: vi.fn(), item: vi.fn(), search: vi.fn() };
const client = () => new QueryClient({ defaultOptions: { queries: { retry: false } } });
const renderSearch = (options = { searchField: 'employeeName', minLength: 1, debounceMs: 0 }) => {
  const onSelect = vi.fn();
  const onClear = vi.fn();
  const onOpenModal = vi.fn();
  render(
    <QueryClientProvider client={client()}>
      <ValueHelpProvider api={api}>
        <ValueHelpAutoComplete
          id="EMPLOYEE"
          label=""
          metadata={employeeMetadata}
          filters={{ companyCode: '1000' }}
          options={options}
          format={(row) => `${row.employeeName}(${row.employeeId})`}
          onSelect={onSelect}
          onClear={onClear}
          onOpenModal={onOpenModal}
        />
      </ValueHelpProvider>
    </QueryClientProvider>,
  );
  return { onSelect, onClear, onOpenModal };
};
afterEach(() => {
  cleanup();
  vi.resetAllMocks();
  modalError.mockReset();
});

describe('ValueHelpAutoComplete', () => {
  it('debounces a text search with fixed filters and selects the returned row', async () => {
    vi.mocked(api.search).mockResolvedValue(page([employee]));
    const { onSelect, onClear, onOpenModal } = renderSearch();
    const input = screen.getByRole('textbox', { name: '자동완성 검색' });
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '김' } });
    const choice = await screen.findByRole('button', { name: '김민수(10001)' });
    expect(api.search).toHaveBeenCalledWith(
      'EMPLOYEE',
      { employeeName: '김', companyCode: '1000' },
      0,
      10,
    );
    fireEvent.click(choice);
    expect(onSelect).toHaveBeenCalledWith(employee);
    fireEvent.click(screen.getByRole('button', { name: '지우기' }));
    expect(onClear).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button', { name: '검색' }));
    expect(onOpenModal).toHaveBeenCalledOnce();
  });

  it('does not search before the configured minimum length', async () => {
    renderSearch({ searchField: 'employeeName', minLength: 2, debounceMs: 0 });
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '김' } });
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(api.search).not.toHaveBeenCalled();
  });

  it('hides an old response after the search text changes', async () => {
    let resolveOld!: (value: Page) => void;
    vi.mocked(api.search).mockImplementation((_id, filters) =>
      filters.employeeName === '김'
        ? new Promise((resolve) => {
            resolveOld = resolve;
          })
        : Promise.resolve(page([])),
    );
    renderSearch();
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '김' } });
    await waitFor(() => expect(api.search).toHaveBeenCalledTimes(1));
    fireEvent.change(input, { target: { value: '이' } });
    await waitFor(() => expect(api.search).toHaveBeenCalledTimes(2));
    resolveOld(page([employee]));
    await waitFor(() => expect(screen.queryByRole('button', { name: '김민수(10001)' })).toBeNull());
  });

  it('reports a failed search using the provider modal', async () => {
    vi.mocked(api.search).mockRejectedValue(new Error('network'));
    renderSearch();
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '김' } });
    await waitFor(() =>
      expect(modalError).toHaveBeenCalledWith(
        expect.objectContaining({ content: '자동완성 목록을 불러오지 못했습니다.' }),
      ),
    );
  });
});
