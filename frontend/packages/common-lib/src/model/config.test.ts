import { describe, expect, it } from 'vitest';
import { resolveValueHelpOptions, type ValueHelpDefinitions } from './config';

const definitions: ValueHelpDefinitions = {
  EMPLOYEE: {
    title: '사원 검색',
    modal: { size: 'L' },
    searchFields: [{ name: 'employeeName', label: '사원명', type: 'text' }],
    columns: [{ field: 'employeeId', headerName: '사번' }],
  },
};

describe('resolveValueHelpOptions', () => {
  it('merges package defaults, app definitions, and call-site options', () => {
    const resolved = resolveValueHelpOptions(
      'EMPLOYEE',
      { title: '평가 대상자 선택', modal: { gridHeight: 500 }, pageSize: 25 },
      definitions,
    );
    expect(resolved.title).toBe('평가 대상자 선택');
    expect(resolved.modal).toMatchObject({ size: 'L', gridHeight: 500, searchColumns: 3 });
    expect(resolved.columns).toEqual([{ field: 'employeeId', headerName: '사번' }]);
  });

  it('replaces arrays without mutating app definitions', () => {
    expect(
      resolveValueHelpOptions('EMPLOYEE', { searchFields: [] }, definitions).searchFields,
    ).toEqual([]);
    expect(resolveValueHelpOptions('EMPLOYEE', {}, definitions).searchFields).toHaveLength(1);
  });

  it('supports an unregistered id and validates sizes', () => {
    expect(resolveValueHelpOptions('NEW_ID', { title: '새 검색' }).title).toBe('새 검색');
    expect(() => resolveValueHelpOptions('EMPLOYEE', { pageSize: 201 }, definitions)).toThrow();
    expect(() =>
      resolveValueHelpOptions('EMPLOYEE', { modal: { searchColumns: 0 } }, definitions),
    ).toThrow();
  });
});
