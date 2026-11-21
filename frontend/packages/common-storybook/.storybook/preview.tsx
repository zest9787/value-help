import type { Preview } from '@storybook/react-vite';
import { ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ValueHelpProvider } from 'common-lib/value-help';
import { mockApi, storyDefinitions } from '../src/value-help/mockValueHelp';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import './preview.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
    docs: { toc: true },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
      return (
        <QueryClientProvider client={queryClient}>
          <ConfigProvider locale={koKR}>
            <ValueHelpProvider api={mockApi} definitions={storyDefinitions}>
              <div className="story-shell">
                <Story />
              </div>
            </ValueHelpProvider>
          </ConfigProvider>
        </QueryClientProvider>
      );
    },
  ],
};

export default preview;
