
export enum Role {
  OWNER = 'OWNER',      // Dueña / Admin (1234)
  PROFESOR = 'PROFESOR' // Docentes (DOC-XXX)
}

export type AdminSection = 'dashboard' | 'sedes' | 'materias' | 'auditoria';

export interface Docente {
  id: string;
  nombre_completo: string;
  sede_slug: string;
  email?: string;
  especialidad?: string;
}

export interface Alumno {
  id: string;
  nombre_completo: string;
  matricula: string;
  fecha_nacimiento?: string;
  financial_status: 'CLEAN' | 'DEBT';
  telefono?: string;
  email?: string;
  generacion?: string;
  grupo?: string;
  estatus: 'Activo' | 'Baja' | 'Pausa';
  created_at?: string;
  docente_id?: string;
  calificacion_parcial?: number | null;
}

export interface Pago {
  id: string;
  alumno_id: string;
  concepto: string;
  monto: number;
  fecha_pago: string;
  metodo: 'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Otro';
  estatus: 'Pagado' | 'Pendiente' | 'Vencido';
  verified: boolean;
  proof_url?: string;
}

export interface CityData {
  alumnos: Alumno[];
  docentes: Docente[];
  pagos: Pago[];
  matriculas: any[];
  expedientes: any[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user_id: string;
  role: string;
  action: string;
  details: string;
}

export interface City {
  name: string;
  slug: string;
}

// Define las secciones principales de la app
export type AppView = 'dashboard' | 'teachers' | 'settings';
