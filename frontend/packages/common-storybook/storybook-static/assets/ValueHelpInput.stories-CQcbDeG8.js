import{j as e,r as Q,V as X,s as i,m as Z}from"./iframe-Btrl7jn6.js";import{V as o,F as t}from"./ValueHelp-D4nsfEDG.js";import{T as W}from"./index-DDXK38EV.js";import{B as ee}from"./index-B375sHzD.js";import"./preload-helper-Dp1pzeXC.js";import"./useValueHelp-BT-wSmXr.js";const pe={title:"Value Help/ValueHelpInput",component:o,parameters:{docs:{description:{component:"모달 선택값을 명칭(코드) 등으로 표시하고 Form에는 코드만 저장합니다. 입력창은 읽기 전용이며 clear 아이콘으로 초기화합니다. displayText, displayFormatter 또는 항목별 options.displayFormat으로 표시를 설정합니다."}}},args:{id:"EMPLOYEE"}};function a({initialValue:r,...s}){const[n,E]=Q.useState(r);return e.jsxs("div",{className:"story-card",children:[e.jsx(o,{...s,value:n,onChange:E}),e.jsx("pre",{"aria-label":"내부 코드값",children:JSON.stringify({value:n??null},null,2)})]})}const l={render:r=>e.jsx(a,{...r})},p={render:r=>e.jsx(a,{...r,initialValue:"10002"})},d={render:()=>e.jsxs("div",{className:"story-card",children:[e.jsx(W.Paragraph,{type:"secondary",children:"회사 1000의 사원만 조회합니다."}),e.jsx(t,{layout:"vertical",children:e.jsx(t.Item,{label:"사원",name:"employeeId",children:e.jsx(o,{id:"EMPLOYEE",filters:{companyCode:"1000"}})})})]})},m={args:{options:{displayFormat:"textCode"}},render:r=>e.jsx(a,{...r,initialValue:"10001"})},c={args:{options:{displayFormat:"codeText"}},render:r=>e.jsx(a,{...r,initialValue:"10001"})},u={args:{options:{displayFormat:"text"}},render:r=>e.jsx(a,{...r,initialValue:"10001"})},x={args:{options:{displayFormat:"code"}},render:r=>e.jsx(a,{...r,initialValue:"10001"})},y={args:{options:{displayFormatter:(r,s)=>s?`${s} / ${r}`:r}},render:r=>e.jsx(a,{...r,initialValue:"10001"})},g={args:{displayText:"평가 대상자 · 김민수(10001)"},render:r=>e.jsx(a,{...r,initialValue:"10001"})},re={...i,EMPLOYEE:{...i.EMPLOYEE,displayFormat:"textCode"},COMPANY:{...i.COMPANY,displayFormat:"codeText"},LANGUAGE:{...i.LANGUAGE,displayFormat:"text"}};function ae(){const[r,s]=Q.useState(null);return e.jsx(X,{api:Z,definitions:re,children:e.jsxs("div",{className:"story-card",children:[e.jsx(W.Paragraph,{children:"항목별 표시 형식입니다. 선택 또는 clear 후 저장하면 코드만 제출되는지 확인할 수 있습니다."}),e.jsxs(t,{layout:"vertical",initialValues:{employeeId:"10001",companyCode:"1000",language:"KO"},onFinish:n=>{console.log("[Storybook Form submit]",n),s(JSON.parse(JSON.stringify(n,(E,F)=>F===void 0?null:F)))},children:[e.jsx(t.Item,{name:"employeeId",label:"사원 · 명칭(코드)",children:e.jsx(o,{id:"EMPLOYEE"})}),e.jsx(t.Item,{name:"companyCode",label:"회사 · 코드(명칭)",children:e.jsx(o,{id:"COMPANY"})}),e.jsx(t.Item,{name:"language",label:"언어 · 명칭만",children:e.jsx(o,{id:"LANGUAGE"})}),e.jsx(ee,{type:"primary",htmlType:"submit",children:"저장"})]}),r&&e.jsx("pre",{"aria-label":"Form 제출값",children:JSON.stringify(r,null,2)})]})})}const C={render:()=>e.jsx(ae,{})},de=["Empty","SavedValue","DependentFilter","TextCode","CodeText","TextOnly","CodeOnly","CustomFormatter","ExplicitDisplayText","FormSubmit"];var j,h,V;l.parameters={...l.parameters,docs:{...(j=l.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: args => <InputExample {...args} />
}`,...(V=(h=l.parameters)==null?void 0:h.docs)==null?void 0:V.source}}};var S,I,O;p.parameters={...p.parameters,docs:{...(S=p.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: args => <InputExample {...args} initialValue="10002" />
}`,...(O=(I=p.parameters)==null?void 0:I.docs)==null?void 0:O.source}}};var T,b,f;d.parameters={...d.parameters,docs:{...(T=d.parameters)==null?void 0:T.docs,source:{originalSource:`{
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
}`,...(f=(b=d.parameters)==null?void 0:b.docs)==null?void 0:f.source}}};var A,N,P;m.parameters={...m.parameters,docs:{...(A=m.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    options: {
      displayFormat: 'textCode'
    }
  },
  render: args => <InputExample {...args} initialValue="10001" />
}`,...(P=(N=m.parameters)==null?void 0:N.docs)==null?void 0:P.source}}};var v,D,B;c.parameters={...c.parameters,docs:{...(v=c.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    options: {
      displayFormat: 'codeText'
    }
  },
  render: args => <InputExample {...args} initialValue="10001" />
}`,...(B=(D=c.parameters)==null?void 0:D.docs)==null?void 0:B.source}}};var L,M,Y;u.parameters={...u.parameters,docs:{...(L=u.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    options: {
      displayFormat: 'text'
    }
  },
  render: args => <InputExample {...args} initialValue="10001" />
}`,...(Y=(M=u.parameters)==null?void 0:M.docs)==null?void 0:Y.source}}};var G,H,J;x.parameters={...x.parameters,docs:{...(G=x.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    options: {
      displayFormat: 'code'
    }
  },
  render: args => <InputExample {...args} initialValue="10001" />
}`,...(J=(H=x.parameters)==null?void 0:H.docs)==null?void 0:J.source}}};var $,k,U;y.parameters={...y.parameters,docs:{...($=y.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    options: {
      displayFormatter: (code, text) => text ? \`\${text} / \${code}\` : code
    }
  },
  render: args => <InputExample {...args} initialValue="10001" />
}`,...(U=(k=y.parameters)==null?void 0:k.docs)==null?void 0:U.source}}};var _,K,R;g.parameters={...g.parameters,docs:{...(_=g.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    displayText: '평가 대상자 · 김민수(10001)'
  },
  render: args => <InputExample {...args} initialValue="10001" />
}`,...(R=(K=g.parameters)==null?void 0:K.docs)==null?void 0:R.source}}};var q,w,z;C.parameters={...C.parameters,docs:{...(q=C.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => <SubmitExample />
}`,...(z=(w=C.parameters)==null?void 0:w.docs)==null?void 0:z.source}}};export{x as CodeOnly,c as CodeText,y as CustomFormatter,d as DependentFilter,l as Empty,g as ExplicitDisplayText,C as FormSubmit,p as SavedValue,m as TextCode,u as TextOnly,de as __namedExportsOrder,pe as default};
