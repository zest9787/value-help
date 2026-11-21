import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProviders } from './app/providers/AppProviders';
import { ValueHelpDemoPage } from './pages/value-help-demo/ui/ValueHelpDemoPage';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import './shared/styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <ValueHelpDemoPage />
    </AppProviders>
  </React.StrictMode>,
);
