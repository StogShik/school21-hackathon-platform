import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Найдите элемент с id "root" в вашем index.html
const container = document.getElementById('root');
const root = createRoot(container);

// Рендерим приложение
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
