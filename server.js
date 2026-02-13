import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg'; 

// Desestructuramos Pool de pkg (necesario para compatibilidad ES Modules con 'pg')
const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. Puerto dinámico para Seenode
const PORT = process.env.PORT || 80;

// --- CONFIGURACIÓN DE BASE DE DATOS ---
// Seenode inyecta automáticamente la DATABASE_URL si la configuraste en Environment Variables
// Nota: Si no hay DATABASE_URL (local sin .env), esto fallará al intentar conectar, 
// por lo que se recomienda tener un manejo de errores o .env local.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined // SSL solo si hay URL remota
});

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'dist')));

// --- API ROUTES ---

// Endpoint para obtener alumnos
app.get('/api/alumnos', async (req, res) => {
  try {
    // Si no hay configuración de DB, retornamos array vacío para no romper el front
    if (!process.env.DATABASE_URL) {
      console.warn("⚠️ No se ha configurado DATABASE_URL.");
      return res.json([]); 
    }

    const result = await pool.query('SELECT * FROM alumnos');
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error en DB:", err);
    res.status(500).json({ error: 'Error al conectar con la base de datos' });
  }
});

// --- SPA FALLBACK ---
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Binding a 0.0.0.0 requerido para Docker/Seenode
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor con PostgreSQL listo en puerto ${PORT}`);
});