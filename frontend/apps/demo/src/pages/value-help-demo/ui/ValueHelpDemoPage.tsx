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
      <Card title="사원 정보" style={{ maxWidth: 760 }}>
        <Form
          form={form}
          layout="vertical"
          onValuesChange={(changed) => {
            if ('companyCode' in changed) form.setFieldValue('employeeId', undefined);
          }}
        >
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
            <Space wrap>
              <Button onClick={() => setOpen(true)}>통화 선택</Button>
              {currencies.map((x) => x.currency).join(', ') || '선택 없음'}
            </Space>
          </Form.Item>
        </Form>
      </Card>
      <Card title="HCM Value Help 목록" style={{ maxWidth: 760, marginTop: 24 }}>
        <Typography.Paragraph type="secondary">
          예제 코드는 가상 데이터입니다. 업무 영역과 항목을 선택해 검색해 보세요.
        </Typography.Paragraph>
        <ValueHelpInput id={'LANGUAGE'} />
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
        <ValueHelpInput id="EMPLOYEE" options={hrValueHelpDefinitions.EMPLOYEE} />
        <ValueHelpInput
          id="EMPLOYEE"
          options={{
            ...hrValueHelpDefinitions.EMPLOYEE,
            title: '평가 대상자 선택',
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
      </Card>
      <ValueHelpModal
        id="CURRENCY"
        open={open}
        onClose={() => setOpen(false)}
        onSelect={setCurrencies}
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
