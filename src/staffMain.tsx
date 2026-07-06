import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { SeasonProvider } from './context/SeasonContext';
import StaffPortal from './pages/StaffPortal';
import { initCloudSync } from './utils/cloudSync';

initCloudSync();

createRoot(document.getElementById('staff-root')!).render(
  <StrictMode>
    <SeasonProvider>
      <StaffPortal />
    </SeasonProvider>
  </StrictMode>
);
