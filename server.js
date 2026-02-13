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

// --- INICIALIZACIÓN DE TABLAS (SCHEMA) ---
// Esto asegura que las tablas existan al arrancar el servidor y evita errores 500
const initSchema = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS docentes (
        id TEXT PRIMARY KEY,
        nombre_completo TEXT,
        sede_slug TEXT,
        email TEXT,
        especialidad TEXT
      );
      
      CREATE TABLE IF NOT EXISTS alumnos (
        id TEXT PRIMARY KEY,
        nombre_completo TEXT,
        matricula TEXT,
        fecha_nacimiento TEXT,
        docente_id TEXT,
        grupo TEXT,
        generacion TEXT,
        financial_status TEXT DEFAULT 'CLEAN',
        estatus TEXT DEFAULT 'Activo',
        calificacion_parcial NUMERIC DEFAULT 0,
        telefono TEXT,
        email TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS pagos (
        id TEXT PRIMARY KEY,
        alumno_id TEXT,
        concepto TEXT,
        monto NUMERIC,
        fecha_pago TIMESTAMP DEFAULT NOW(),
        metodo TEXT,
        estatus TEXT,
        verified BOOLEAN DEFAULT FALSE,
        proof_url TEXT
      );

      CREATE TABLE IF NOT EXISTS matriculas (
        id TEXT PRIMARY KEY,
        alumno_id TEXT,
        matricula TEXT,
        fecha_inscripcion TIMESTAMP DEFAULT NOW(),
        programa TEXT,
        turno TEXT,
        modalidad TEXT
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        role TEXT,
        action TEXT,
        details TEXT,
        timestamp TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✅ Tablas de base de datos verificadas.");
  } catch (err) {
    console.error("❌ Error inicializando esquema de DB:", err);
  }
};

// Ejecutar inicialización
initSchema();

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

// API: Crear un nuevo Alumno (POST)
app.post('/api/alumnos', async (req, res) => {
  const { id, nombre_completo, matricula, fecha_nacimiento, docente_id, grupo, generacion } = req.body;
  try {
    await pool.query(
      `INSERT INTO alumnos (id, nombre_completo, matricula, fecha_nacimiento, docente_id, grupo, generacion, financial_status, estatus) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'CLEAN', 'Activo')`,
      [id, nombre_completo, matricula, fecha_nacimiento, docente_id, grupo, generacion]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar alumno. Verifique que la matrícula no esté duplicada.' });
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