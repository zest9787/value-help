// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Button, Form } from 'antd';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ValueHelpInput } from './ValueHelp';
import { ValueHelpProvider } from '../model/ValueHelpProvider';

vi.mock('ag-grid-react', () => ({ AgGridReact: () => null }));
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function renderInput(
  displayFormat: NonNullable<React.ComponentProps<typeof ValueHelpInput>['displayFormat']>,
) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });
  client.setQueryData(['metadata', 'EMPLOYEE'], {
    id: 'EMPLOYEE',
    keyField: 'employeeId',
    textField: 'employeeName',
  });
  client.setQueryData(['item', 'EMPLOYEE', '10001'], {
    employeeId: '10001',
    employeeName: '김민수',
    departmentName: '인사팀',
  });
  const onChange = vi.fn();
  const api = { metadata: vi.fn(), item: vi.fn(), search: vi.fn() };
  render(
    <QueryClientProvider client={client}>
      <ValueHelpProvider api={api}>
        <ValueHelpInput
          id="EMPLOYEE"
          value="10001"
          onChange={onChange}
          displayFormat={displayFormat}
        />
      </ValueHelpProvider>
    </QueryClientProvider>,
  );
  return onChange;
}

describe('ValueHelpInput displayFormat', () => {
  it('combines arbitrary fields as text while preserving the code callback contract', () => {
    const onChange = renderInput((code, text, row) => `${code}$$$${text} / ${row.departmentName}`);
    expect(screen.getByRole('searchbox').getAttribute('value')).toBe('10001$$$김민수 / 인사팀');
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: '선택값 지우기' }));
    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it('renders JSX inside the input without converting it into an object string', () => {
    const onChange = renderInput((code, text, row) => (
      <strong>
        {text} / {row.departmentName} ({code})
      </strong>
    ));
    expect(screen.getByText('김민수 / 인사팀 (10001)').tagName).toBe('STRONG');
    expect(screen.getByRole('searchbox').getAttribute('value')).toBe('');
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('ValueHelpInput autocomplete integration', () => {
  it('shows suggestions using Ant Design Select and returns the selected code', async () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: Infinity } },
    });
    client.setQueryData(['metadata', 'EMPLOYEE'], {
      id: 'EMPLOYEE',
      keyField: 'employeeId',
      textField: 'employeeName',
    });
    const api = {
      metadata: vi.fn(),
      item: vi.fn(),
      search: vi.fn().mockResolvedValue({
        items: [{ employeeId: '10001', employeeName: '김민수', companyCode: '1000' }],
        totalCount: 1,
        page: 0,
        size: 10,
      }),
    };
    const onChange = vi.fn();
    const onFinish = vi.fn();
    render(
      <QueryClientProvider client={client}>
        <ValueHelpProvider api={api}>
          <Form onFinish={onFinish}>
            <Form.Item name="employeeId">
              <ValueHelpInput
                id="EMPLOYEE"
                filters={{ companyCode: '1000' }}
                options={{ autoComplete: { debounceMs: 0 } }}
                onChange={onChange}
              />
            </Form.Item>
            <Button htmlType="submit">저장</Button>
          </Form>
        </ValueHelpProvider>
      </QueryClientProvider>,
    );
    const input = screen.getByRole('combobox', { name: 'EMPLOYEE 자동완성' });
    fireEvent.focus(input);
    fireEvent.mouseDown(input);
    fireEvent.change(input, { target: { value: '김' } });
    await waitFor(() =>
      expect(api.search).toHaveBeenCalledWith(
        'EMPLOYEE',
        { employeeName: '김', companyCode: '1000' },
        0,
        10,
      ),
    );
    const label = await screen.findByText('김민수(10001)', {
      selector: '.ant-select-item-option-content',
    });
    fireEvent.click(label);
    await waitFor(() => expect(onChange).toHaveBeenCalledWith('10001'));
    fireEvent.click(screen.getByRole('button', { name: '저장' }));
    await waitFor(() => expect(onFinish).toHaveBeenCalledWith({ employeeId: '10001' }));
    expect(client.getQueryData(['item', 'EMPLOYEE', '10001'])).toMatchObject({
      employeeName: '김민수',
    });
  });

  it('uses one context modal for a shared metadata error', async () => {
    const getComputedStyle = window.getComputedStyle.bind(window);
    vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => getComputedStyle(element));
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const api = {
      metadata: vi.fn().mockRejectedValue(new Error('network')),
      item: vi.fn(),
      search: vi.fn(),
    };
    render(
      <QueryClientProvider client={client}>
        <ValueHelpProvider api={api}>
          <ValueHelpInput id="EMPLOYEE" />
          <ValueHelpInput id="EMPLOYEE" />
        </ValueHelpProvider>
      </QueryClientProvider>,
    );
    await screen.findByText('Value Help 정보를 불러오지 못했습니다.');
    expect(screen.getAllByText('Value Help 정보를 불러오지 못했습니다.')).toHaveLength(1);
    expect(api.metadata).toHaveBeenCalledTimes(1);
  });
});
