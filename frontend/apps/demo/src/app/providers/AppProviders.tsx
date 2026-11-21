import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';
import { ValueHelpProvider } from 'common-lib/value-help';
import { valueHelpDefinitions } from '../../entities/value-help/model/valueHelpDefinitions';
import type { PropsWithChildren } from 'react';

const queryClient = new QueryClient();

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={koKR}>
        <ValueHelpProvider definitions={valueHelpDefinitions}>{children}</ValueHelpProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
