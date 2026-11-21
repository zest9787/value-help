import type { PropsWithChildren } from 'react';
import type { ValueHelpApi } from '../api/value-help/client';
import type { ValueHelpDefinitions } from './config';
import { defaultValueHelpApi, ValueHelpContext } from './valueHelpContext';

export type ValueHelpProviderProps = PropsWithChildren<{
  definitions?: ValueHelpDefinitions;
  api?: ValueHelpApi;
}>;

export function ValueHelpProvider({
  children,
  definitions = {},
  api = defaultValueHelpApi,
}: ValueHelpProviderProps) {
  return (
    <ValueHelpContext.Provider value={{ api, definitions }}>{children}</ValueHelpContext.Provider>
  );
}
