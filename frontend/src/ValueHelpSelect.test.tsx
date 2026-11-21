// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ValueHelpSelect } from './ValueHelpSelect';
import * as api from './api';

vi.mock('./api', () => ({ metadata: vi.fn(), search: vi.fn(), item: vi.fn() }));
// 목록 조회와 Form 값 전달을 검증하기 위해 UI 위젯만 간단한 select로 대체한다.
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

const client = () => new QueryClient({ defaultOptions: { queries: { retry: false } } });
const languageMetadata = { id: 'LANGUAGE', keyField: 'language', textField: 'languageName' };

beforeEach(() => {
  vi.mocked(api.metadata).mockResolvedValue(languageMetadata);
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
  it('loads language options and returns the selected code', async () => {
    const onChange = vi.fn();
    render(
      <QueryClientProvider client={client()}>
        <ValueHelpSelect valueHelpId="LANGUAGE" onChange={onChange} />
      </QueryClientProvider>,
    );
    expect(await screen.findByRole('option', { name: '한국어 (KO)' })).toBeTruthy();
    expect(screen.getByRole('option', { name: '영어 (EN)' })).toBeTruthy();
    expect(api.search).toHaveBeenCalledWith('LANGUAGE', {}, 0, 200);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'KO' } });
    expect(onChange).toHaveBeenCalledWith('KO');
  });

  it('resolves a saved value missing from the current list', async () => {
    vi.mocked(api.item).mockResolvedValue({ language: 'JA', languageName: '일본어' });
    render(
      <QueryClientProvider client={client()}>
        <ValueHelpSelect valueHelpId="LANGUAGE" value="JA" />
      </QueryClientProvider>,
    );
    expect(await screen.findByRole('option', { name: '일본어 (JA)' })).toBeTruthy();
    expect(api.item).toHaveBeenCalledWith('LANGUAGE', 'JA');
  });

  it('shows an error instead of silently truncating lists over 200 items', async () => {
    vi.mocked(api.search).mockResolvedValue({ items: [], totalCount: 201, page: 0, size: 200 });
    render(
      <QueryClientProvider client={client()}>
        <ValueHelpSelect valueHelpId="LANGUAGE" />
      </QueryClientProvider>,
    );
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
      <QueryClientProvider client={queryClient}>
        <ValueHelpSelect valueHelpId="DEPARTMENT" filters={{ companyCode: '1000' }} />
      </QueryClientProvider>,
    );
    await waitFor(() =>
      expect(api.search).toHaveBeenCalledWith('DEPARTMENT', { companyCode: '1000' }, 0, 200),
    );
    view.rerender(
      <QueryClientProvider client={queryClient}>
        <ValueHelpSelect valueHelpId="DEPARTMENT" filters={{ companyCode: '2000' }} />
      </QueryClientProvider>,
    );
    await waitFor(() =>
      expect(api.search).toHaveBeenCalledWith('DEPARTMENT', { companyCode: '2000' }, 0, 200),
    );
  });
});
