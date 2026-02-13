
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Servir archivos estáticos desde la carpeta 'dist' (generada por Vite)
app.use(express.static(path.join(__dirname, 'dist')));

// 2. SPA Fallback: Cualquier ruta no reconocida por el estático, devuelve index.html
// Esto permite que React Router maneje las rutas (ej: /login, /alumnos)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 3. Arrancar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor de producción corriendo en puerto ${PORT}`);
});
