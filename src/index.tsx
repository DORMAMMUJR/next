
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const mountApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("No se encontró el elemento root");
    return;
  }

  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Error crítico durante el renderizado:", error);
    rootElement.innerHTML = `
      <div style="padding: 40px; text-align: center; font-family: sans-serif;">
        <h1 style="color: #22c55e;">Error de Inicialización</h1>
        <p>Hubo un problema al cargar la plataforma NEXT.</p>
        <button onclick="location.reload()" style="background: #000; color: #fff; padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer;">
          Reintentar
        </button>
      </div>
    `;
  }
};

// Asegurar que el DOM esté listo antes de montar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
