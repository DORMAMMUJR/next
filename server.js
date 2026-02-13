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

// 5. LOGIN REAL CON BASE DE DATOS
app.post('/api/login', async (req, res) => {
  const { usuario, password, role } = req.body;

  try {
    if (role === 'PROFESOR') {
      // Bypass para Testing (Usuario 123 / Pass 1234)
      if (usuario === '123' && password === '1234') {
        return res.json({
          success: true,
          user: { id: 'doc-test', nombre_completo: 'Docente Pruebas', sede: 'aguascalientes', sede_slug: 'aguascalientes' }
        });
      }

      // Buscamos en la tabla de docentes
      const result = await pool.query(
        'SELECT * FROM docentes WHERE usuario = $1 AND password = $2',
        [usuario, password]
      );

      if (result.rows.length > 0) {
        res.json({ success: true, user: result.rows[0] });
      } else {
        res.status(401).json({ success: false, message: "Credenciales de docente inválidas" });
      }
    } else {
      // Lógica para el ADMIN (Dueña)
      if (usuario === 'admin' && password === 'admin') {
        res.json({ success: true, role: 'OWNER' });
      } else {
        res.status(401).json({ success: false, message: "Admin no reconocido" });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// FALLBACK
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 NEXT. Server Ready on port ${PORT}`);
});