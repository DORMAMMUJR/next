
export enum Role {
  ALUMNO = 'Alumno',
  PROFESOR = 'Profesor',
  CONTROL_ESCOLAR = 'Control Escolar',
  FINANZAS = 'Finanzas',
  DIRECCION = 'Dirección'
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
  | 'sedes';

export interface Alumno {
  id: string;
  nombre_completo: string;
  telefono: string;
  email: string;
  generacion: string;
  grupo: string;
  estatus: 'Activo' | 'Baja' | 'Pausa';
  created_at: string;
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
}

export interface City {
  name: string;
  slug: string;
}

export interface CityData {
  alumnos: Alumno[];
  matriculas: Matricula[];
  pagos: Pago[];
  expedientes: ExpedienteAlumno[];
}
