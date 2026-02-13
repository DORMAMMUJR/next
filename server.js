import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg'; 
const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Use 3001 as default dev port to avoid conflict with frontend (3000) or privileged ports (80)
const PORT = process.env.PORT || 3001;

// CONEXIÓN A LA BASE DE DATOS
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Only enable SSL if using a remote URL (indicated by presence of env var), 
  // prevents crashing on local non-SSL postgres
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// --- RUTAS DE LA API ---

app.get('/api/alumnos', async (req, res) => {
  // Graceful handling for missing DB config
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️ DATABASE_URL not set. Returning empty list for offline mode.');
    return res.json([]); 
  }

  try {
    const result = await pool.query('SELECT * FROM alumnos');
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Database Error:", err);
    // Return empty array on error to allow frontend fallback to seed data
    // instead of throwing 500 which triggers the error toast/log
    res.json([]);
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  if (!process.env.DATABASE_URL) console.log("   (Running in offline/no-db mode)");
});