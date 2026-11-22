import { useState } from 'react';
import { Button, Card, Form, Select, Space, Typography } from 'antd';
import {
  ValueHelpInput,
  ValueHelpModal,
  ValueHelpSelect,
  hrCatalog,
  hrValueHelpDefinitions,
  type Row,
  type ValueHelpOptions,
} from 'common-lib/value-help';

// 화면에서 필요한 항목만 표시하고 제목과 모달 크기를 변경하는 예시.
const employeeOptions: ValueHelpOptions = {
  title: '담당 사원 선택',
  modal: { size: 'XL', gridHeight: 400 },
  columns: [
    { field: 'employeeId', headerName: '사번', width: 130 },
    { field: 'employeeName', headerName: '성명', width: 180 },
    { field: 'departmentName', headerName: '소속 부서', width: 180 },
  ],
};

export function ValueHelpDemoPage() {
  const [form] = Form.useForm();
  const [displayCodeField, setDisplayCodeField] = useState('employeeId');
  const [displayTextField, setDisplayTextField] = useState('employeeName');
  const customEmployeeCode = Form.useWatch('customEmployeeId', form);
  const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null);
  const company = Form.useWatch('companyCode', form);
  const [open, setOpen] = useState(false);
  const [currencies, setCurrencies] = useState<Row[]>([]);
  const [catalogId, setCatalogId] = useState<string>('PERSONNEL_AREA');
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [catalogResult, setCatalogResult] = useState<Row | null>(null);
  return (
    <main>
      <Typography.Title level={2}>SAP Value Help 공통화</Typography.Title>
      <Typography.Paragraph type="secondary">
        화면 설정으로 공통 검색창을 구성하고 목 데이터로 동작하는 데모입니다.
      </Typography.Paragraph>
      <Form
        form={form}
        initialValues={{
          customEmployeeId: '10001',
          formattedEmployee: '10001',
          richEmployee: '10001',
        }}
        layout="vertical"
        onFinish={(values) => {
          console.log('[Value Help Form submit]', values);
          // undefined도 null로 보여 지운 필드까지 확인할 수 있다.
          setSubmitted(
            JSON.parse(
              JSON.stringify(values, (_key, value) => (value === undefined ? null : value)),
            ),
          );
        }}
        onValuesChange={(changed) => {
          if ('companyCode' in changed) form.setFieldValue('employeeId', undefined);
        }}
      >
        <Card title="사원 정보" style={{ maxWidth: 760 }}>
          <Form.Item name="companyCode" label="회사">
            <ValueHelpInput id="COMPANY" />
          </Form.Item>
          <Form.Item name="employeeId" label="사원">
            <ValueHelpInput
              id="EMPLOYEE"
              filters={company ? { companyCode: company } : {}}
              options={employeeOptions}
            />
          </Form.Item>
          <Form.Item name="language" label="언어 (Select)">
            <ValueHelpSelect valueHelpId="LANGUAGE" placeholder="언어를 선택하세요" />
          </Form.Item>
          <Form.Item label="통화 (다중 선택)">
            <Form.Item name="currencyCodes" hidden>
              <Select mode="multiple" />
            </Form.Item>
            <Space wrap>
              <Button onClick={() => setOpen(true)}>통화 선택</Button>
              {currencies.map((x) => x.currency).join(', ') || '선택 없음'}
            </Space>
          </Form.Item>
        </Card>
        <Card title="HCM Value Help 목록" style={{ maxWidth: 760, marginTop: 24 }}>
          <Typography.Paragraph type="secondary">
            예제 코드는 가상 데이터입니다. 업무 영역과 항목을 선택해 검색해 보세요.
          </Typography.Paragraph>
          <Form.Item name="languageInput" label="언어 · 명칭만 표시">
            <ValueHelpInput id="LANGUAGE" options={{ displayFormat: (_code, text) => text }} />
          </Form.Item>
          <Space wrap>
            <Select
              aria-label="Value Help 종류"
              showSearch
              optionFilterProp="label"
              style={{ width: 280 }}
              value={catalogId}
              onChange={(id) => {
                setCatalogId(id);
                setCatalogResult(null);
              }}
              options={Array.from(new Set(hrCatalog.map((entry) => entry.category))).map(
                (category) => ({
                  label: category,
                  options: hrCatalog
                    .filter((entry) => entry.category === category)
                    .map((entry) => ({ value: entry.id, label: entry.label })),
                }),
              )}
            />
            <Button type="primary" onClick={() => setCatalogOpen(true)}>
              검색
            </Button>
          </Space>
          {catalogResult && (
            <pre className="catalog-result">{JSON.stringify(catalogResult, null, 2)}</pre>
          )}
          <Form.Item name="employeeDefault" label="사원 · 명칭(코드)">
            <ValueHelpInput id="EMPLOYEE" options={hrValueHelpDefinitions.EMPLOYEE} />
          </Form.Item>
          <Form.Item name="evaluationEmployee" label="평가 대상자 · 코드(명칭)">
            <ValueHelpInput
              id="EMPLOYEE"
              options={{
                ...hrValueHelpDefinitions.EMPLOYEE,
                title: '평가 대상자 선택',
                displayFormat: (code, text) => (text ? `${code}(${text})` : code),
                modal: {
                  ...hrValueHelpDefinitions.EMPLOYEE.modal,
                  gridHeight: 500,
                },
                columns: [
                  { field: 'employeeId', headerName: '사번' },
                  { field: 'employeeName', headerName: '평가 대상자' },
                ],
              }}
            />
          </Form.Item>
        </Card>
        <Card title="입력창에 표시할 응답 필드 설정" style={{ maxWidth: 760, marginTop: 24 }}>
          <Typography.Paragraph type="secondary">
            표시할 코드와 명칭의 필드명을 지정합니다. 어떤 필드를 표시하든 Form에는
            사번(employeeId)을 저장합니다.
          </Typography.Paragraph>
          <Form.Item label="표시 코드 필드">
            <Select
              value={displayCodeField}
              onChange={setDisplayCodeField}
              options={['employeeId', 'departmentId', 'companyCode'].map((value) => ({
                value,
                label: value,
              }))}
            />
          </Form.Item>
          <Form.Item label="표시 명칭 필드">
            <Select
              value={displayTextField}
              onChange={setDisplayTextField}
              options={['employeeName', 'departmentName'].map((value) => ({ value, label: value }))}
            />
          </Form.Item>
          <Form.Item name="customEmployeeId" label="사원 · 선택한 필드로 표시">
            <ValueHelpInput
              id="EMPLOYEE"
              options={{ displayFields: { code: displayCodeField, text: displayTextField } }}
            />
          </Form.Item>
          <Typography.Paragraph>
            실제 Form 코드값:{' '}
            <Typography.Text code>{customEmployeeCode ?? '선택 없음'}</Typography.Text>
          </Typography.Paragraph>
          <Typography.Text type="secondary">
            예: departmentName / departmentId를 선택하면 인사팀(D101)로 표시하고 10001을 저장합니다.
          </Typography.Text>
        </Card>
        <Card title="displayFormat 콜백 · 다른 필드 조합" style={{ maxWidth: 760, marginTop: 24 }}>
          <Form.Item name="formattedEmployee" label="문자열 · code $$$ text + 부서명">
            <ValueHelpInput
              id="EMPLOYEE"
              displayFormat={(code, text, row) => `${code}$$$${text} / ${row.departmentName ?? ''}`}
            />
          </Form.Item>
          <Form.Item name="richEmployee" label="ReactNode · 명칭 강조 + 부서명">
            <ValueHelpInput
              id="EMPLOYEE"
              displayFormat={(code, text, row) => (
                <span>
                  <strong>{text}</strong> · {row.departmentName} ({code})
                </span>
              )}
            />
          </Form.Item>
        </Card>
        <Button type="primary" htmlType="submit" style={{ marginTop: 16 }}>
          저장
        </Button>
      </Form>
      {submitted && (
        <Card title="Form 제출값 · 코드 저장 확인" style={{ maxWidth: 760, marginTop: 16 }}>
          <Typography.Paragraph>
            저장 API 호출 없이 제출값을 화면과 브라우저 콘솔에 출력합니다.
          </Typography.Paragraph>
          <pre aria-label="Form 제출값">{JSON.stringify(submitted, null, 2)}</pre>
        </Card>
      )}
      <ValueHelpModal
        id="CURRENCY"
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(rows) => {
          setCurrencies(rows);
          form.setFieldValue(
            'currencyCodes',
            rows.map((row) => row.currency),
          );
        }}
        options={{ title: '사용 통화 선택', pageSize: 20, modal: { size: 'M' } }}
      />
      <ValueHelpModal
        id={catalogId}
        open={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        onSelect={(rows) => setCatalogResult(rows[0] ?? null)}
        options={{ selectionMode: 'single' }}
      />
    </main>
  );
}
