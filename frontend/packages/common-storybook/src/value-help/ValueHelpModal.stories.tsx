import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Typography } from 'antd';
import { ValueHelpModal, type Row, type ValueHelpOptions } from 'common-lib/value-help';

type ModalStoryProps = { id: string; options?: ValueHelpOptions; fixedFilters?: Row };

function ModalStory({ id, options, fixedFilters }: ModalStoryProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Row[]>([]);
  return (
    <div className="story-card">
      <Button type="primary" onClick={() => setOpen(true)}>
        검색 모달 열기
      </Button>
      <Typography.Paragraph>
        선택 결과: {selected.length ? JSON.stringify(selected) : '없음'}
      </Typography.Paragraph>
      <ValueHelpModal
        id={id}
        open={open}
        fixedFilters={fixedFilters}
        options={options}
        onClose={() => setOpen(false)}
        onSelect={setSelected}
      />
    </div>
  );
}

const meta = {
  title: 'Value Help/ValueHelpModal',
  component: ModalStory,
  parameters: {
    docs: {
      description: {
        component:
          '검색 조건, 정렬, 페이징, 중첩 Value Help와 단일·다중 선택을 제공하는 공통 모달입니다.',
      },
    },
  },
  args: { id: 'EMPLOYEE' },
} satisfies Meta<typeof ModalStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmployeeSingleSelection: Story = {};
export const NestedValueHelp: Story = {
  parameters: {
    docs: {
      description: {
        story: '회사와 부서 검색 필드의 검색 버튼을 눌러 중첩 Value Help를 확인할 수 있습니다.',
      },
    },
  },
};
export const FixedCompanyFilter: Story = { args: { fixedFilters: { companyCode: '1000' } } };
export const CurrencyMultipleSelection: Story = {
  args: { id: 'CURRENCY', options: { selectionMode: 'multiple' } },
};
export const CustomColumns: Story = {
  args: {
    options: {
      title: '평가 대상자 선택',
      modal: { size: 'XL', gridHeight: 420 },
      columns: [
        { field: 'employeeId', headerName: '사번', width: 130 },
        { field: 'employeeName', headerName: '성명', width: 180 },
        { field: 'departmentName', headerName: '소속 부서', width: 180 },
      ],
    },
  },
};
