import { useContext, useEffect } from 'react';
import type { ValueHelpOptions } from './config';
import { resolveValueHelpOptions } from './config';
import { ValueHelpContext } from './valueHelpContext';

export function useValueHelpApi() {
  const context = useContext(ValueHelpContext);
  if (!context) throw new Error('ValueHelpProvider가 필요합니다. 앱에서 api 구현을 전달하세요.');
  return context.api;
}

export function useValueHelpOptions(id: string, options?: ValueHelpOptions) {
  const context = useContext(ValueHelpContext);
  if (!context) throw new Error('ValueHelpProvider가 필요합니다. 앱에서 api 구현을 전달하세요.');
  const { definitions } = context;
  return resolveValueHelpOptions(id, options, definitions);
}

/** 같은 쿼리 실패를 공유하는 여러 입력 컴포넌트에서 중복 모달이 뜨지 않도록 한다. */
export function useValueHelpError(
  key: string,
  occurredAt: number,
  message: string,
  enabled = true,
) {
  const context = useContext(ValueHelpContext);
  if (!context) throw new Error('ValueHelpProvider가 필요합니다. 앱에서 api 구현을 전달하세요.');
  const { reportError } = context;
  useEffect(() => {
    if (enabled && occurredAt) reportError(`${key}:${occurredAt}`, message);
  }, [reportError, key, occurredAt, message, enabled]);
}
