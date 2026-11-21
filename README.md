# SAP Value Help 공통화 데모

Spring Boot API와 React 공통 모달을 목 데이터로 실행하는 예제입니다. SAP HCM / S/4HANA 인사 업무에서 활용할 수 있는 40종의 예제 Value Help를 제공합니다. 화면에서 검색 조건과 컬럼을 구성하며 중첩 검색과 종속 조건을 확인할 수 있습니다.

## 실행

Java 17 또는 21, Node.js 20.19+ 또는 22.12+, pnpm이 필요합니다. `JAVA_HOME`도 해당 JDK를 가리켜야 합니다. Gradle은 동봉된 Wrapper가 설치합니다. 터미널 두 개에서 각각 실행하세요.

```powershell
cd backend
.\gradlew.bat bootRun
```

```powershell
cd frontend
pnpm install
pnpm dev
```

브라우저에서 Vite가 표시하는 주소(기본 http://localhost:5173)를 엽니다. Vite가 `/api`를 localhost:8080으로 프록시합니다. 회사 1000에는 D101/D102, 회사 2000에는 D201이 있습니다. 사원 검색 모달에서 회사 선택 후 부서 검색으로 종속 조건을 확인하세요.

화면의 **HCM Value Help 목록**에서 항목을 선택해 각 검색창과 데이터를 확인할 수 있습니다. 예를 들어 `인사하위영역`에서 인사영역 `A100`을 선택하면 `S110`만 조회됩니다.

페이징을 확인하려면 기본 목 프로파일로 실행한 뒤 **사원** 또는 **인사영역** 검색창을 열어 보세요. 기본 페이지 크기는 10건입니다.

- 사원: 총 33건. 회사 `1000`으로 검색하면 22건으로 3페이지, 회사 `2000`은 11건으로 2페이지입니다. 부서·재직상태 필터도 적용할 수 있습니다.
- 인사영역: 총 26건. 회사 `1000` 또는 `2000`을 선택하면 각각 13건으로 2페이지입니다.

`sap` 프로파일에서는 사원만 실제 RAP를 사용하므로 사원 목 데이터 페이징은 기본 프로파일에서 확인하세요. 인사영역은 `sap` 프로파일에서도 목 데이터를 사용합니다.

제공 항목과 종속 검색 예시, 실제 SAP 연동 시 필요한 확인 사항은 [HCM Value Help 예제 목록](docs/hr-value-help-catalog.md)을 참고하세요.

프런트엔드 코드 검사는 `pnpm lint`, 자동 수정은 `pnpm lint:fix`로 실행합니다. 포맷 검사는 `pnpm format:check`, 포맷 적용은 `pnpm format`을 사용합니다.
프런트엔드 단위 테스트는 `pnpm test`로 실행합니다.

공통 Value Help Storybook은 별도 `common-storybook` 모듈로 구성되어 있습니다. 개발 서버는 `pnpm storybook`, 정적 배포 산출물은 `pnpm build:storybook`으로 생성합니다. 결과는 `frontend/packages/common-storybook/storybook-static`에 만들어집니다.

macOS/Linux에서는 `cd backend` 후 `./gradlew bootRun`으로 실행합니다. 첫 실행에는 Gradle과 의존성 다운로드를 위한 네트워크 연결이 필요합니다. 테스트는 `./gradlew test`(Windows PowerShell에서는 `.\gradlew.bat test`)로 실행합니다. 시작 클래스는 `com.example.valuehelp.ValueHelpApplication`입니다.

백엔드 소스는 `com.example.valuehelp` 아래에서 다음과 같이 나뉩니다.

- `ValueHelpApplication`: Spring Boot 시작 클래스
- `controller`, `service`: HTTP API와 조회 검증
- `repository`, `repository.mock`: 조회 인터페이스와 목 구현
- `dto`: API 요청·응답과 화면 메타데이터
- `registry`, `odata`: Value Help 정의와 OData 필터 생성

## API

- `GET /api/v1/value-helps/EMPLOYEE/metadata`: `id`, `keyField`, `textField`만 제공
- `POST /api/v1/value-helps/EMPLOYEE/search`: `{"filters":{"companyCode":"1000"},"page":0,"size":10,"sortField":"employeeName","sortDirection":"asc"}`
- `GET /api/v1/value-helps/EMPLOYEE/items/10001`

검색 필드와 정렬 필드는 Registry의 허용 목록으로 검증하며 페이지는 0부터 시작합니다. 응답은 `success`, `code`, `message`, `data`로 감쌉니다.

## 화면 설정과 options

공통 컴포넌트는 `frontend/packages/common-lib`에서 관리하며 `common-lib/value-help`로 배포합니다. 데모 앱과 업무별 설정은 `frontend/apps/demo`에 있습니다. 서버 메타데이터는 데이터 식별 필드만 제공합니다.

```tsx
import {
  hrValueHelpDefinitions,
  mergeValueHelpDefinitions,
  ValueHelpInput,
  ValueHelpProvider,
  type ValueHelpApi,
} from 'common-lib/value-help';

// API 구현은 각 앱의 URL, 인증, 인터셉터 정책에 맞게 작성한다.
const valueHelpApi: ValueHelpApi = {
  metadata: (id) => appHttp.get(`/value-helps/${id}/metadata`).then((r) => r.data.data),
  search: (id, filters, page, size, sortField, sortDirection) =>
    appHttp
      .post(`/value-helps/${id}/search`, {
        filters,
        page,
        size,
        sortField,
        sortDirection,
      })
      .then((r) => r.data.data),
  item: (id, key) =>
    appHttp.get(`/value-helps/${id}/items/${key}`).then((r) => r.data.data),
};

const definitions = mergeValueHelpDefinitions(hrValueHelpDefinitions, {
  // 공통 항목 재정의
  EMPLOYEE: {
    title: '평가 대상자 선택',
    modal: { gridHeight: 500 },
  },
  // common-lib에 없는 앱 전용 항목 추가
  PROJECT: {
    title: '프로젝트 검색',
    columns: [{ field: 'projectId', headerName: '프로젝트 코드' }],
  },
});

<ValueHelpProvider api={valueHelpApi} definitions={definitions}>
  <ValueHelpInput id="COMPANY" />
</ValueHelpProvider>;
```

각 화면은 `ValueHelpModal`의 `options`로 필요한 값만 변경할 수 있습니다.

```tsx
<ValueHelpModal
  id="EMPLOYEE"
  open={open}
  onClose={onClose}
  onSelect={handleSelect}
  options={{
    title: '평가 대상자 선택',
    selectionMode: 'multiple',
    pageSize: 20,
    modal: { size: 'XL', gridHeight: 400 },
    columns: [
      { field: 'employeeId', headerName: '사번', width: 120 },
      { field: 'employeeName', headerName: '성명', width: 180 },
    ],
  }}
/>
```

`title`, `selectionMode`, `pageSize`, `modal`, `searchFields`, `columns`를 지정할 수 있습니다. `modal`은 개별 속성 단위로 병합하고 `searchFields`와 `columns`는 배열 전체를 교체합니다. `searchFields: []`는 검색 폼을 숨깁니다. 페이지 크기는 1~200, 검색 폼 열 개수 `modal.searchColumns`는 1~4입니다. 검색 필드 타입은 `text`, `select`, `valueHelp`를 지원하며 중첩 Value Help에는 `dependsOn`, `valueHelpOptions`를 지정할 수 있습니다.

`ValueHelpInput`에도 `options`를 전달할 수 있으며 입력 필드는 단일 코드이므로 선택 모드는 항상 `single`입니다. 중첩 검색 필드도 단일 값을 반환합니다. 호출 화면에서 검색 또는 정렬 필드를 바꿀 때 해당 필드가 서버 Registry에 허용되어 있어야 합니다. `fixedFilters`는 화면 검색값보다 우선합니다.

### 값이 적을 때 Select로 사용

언어처럼 목록이 적으면 공통 모달 대신 `ValueHelpSelect`를 사용할 수 있습니다. 데모의 **사원 정보 → 언어 (Select)** 에서 `KO`, `EN` 목 데이터를 확인할 수 있습니다.

```tsx
import { ValueHelpSelect } from './ValueHelpSelect';

<Form.Item name="language" label="언어">
  <ValueHelpSelect valueHelpId="LANGUAGE" placeholder="언어를 선택하세요" />
</Form.Item>
```

`ValueHelpSelect`는 기존 메타데이터와 검색 API에서 코드·명칭을 가져오고, Form에는 코드 문자열을 저장합니다. 최대 200건까지 한 번에 조회하며, 초과하면 일부만 표시하지 않고 검색 모달을 사용하도록 안내합니다. 기존 선택값이 현재 목록에 없다면 단건 조회로 명칭 표시를 시도합니다. `filters`로 서버가 허용한 고정 조건을 전달할 수 있으며, 부모 조건 변경 시 기존 선택값 초기화는 해당 업무 화면에서 처리해야 합니다.

## 확장과 SAP 연결

서버 `Registry`에 엔티티, 코드·명칭 필드, 허용 필터와 정렬 필드를 등록하면 공통 UI와 API를 재사용할 수 있습니다. 새 ID의 화면 기본값은 프런트엔드에 등록하거나 호출할 때 `options`로 제공할 수 있습니다. 기본 프로파일은 메모리 목 저장소입니다.

`sap` 프로파일은 사원(`EMPLOYEE`)만 RAP OData V4로 조회하는 연결 샘플이며 나머지 항목은 목 데이터입니다. 실제 주소, 인증 및 필드 매핑을 설정하는 방법과 제한 사항은 [RAP 사원 연결 샘플](docs/rap-employee-sample.md)을 참고하세요. 실제 SAP 시스템은 제공되지 않아 가짜 RAP 응답으로 테스트했습니다.

선택은 현재 페이지 기준입니다. 코드 직접 입력은 단건 조회 결과로 명칭을 표시하지만 SAP 운영 환경에 맞는 유효성 검사는 업무 폼에 추가해야 합니다.
