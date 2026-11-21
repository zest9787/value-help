import type { PropsWithChildren } from 'react';
import type { ValueHelpDefinitions } from './config';
import type { ValueHelpApi } from './valueHelpApi';
import { ValueHelpContext } from './valueHelpContext';

export type ValueHelpProviderProps = PropsWithChildren<{
  definitions?: ValueHelpDefinitions;
  api: ValueHelpApi;
}>;

export function ValueHelpProvider({ children, definitions = {}, api }: ValueHelpProviderProps) {
  return (
    <ValueHelpContext.Provider value={{ api, definitions }}>{children}</ValueHelpContext.Provider>
  );
}
