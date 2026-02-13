import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 80;

// 1. CONEXIÓN A BASE DE DATOS (Seenode la inyecta automáticamente)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// 2. API: CARGAR TODO EL DASHBOARD (GET)
app.get('/api/dashboard', async (req, res) => {
  try {
    // Pedimos todo a la base de datos en paralelo
    const [alumnos, docentes, pagos, matriculas] = await Promise.all([
      pool.query('SELECT * FROM alumnos'),
      pool.query('SELECT * FROM docentes'),
      pool.query('SELECT * FROM pagos'),
      pool.query('SELECT * FROM matriculas')
    ]);

    // Enviamos el objeto CityData completo al frontend
    res.json({
      alumnos: alumnos.rows,
      docentes: docentes.rows,
      pagos: pagos.rows,
      matriculas: matriculas.rows,
      expedientes: [] // Por ahora vacío hasta que implementes subida de archivos
    });
  } catch (err) {
    console.error("Error cargando dashboard:", err);
    res.status(500).json({ error: 'Error de base de datos' });
  }
});

// 3. API: VALIDAR PAGO (POST)
app.post('/api/pagos/verify', async (req, res) => {
  const { pagoId, verified, alumnoId, newStatus } = req.body;
  try {
    // Actualizar el pago
    await pool.query('UPDATE pagos SET verified = $1 WHERE id = $2', [verified, pagoId]);
    // Actualizar el estatus del alumno (CLEAN/DEBT)
    await pool.query('UPDATE alumnos SET financial_status = $1 WHERE id = $2', [newStatus, alumnoId]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error actualizando pago' });
  }
});

// 4. API: GUARDAR CALIFICACIÓN (POST)
app.post('/api/alumnos/grade', async (req, res) => {
  const { alumnoId, grade } = req.body;
  try {
    await pool.query('UPDATE alumnos SET calificacion_parcial = $1 WHERE id = $2', [grade, alumnoId]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error guardando calificación' });
  }
});

// --- RUTAS DE AUDITORÍA ---

// 5. Obtener todos los logs de la base de datos
app.get('/api/logs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al cargar la bitácora' });
  }
});

// 6. Guardar un nuevo log (Inicio de sesión, pánico, etc.)
app.post('/api/logs', async (req, res) => {
  const { id, user_id, role, action, details } = req.body;
  try {
    await pool.query(
      'INSERT INTO audit_logs (id, user_id, role, action, details, timestamp) VALUES ($1, $2, $3, $4, $5, NOW())',
      [id, user_id, role, action, details]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar log' });
  }
});

// 7. SPA FALLBACK (Siempre al final)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor Conectado a DB en puerto ${PORT}`);
});