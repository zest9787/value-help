import { useContext } from 'react';
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
