import { useContext } from 'react';
import type { ValueHelpOptions } from './config';
import { resolveValueHelpOptions } from './config';
import { ValueHelpContext } from './valueHelpContext';

export function useValueHelpApi() {
  return useContext(ValueHelpContext).api;
}

export function useValueHelpOptions(id: string, options?: ValueHelpOptions) {
  const { definitions } = useContext(ValueHelpContext);
  return resolveValueHelpOptions(id, options, definitions);
}
