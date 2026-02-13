import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg'; // Importamos el driver de DB
const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 80;

// CONEXIÓN A BASE DE DATOS
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Seenode llena esto solo
  ssl: { rejectUnauthorized: false }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// API: Obtener Alumnos Reales
app.get('/api/alumnos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alumnos');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error DB' });
  }
});

// SPA Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor CONECTADO en puerto ${PORT}`);
});