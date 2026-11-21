import { useState } from 'react';
import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from 'antd';
import { ValueHelpSelect } from 'common-lib/value-help';

const meta = {
  title: 'Value Help/ValueHelpSelect',
  component: ValueHelpSelect,
  parameters: {
    docs: {
      description: {
        component:
          '최대 200건의 작은 Value Help를 Select로 표현합니다. Form에는 코드 문자열을 저장합니다.',
      },
    },
  },
  args: { valueHelpId: 'LANGUAGE', placeholder: '언어를 선택하세요' },
} satisfies Meta<typeof ValueHelpSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

function SelectExample(props: ComponentProps<typeof ValueHelpSelect>) {
  const [value, setValue] = useState<string>();
  return (
    <div className="story-card">
      <ValueHelpSelect {...props} value={value} onChange={setValue} />
      <Typography.Paragraph>선택 코드: {value ?? '없음'}</Typography.Paragraph>
    </div>
  );
}

export const Default: Story = {
  render: (args) => <SelectExample {...args} />,
};

export const SavedValue: Story = { args: { value: 'EN' } };
export const Disabled: Story = { args: { value: 'KO', disabled: true } };
