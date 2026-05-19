import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { initGlobalErrorMonitor } from './lib/errorMonitor';
import { initOfflineSync } from './lib/offlineQueue';
import { registerOfflineReplay } from './lib/offlineReplay';
import './index.css';
import './registerSW';

initGlobalErrorMonitor();
registerOfflineReplay();
initOfflineSync();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
