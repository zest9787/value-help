import { useState } from 'react';
import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Form, Typography } from 'antd';
import { ValueHelpInput } from 'common-lib/value-help';

const meta = {
  title: 'Value Help/ValueHelpInput',
  component: ValueHelpInput,
  parameters: {
    docs: {
      description: {
        component:
          '코드를 직접 입력하거나 검색 모달에서 한 건을 선택하는 Form 호환 입력 컴포넌트입니다.',
      },
    },
  },
  args: { id: 'EMPLOYEE' },
} satisfies Meta<typeof ValueHelpInput>;

export default meta;
type Story = StoryObj<typeof meta>;

function InputExample({
  initialValue,
  ...args
}: ComponentProps<typeof ValueHelpInput> & { initialValue?: string }) {
  const [value, setValue] = useState<string | undefined>(initialValue);
  return (
    <div className="story-card">
      <ValueHelpInput {...args} value={value} onChange={setValue} />
    </div>
  );
}

export const Empty: Story = {
  render: (args) => <InputExample {...args} />,
};

export const SavedValue: Story = {
  render: (args) => <InputExample {...args} initialValue="10002" />,
};

export const DependentFilter: Story = {
  render: () => (
    <div className="story-card">
      <Typography.Paragraph type="secondary">회사 1000의 사원만 조회합니다.</Typography.Paragraph>
      <Form layout="vertical">
        <Form.Item label="사원" name="employeeId">
          <ValueHelpInput id="EMPLOYEE" filters={{ companyCode: '1000' }} />
        </Form.Item>
      </Form>
    </div>
  ),
};
