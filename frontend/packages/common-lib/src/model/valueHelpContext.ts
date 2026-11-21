import { createContext } from 'react';
import { createValueHelpApi, type ValueHelpApi } from '../api/value-help/client';
import type { ValueHelpDefinitions } from './config';

export type ValueHelpContextValue = {
  api: ValueHelpApi;
  definitions: ValueHelpDefinitions;
};

export const defaultValueHelpApi = createValueHelpApi();

export const ValueHelpContext = createContext<ValueHelpContextValue>({
  api: defaultValueHelpApi,
  definitions: {},
});
