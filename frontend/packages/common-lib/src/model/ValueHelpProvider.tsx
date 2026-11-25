import { useCallback, useRef, type PropsWithChildren } from 'react';
import { Modal } from 'antd';
import type { ValueHelpDefinitions } from './config';
import type { ValueHelpApi } from './valueHelpApi';
import { ValueHelpContext } from './valueHelpContext';

export type ValueHelpProviderProps = PropsWithChildren<{
  definitions?: ValueHelpDefinitions;
  api: ValueHelpApi;
}>;

export function ValueHelpProvider({ children, definitions = {}, api }: ValueHelpProviderProps) {
  const [modal, contextHolder] = Modal.useModal();
  const reported = useRef(new Set<string>());
  const reportError = useCallback(
    (key: string, message: string) => {
      if (reported.current.has(key)) return;
      // 여러 컴포넌트가 동일한 React Query 오류를 관찰해도 팝업은 한 번만 연다.
      if (reported.current.size >= 256) reported.current.clear();
      reported.current.add(key);
      modal.error({ title: 'Value Help 오류', content: message, okText: '확인' });
    },
    [modal],
  );
  return (
    <ValueHelpContext.Provider value={{ api, definitions, reportError }}>
      {contextHolder}
      {children}
    </ValueHelpContext.Provider>
  );
}
