import '@fontsource-variable/manrope';
import '@fontsource-variable/noto-serif-sc';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './views/App';
import './styles/tokens.css';
import './styles/app.css';
import './styles/desktop.css';

const root = document.getElementById('root');
if (!root) throw new Error('The application root is missing.');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
