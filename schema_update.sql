-- Opción A: Si puedes borrar todo y empezar de cero (RECOMENDADO)
DROP TABLE IF EXISTS alumnos;
DROP TABLE IF EXISTS docentes;
CREATE TABLE docentes (
    id TEXT PRIMARY KEY,
    nombre_completo TEXT NOT NULL,
    sede_slug TEXT NOT NULL
);
CREATE TABLE alumnos (
    id TEXT PRIMARY KEY,
    nombre_completo TEXT NOT NULL,
    matricula TEXT,
    fecha_nacimiento TEXT,
    docente_id TEXT REFERENCES docentes(id),
    -- Nueva columna vital
    grupo TEXT,
    generacion TEXT,
    financial_status TEXT DEFAULT 'DEBT',
    estatus TEXT DEFAULT 'Activo',
    calificacion_parcial NUMERIC DEFAULT 0
);
-- Insertar Docentes de Prueba (Para que el select funcione)
INSERT INTO docentes (id, nombre_completo, sede_slug)
VALUES (
        'DOC-001',
        'Prof. Roberto Gómez',
        'aguascalientes'
    ),
    (
        'DOC-002',
        'Lic. María Fernanda',
        'aguascalientes'
    );