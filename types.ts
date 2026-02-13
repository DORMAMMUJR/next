
export enum Role {
  ALUMNO = 'Alumno',
  PROFESOR = 'Profesor',
  CONTROL_ESCOLAR = 'Control Escolar',
  FINANZAS = 'Finanzas',
  DIRECCION = 'Dirección',
  OWNER = 'Dueña' // Nuevo rol de alto nivel
}

export type AdminSection = 
  | 'dashboard' 
  | 'alumnos' 
  | 'documentacion' 
  | 'facturacion' 
  | 'mensajes' 
  | 'auditoria' 
  | 'materias' 
  | 'reportes' 
  | 'expedientes' 
  | 'sedes'
  | 'becas'; 

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user_id: string;
  role: Role;
  action: 'LOGIN_SUCCESS' | 'PANIC_BUTTON' | 'UNAUTHORIZED_ACCESS';
  details?: string;
}

export interface Docente {
  id: string;
  nombre_completo: string;
  sede_slug: string;
  email: string;
  especialidad?: string;
}

export interface Alumno {
  id: string;
  nombre_completo: string;
  matricula?: string; 
  fecha_nacimiento?: string; 
  financial_status?: 'CLEAN' | 'DEBT'; 
  telefono: string;
  email: string;
  generacion: string;
  grupo: string;
  estatus: 'Activo' | 'Baja' | 'Pausa';
  created_at: string;
  // Relación de datos
  docente_id?: string; // ID del Docente asignado (Foreign Key)
  last_homework_date?: string; 
  calificacion_parcial?: number | null; 
  asistencias?: number;
  total_clases?: number;
}

export interface DocumentoPDF {
  file_name: string;
  mime_type: string;
  size_bytes: number;
  uploaded_at: string;
  base64_data: string;
}

export interface ExpedienteAlumno {
  alumno_id: string;
  docs: {
    acta_nacimiento?: DocumentoPDF;
    identificacion?: DocumentoPDF;
    curp?: DocumentoPDF;
    certificacion?: DocumentoPDF;
  };
  updated_at: string;
}

export interface Matricula {
  id: string;
  alumno_id: string;
  matricula: string;
  fecha_inscripcion: string;
  programa: string;
  turno: string;
  modalidad: 'Presencial' | 'En línea' | 'Mixta';
  expediente_folio: string;
}

export interface Pago {
  id: string;
  alumno_id: string;
  concepto: 'Inscripción' | 'Mensualidad' | 'Examen' | 'Otro';
  monto: number;
  fecha_pago: string;
  metodo: 'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Otro';
  estatus: 'Pagado' | 'Pendiente' | 'Vencido';
  notas?: string;
  // Auditoría Dueña
  proof_url?: string; // URL o Base64 del comprobante
  verified?: boolean; // Check de la dueña ("Dinero en banco")
}

export interface City {
  name: string;
  slug: string;
}

export interface CityData {
  docentes: Docente[]; // Lista maestra de docentes en esta sede
  alumnos: Alumno[];
  matriculas: Matricula[];
  pagos: Pago[];
  expedientes: ExpedienteAlumno[];
}
