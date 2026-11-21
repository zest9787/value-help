import{j as e,r as j}from"./iframe-DPj0thIZ.js";import{V as o,F as n}from"./ValueHelp-BGi7E4Xx.js";import{T as I}from"./index-BKSQBYkg.js";import"./preload-helper-Dp1pzeXC.js";import"./useValueHelp-Ck5QgubB.js";import"./index-CjhFDGfe.js";const S={title:"Value Help/ValueHelpInput",component:o,parameters:{docs:{description:{component:"코드를 직접 입력하거나 검색 모달에서 한 건을 선택하는 Form 호환 입력 컴포넌트입니다."}}},args:{id:"EMPLOYEE"}};function E({initialValue:r,...x}){const[g,h]=j.useState(r);return e.jsx("div",{className:"story-card",children:e.jsx(o,{...x,value:g,onChange:h})})}const a={render:r=>e.jsx(E,{...r})},s={render:r=>e.jsx(E,{...r,initialValue:"10002"})},t={render:()=>e.jsxs("div",{className:"story-card",children:[e.jsx(I.Paragraph,{type:"secondary",children:"회사 1000의 사원만 조회합니다."}),e.jsx(n,{layout:"vertical",children:e.jsx(n.Item,{label:"사원",name:"employeeId",children:e.jsx(o,{id:"EMPLOYEE",filters:{companyCode:"1000"}})})})]})},H=["Empty","SavedValue","DependentFilter"];var p,m,c;a.parameters={...a.parameters,docs:{...(p=a.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: args => <InputExample {...args} />
}`,...(c=(m=a.parameters)==null?void 0:m.docs)==null?void 0:c.source}}};var l,d,u;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: args => <InputExample {...args} initialValue="10002" />
}`,...(u=(d=s.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var i,y,C;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: () => <div className="story-card">
      <Typography.Paragraph type="secondary">회사 1000의 사원만 조회합니다.</Typography.Paragraph>
      <Form layout="vertical">
        <Form.Item label="사원" name="employeeId">
          <ValueHelpInput id="EMPLOYEE" filters={{
          companyCode: '1000'
        }} />
        </Form.Item>
      </Form>
    </div>
}`,...(C=(y=t.parameters)==null?void 0:y.docs)==null?void 0:C.source}}};export{t as DependentFilter,a as Empty,s as SavedValue,H as __namedExportsOrder,S as default};
