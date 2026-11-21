import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input, Table, Tag, Typography } from 'antd';
import { hrCatalog, hrValueHelpDefinitions, type ValueHelpOptions } from 'common-lib/value-help';

type CatalogRow = {
  id: string;
  label: string;
  category: string;
  definition: ValueHelpOptions;
};

const rows: CatalogRow[] = hrCatalog.map((item) => ({
  ...item,
  definition: hrValueHelpDefinitions[item.id] ?? {},
}));

function fieldNames(definition: ValueHelpOptions, key: 'searchFields' | 'columns') {
  if (key === 'searchFields') return (definition.searchFields ?? []).map((field) => field.name);
  return (definition.columns ?? []).map((field) => field.field);
}

function ValueHelpCatalog() {
  const [keyword, setKeyword] = useState('');
  const filtered = useMemo(() => {
    const query = keyword.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      [row.id, row.label, row.category, row.definition.title]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query)),
    );
  }, [keyword]);

  return (
    <div className="catalog-story">
      <Typography.Title level={2}>HR Value Help Catalog</Typography.Title>
      <Typography.Paragraph type="secondary">
        common-lib/value-help가 기본 제공하는 {rows.length}개 정의입니다. 각 앱은 이 정의를 그대로
        사용하거나 mergeValueHelpDefinitions로 재정의할 수 있습니다.
      </Typography.Paragraph>
      <Input.Search
        allowClear
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder="ID, 이름 또는 카테고리 검색"
        className="catalog-search"
      />
      <Table<CatalogRow>
        rowKey="id"
        dataSource={filtered}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        scroll={{ x: 900 }}
        columns={[
          { title: '카테고리', dataIndex: 'category', width: 130 },
          { title: 'ID', dataIndex: 'id', width: 190, render: (id: string) => <Tag>{id}</Tag> },
          { title: '이름', dataIndex: 'label', width: 140 },
          {
            title: '기본 제목',
            width: 180,
            render: (_, row) => row.definition.title ?? '-',
          },
          {
            title: '검색 필드',
            width: 260,
            render: (_, row) => fieldNames(row.definition, 'searchFields').join(', ') || '-',
          },
          {
            title: '목록 컬럼',
            width: 320,
            render: (_, row) => fieldNames(row.definition, 'columns').join(', ') || '-',
          },
        ]}
      />
    </div>
  );
}

const meta = {
  title: 'Value Help/Catalog',
  component: ValueHelpCatalog,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'common-lib에 정의된 HR Value Help의 ID와 기본 화면 설정을 조회합니다.',
      },
    },
  },
} satisfies Meta<typeof ValueHelpCatalog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllDefinitions: Story = {};
