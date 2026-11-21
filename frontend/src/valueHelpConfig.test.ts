import { describe, expect, it } from 'vitest';
import { resolveValueHelpOptions } from './valueHelpConfig';
import { hrCatalog } from './hrValueHelpConfig';

describe('resolveValueHelpOptions', () => {
  it('provides a display configuration and valid nested lookup for every catalog entry', () => {
    const ids = hrCatalog.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toHaveLength(40);
    for (const id of ids) {
      const config = resolveValueHelpOptions(id);
      expect(config.columns.length, id).toBeGreaterThan(0);
      for (const field of config.searchFields) {
        if (field.type === 'valueHelp')
          expect(ids, `${id}.${field.name}`).toContain(field.valueHelpId);
      }
    }
  });
  it('preserves unspecified defaults while applying screen-specific options', () => {
    const resolved = resolveValueHelpOptions('EMPLOYEE', {
      title: '평가 대상자 선택',
      selectionMode: 'multiple',
      modal: { gridHeight: 500 },
      pageSize: 25,
    });
    expect(resolved.title).toBe('평가 대상자 선택');
    expect(resolved.selectionMode).toBe('multiple');
    expect(resolved.modal).toMatchObject({ size: 'L', gridHeight: 500, searchColumns: 3 });
    expect(resolved.searchFields.map((field) => field.name)).toContain('departmentId');
    expect(resolved.pageSize).toBe(25);
  });

  it('replaces arrays, including an empty array, without changing shared defaults', () => {
    const resolved = resolveValueHelpOptions('EMPLOYEE', {
      searchFields: [],
      columns: [{ field: 'employeeName', headerName: '성명', sortable: false }],
    });
    expect(resolved.searchFields).toEqual([]);
    expect(resolved.columns).toEqual([
      { field: 'employeeName', headerName: '성명', sortable: false },
    ]);
    expect(resolveValueHelpOptions('EMPLOYEE').searchFields.length).toBeGreaterThan(0);
  });

  it('allows a new server id to be configured and rejects invalid page and layout sizes', () => {
    expect(resolveValueHelpOptions('NEW_ID', { title: '새 검색' }).title).toBe('새 검색');
    expect(() => resolveValueHelpOptions('EMPLOYEE', { pageSize: 201 })).toThrow();
    expect(() => resolveValueHelpOptions('EMPLOYEE', { modal: { searchColumns: 0 } })).toThrow();
  });
});
