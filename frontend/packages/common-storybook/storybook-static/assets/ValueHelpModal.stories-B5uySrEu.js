import{r as i,j as e}from"./iframe-C0gdHt4K.js";import{B as j,a as w}from"./ValueHelp-Zosrvo9i.js";import{T as F}from"./useQuery-DkOCKVaK.js";import"./preload-helper-Dp1pzeXC.js";function R({id:E,options:H,fixedFilters:M}){const[V,n]=i.useState(!1),[u,A]=i.useState([]);return e.jsxs("div",{className:"story-card",children:[e.jsx(j,{type:"primary",onClick:()=>n(!0),children:"검색 모달 열기"}),e.jsxs(F.Paragraph,{children:["선택 결과: ",u.length?JSON.stringify(u):"없음"]}),e.jsx(w,{id:E,open:V,fixedFilters:M,options:H,onClose:()=>n(!1),onSelect:A})]})}const I={title:"Value Help/ValueHelpModal",component:R,parameters:{docs:{description:{component:"검색 조건, 정렬, 페이징, 중첩 Value Help와 단일·다중 선택을 제공하는 공통 모달입니다."}}},args:{id:"EMPLOYEE"}},r={},s={parameters:{docs:{description:{story:"회사와 부서 검색 필드의 검색 버튼을 눌러 중첩 Value Help를 확인할 수 있습니다."}}}},a={args:{fixedFilters:{companyCode:"1000"}}},o={args:{id:"CURRENCY",options:{selectionMode:"multiple"}}},t={args:{options:{title:"평가 대상자 선택",modal:{size:"XL",gridHeight:420},columns:[{field:"employeeId",headerName:"사번",width:130},{field:"employeeName",headerName:"성명",width:180},{field:"departmentName",headerName:"소속 부서",width:180}]}}},P=["EmployeeSingleSelection","NestedValueHelp","FixedCompanyFilter","CurrencyMultipleSelection","CustomColumns"];var l,d,p;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:"{}",...(p=(d=r.parameters)==null?void 0:d.docs)==null?void 0:p.source}}};var c,m,C;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: '회사와 부서 검색 필드의 검색 버튼을 눌러 중첩 Value Help를 확인할 수 있습니다.'
      }
    }
  }
}`,...(C=(m=s.parameters)==null?void 0:m.docs)==null?void 0:C.source}}};var g,y,h;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    fixedFilters: {
      companyCode: '1000'
    }
  }
}`,...(h=(y=a.parameters)==null?void 0:y.docs)==null?void 0:h.source}}};var S,f,B;o.parameters={...o.parameters,docs:{...(S=o.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    id: 'CURRENCY',
    options: {
      selectionMode: 'multiple'
    }
  }
}`,...(B=(f=o.parameters)==null?void 0:f.docs)==null?void 0:B.source}}};var N,x,D;t.parameters={...t.parameters,docs:{...(N=t.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    options: {
      title: '평가 대상자 선택',
      modal: {
        size: 'XL',
        gridHeight: 420
      },
      columns: [{
        field: 'employeeId',
        headerName: '사번',
        width: 130
      }, {
        field: 'employeeName',
        headerName: '성명',
        width: 180
      }, {
        field: 'departmentName',
        headerName: '소속 부서',
        width: 180
      }]
    }
  }
}`,...(D=(x=t.parameters)==null?void 0:x.docs)==null?void 0:D.source}}};export{o as CurrencyMultipleSelection,t as CustomColumns,r as EmployeeSingleSelection,a as FixedCompanyFilter,s as NestedValueHelp,P as __namedExportsOrder,I as default};
