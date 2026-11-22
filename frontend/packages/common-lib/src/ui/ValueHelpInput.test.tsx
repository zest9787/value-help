// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ValueHelpInput } from './ValueHelp';
import { ValueHelpProvider } from '../model/ValueHelpProvider';

vi.mock('ag-grid-react', () => ({ AgGridReact: () => null }));
afterEach(cleanup);

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
