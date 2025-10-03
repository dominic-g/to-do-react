import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'; 
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext.tsx'; 

const rootElement = document.getElementById('root')!;

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);