
export enum Role {
  ALUMNO = 'Alumno',
  PROFESOR = 'Profesor',
  MAESTRO = 'Maestro',
  CONTROL_ESCOLAR = 'Control Escolar',
  DIRECCION = 'Dirección',
  FINANZAS = 'Finanzas'
}

export type AdminSection = 
  | 'dashboard' 
  | 'alumnos' 
  | 'expedientes' 
  | 'pagos' 
  | 'cobranza'
  | 'facturacion'
  | 'presupuestos'
  | 'materias' 
  | 'profesores' 
  | 'examenes' 
  | 'calificaciones' 
  | 'documentacion' 
  | 'reportes' 
  | 'alertas' 
  | 'auditoria'
  | 'configuracion_fin'
  | 'contenidos'
  | 'actividades'
  | 'mensajes'
  | 'agenda'
  | 'perfil'
  | 'mis_materias'
  | 'grupos'
  | 'sedes';

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar: string;
  enrollment?: string;
}

export interface Student extends User {
  group: string;
  academicStatus: 'Regular' | 'Baja' | 'Suspendido' | 'Egresado';
  paymentStatus: 'Al día' | 'Deudor' | 'Vencido';
  tutor: string;
  curp: string;
  gpa: number;
  phone?: string;
  email?: string;
}

export interface Subject {
  id: string;
  name: string;
  group: string;
  schedule: string;
  period: string;
  status: 'Activa' | 'Concluida' | 'Programada';
  enrolledStudents: number;
}

export interface Activity {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  dueDate: string;
  submissionsCount: number;
  totalStudents: number;
}

export interface GradeEntry {
  studentId: string;
  studentName: string;
  activityScore: number;
  examScore: number;
  finalAverage: number;
  observations: string;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  module: string;
  timestamp: string;
}

export interface OfficialDoc {
  id: string;
  studentId: string;
  studentName: string;
  type: 'Certificado' | 'Historial SEP' | 'RVOE' | 'Carta Académica';
  status: 'Completo' | 'En proceso' | 'Pendiente';
  requestDate: string;
}

export interface ProfessorKPIs {
  assignedSubjects: number;
  activeGroups: number;
  pendingActivities: number;
  scheduledExams: number;
  averageGPA: number;
  totalStudents: number;
}

export interface ContentItem {
  id: string;
  title: string;
  type: 'PDF' | 'Video' | 'Presentación';
  week: number;
  visible: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'Clase' | 'Examen' | 'Entrega' | 'Reunión';
}

export interface Sede {
  id: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
  activeStudents: number;
  status: 'Operativa' | 'Mantenimiento' | 'Próximamente';
  coordinates?: { lat: number; lng: number };
}
