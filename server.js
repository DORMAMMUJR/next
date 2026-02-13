import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- CORRECCIÓN CRÍTICA ---
// 1. Usamos el puerto que Seenode nos da en process.env.PORT
// 2. Si no hay, usamos el 80 (que es el default en Seenode)
const PORT = process.env.PORT || 80;

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// --- CORRECCIÓN CRÍTICA 2 ---
// Escuchar en '0.0.0.0' es OBLIGATORIO para Docker/Seenode
// Si solo pones app.listen(PORT), a veces se queda en localhost y falla
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor Next corriendo en puerto ${PORT}`);
});