import { useState } from 'react';
import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Form, Typography } from 'antd';
import { ValueHelpInput, ValueHelpProvider } from 'common-lib/value-help';
import { mockApi, storyDefinitions } from './mockValueHelp';

const meta = {
  title: 'Value Help/ValueHelpInput',
  component: ValueHelpInput,
  parameters: {
    docs: {
      description: {
        component:
          '모달 선택값을 명칭(코드) 등으로 표시하고 Form에는 코드만 저장합니다. 기본 입력창은 읽기 전용이며 options.autoComplete로 자동완성을 선택적으로 켤 수 있습니다. displayFormat(code, text, row) 콜백으로 문자열 또는 JSX를 표시합니다.',
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
      <pre aria-label="내부 코드값">{JSON.stringify({ value: value ?? null }, null, 2)}</pre>
    </div>
  );
}

export const Empty: Story = {
  render: (args) => <InputExample {...args} />,
};

export const SavedValue: Story = {
  render: (args) => <InputExample {...args} initialValue="10002" />,
};

export const AutoComplete: Story = {
  args: { options: { autoComplete: { searchField: 'employeeName', debounceMs: 300 } } },
  render: (args) => <InputExample {...args} />,
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

export const TextCode: Story = {
  args: { options: { displayFormat: (code, text) => (text ? `${text}(${code})` : code) } },
  render: (args) => <InputExample {...args} initialValue="10001" />,
};
export const CodeText: Story = {
  args: { options: { displayFormat: (code, text) => (text ? `${code}(${text})` : code) } },
  render: (args) => <InputExample {...args} initialValue="10001" />,
};
export const TextOnly: Story = {
  args: { options: { displayFormat: (_code, text) => text } },
  render: (args) => <InputExample {...args} initialValue="10001" />,
};
export const CodeOnly: Story = {
  args: { options: { displayFormat: (code) => code } },
  render: (args) => <InputExample {...args} initialValue="10001" />,
};
export const CustomFormatter: Story = {
  args: { options: { displayFormat: (code, text) => (text ? `${text} / ${code}` : code) } },
  render: (args) => <InputExample {...args} initialValue="10001" />,
};
export const ExplicitDisplayText: Story = {
  args: { displayFormat: (code, text) => `평가 대상자 · ${text}(${code})` },
  render: (args) => <InputExample {...args} initialValue="10001" />,
};

const perItemDefinitions: typeof storyDefinitions = {
  ...storyDefinitions,
  EMPLOYEE: {
    ...storyDefinitions.EMPLOYEE,
    displayFormat: (code, text) => (text ? `${text}(${code})` : code),
  },
  COMPANY: {
    ...storyDefinitions.COMPANY,
    displayFormat: (code, text) => (text ? `${code}(${text})` : code),
  },
  LANGUAGE: { ...storyDefinitions.LANGUAGE, displayFormat: (_code, text) => text },
};

function SubmitExample() {
  const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null);
  return (
    <ValueHelpProvider api={mockApi} definitions={perItemDefinitions}>
      <div className="story-card">
        <Typography.Paragraph>
          항목별 표시 형식입니다. 선택 또는 clear 후 저장하면 코드만 제출되는지 확인할 수 있습니다.
        </Typography.Paragraph>
        <Form
          layout="vertical"
          initialValues={{ employeeId: '10001', companyCode: '1000', language: 'KO' }}
          onFinish={(values) => {
            console.log('[Storybook Form submit]', values);
            setSubmitted(
              JSON.parse(
                JSON.stringify(values, (_key, value) => (value === undefined ? null : value)),
              ),
            );
          }}
        >
          <Form.Item name="employeeId" label="사원 · 명칭(코드)">
            <ValueHelpInput id="EMPLOYEE" />
          </Form.Item>
          <Form.Item name="companyCode" label="회사 · 코드(명칭)">
            <ValueHelpInput id="COMPANY" />
          </Form.Item>
          <Form.Item name="language" label="언어 · 명칭만">
            <ValueHelpInput id="LANGUAGE" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            저장
          </Button>
        </Form>
        {submitted && <pre aria-label="Form 제출값">{JSON.stringify(submitted, null, 2)}</pre>}
      </div>
    </ValueHelpProvider>
  );
}

export const FormSubmit: Story = {
  render: () => <SubmitExample />,
};

/** 표시 필드를 부서로 바꿔도 Form의 사원 코드는 유지된다. */
export const DisplayFields: Story = {
  args: {
    options: {
      displayFields: { code: 'departmentId', text: 'departmentName' },
      displayFormat: (code, text) => (text ? `${text}(${code})` : code),
    },
  },
  render: (args) => <InputExample {...args} initialValue="10001" />,
};

export const OtherFieldsAndReactNode: Story = {
  args: {
    displayFormat: (code, text, row) => (
      <span>
        <strong>{text}</strong> · {row.departmentName} <em>({code})</em>
      </span>
    ),
  },
  render: (args) => <InputExample {...args} initialValue="10001" />,
};
