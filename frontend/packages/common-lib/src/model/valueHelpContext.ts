import { createContext } from 'react';
import type { ValueHelpDefinitions } from './config';
import type { ValueHelpApi } from './valueHelpApi';

export type ValueHelpContextValue = {
  api: ValueHelpApi;
  definitions: ValueHelpDefinitions;
};

export const ValueHelpContext = createContext<ValueHelpContextValue | null>(null);
