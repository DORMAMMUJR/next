import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 80;

// CONEXIÓN A SEENODE / POSTGRES
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// --- API ENDPOINTS ---

// 1. DASHBOARD COMPLETO
app.get('/api/dashboard', async (req, res) => {
  try {
    const [alumnos, docentes, pagos] = await Promise.all([
      pool.query('SELECT * FROM alumnos ORDER BY nombre_completo ASC'),
      pool.query('SELECT * FROM docentes'),
      pool.query('SELECT * FROM pagos')
    ]);
    res.json({
      alumnos: alumnos.rows,
      docentes: docentes.rows,
      pagos: pagos.rows,
      matriculas: [], expedientes: []
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error DB' });
  }
});

// 2. CREAR ALUMNO
app.post('/api/alumnos', async (req, res) => {
  const { id, nombre_completo, matricula, docente_id, grupo, generacion } = req.body;
  try {
    await pool.query(
      `INSERT INTO alumnos (id, nombre_completo, matricula, docente_id, grupo, generacion, financial_status, estatus) 
       VALUES ($1, $2, $3, $4, $5, $6, 'DEBT', 'Activo')`,
      [id, nombre_completo, matricula, docente_id, grupo, generacion]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creando alumno' });
  }
});

// 3. VERIFICAR PAGO / CAMBIAR ESTATUS
app.post('/api/pagos/verify', async (req, res) => {
  const { alumnoId, newStatus } = req.body;
  try {
    await pool.query('UPDATE alumnos SET financial_status = $1 WHERE id = $2', [newStatus, alumnoId]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error actualizando estatus' });
  }
});

// 4. GUARDAR CALIFICACIÓN
app.post('/api/alumnos/grade', async (req, res) => {
  const { alumnoId, grade } = req.body;
  try {
    await pool.query('UPDATE alumnos SET calificacion_parcial = $1 WHERE id = $2', [grade, alumnoId]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error calificando' });
  }
});

// FALLBACK
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 NEXT. Server Ready on port ${PORT}`);
});