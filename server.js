import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración de __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Seenode (y otros hostings) inyectan el puerto en process.env.PORT
const PORT = process.env.PORT || 3000;

// 1. Servir los archivos estáticos generados por Vite (carpeta dist)
app.use(express.static(path.join(__dirname, 'dist')));

// 2. Manejo de SPA (Single Page Application)
// Cualquier petición que no coincida con un archivo estático (JS, CSS, Imágenes)
// se redirige al index.html para que React Router maneje la ruta en el cliente.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de producción Next corriendo en puerto ${PORT}`);
});