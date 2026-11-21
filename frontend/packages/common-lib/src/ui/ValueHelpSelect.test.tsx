// @vitest-environment jsdom
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ValueHelpSelect } from './ValueHelpSelect';
import { ValueHelpProvider } from '../model/ValueHelpProvider';
import type { ValueHelpApi } from '../model/valueHelpApi';

vi.mock('antd', () => ({
  Select: ({
    id,
    value,
    onChange,
    options,
    disabled,
  }: {
    id?: string;
    value?: string;
    onChange: (value?: string) => void;
    options: { value: string; label: string }[];
    disabled?: boolean;
  }) => (
    <select
      id={id}
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value || undefined)}
      disabled={disabled}
    >
      <option value="">선택하세요</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

const api: ValueHelpApi = { metadata: vi.fn(), search: vi.fn(), item: vi.fn() };
const client = () => new QueryClient({ defaultOptions: { queries: { retry: false } } });
const wrap = (children: ReactNode, queryClient = client()) => (
  <QueryClientProvider client={queryClient}>
    <ValueHelpProvider api={api}>{children}</ValueHelpProvider>
  </QueryClientProvider>
);

beforeEach(() => {
  vi.mocked(api.metadata).mockResolvedValue({
    id: 'LANGUAGE',
    keyField: 'language',
    textField: 'languageName',
  });
  vi.mocked(api.search).mockResolvedValue({
    items: [
      { language: 'KO', languageName: '한국어' },
      { language: 'EN', languageName: '영어' },
    ],
    totalCount: 2,
    page: 0,
    size: 200,
  });
});

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

describe('ValueHelpSelect', () => {
  it('loads options and returns the selected code', async () => {
    const onChange = vi.fn();
    render(wrap(<ValueHelpSelect valueHelpId="LANGUAGE" onChange={onChange} />));
    expect(await screen.findByRole('option', { name: '한국어 (KO)' })).toBeTruthy();
    expect(api.search).toHaveBeenCalledWith('LANGUAGE', {}, 0, 200);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'KO' } });
    expect(onChange).toHaveBeenCalledWith('KO');
  });

  it('resolves a saved value missing from the list', async () => {
    vi.mocked(api.item).mockResolvedValue({ language: 'JA', languageName: '일본어' });
    render(wrap(<ValueHelpSelect valueHelpId="LANGUAGE" value="JA" />));
    expect(await screen.findByRole('option', { name: '일본어 (JA)' })).toBeTruthy();
  });

  it('rejects silently truncated lists', async () => {
    vi.mocked(api.search).mockResolvedValue({ items: [], totalCount: 201, page: 0, size: 200 });
    render(wrap(<ValueHelpSelect valueHelpId="LANGUAGE" />));
    expect((await screen.findByRole('alert')).textContent).toContain('200건을 초과');
    expect((screen.getByRole('combobox') as HTMLSelectElement).disabled).toBe(true);
  });

  it('re-queries when dependent filters change', async () => {
    vi.mocked(api.metadata).mockResolvedValue({
      id: 'DEPARTMENT',
      keyField: 'departmentId',
      textField: 'departmentName',
    });
    vi.mocked(api.search).mockResolvedValue({ items: [], totalCount: 0, page: 0, size: 200 });
    const queryClient = client();
    const view = render(
      wrap(
        <ValueHelpSelect valueHelpId="DEPARTMENT" filters={{ companyCode: '1000' }} />,
        queryClient,
      ),
    );
    await waitFor(() =>
      expect(api.search).toHaveBeenCalledWith('DEPARTMENT', { companyCode: '1000' }, 0, 200),
    );
    view.rerender(
      wrap(
        <ValueHelpSelect valueHelpId="DEPARTMENT" filters={{ companyCode: '2000' }} />,
        queryClient,
      ),
    );
    await waitFor(() =>
      expect(api.search).toHaveBeenCalledWith('DEPARTMENT', { companyCode: '2000' }, 0, 200),
    );
  });
});
