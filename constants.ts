
import { Role, Student, AuditLog, Subject, Activity, GradeEntry, ProfessorKPIs, OfficialDoc, ContentItem, CalendarEvent, Sede } from './types';

export const MOCK_STUDENTS: Student[] = [
  { 
    id: 's1', 
    name: 'Diego García', 
    role: Role.ALUMNO, 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diego',
    enrollment: 'NX-2024-001',
    group: '601-A',
    academicStatus: 'Regular',
    paymentStatus: 'Al día',
    tutor: 'Mariana López',
    curp: 'GARD950101HDFLRS01',
    gpa: 9.4,
    phone: '55 1234 5678',
    email: 'diego.garcia@next.edu.mx'
  },
  { 
    id: 's2', 
    name: 'Sofía Martínez', 
    role: Role.ALUMNO, 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia',
    enrollment: 'NX-2024-002',
    group: '601-A',
    academicStatus: 'Regular',
    paymentStatus: 'Vencido',
    tutor: 'Roberto Martínez',
    curp: 'MARS960202MDFLRS02',
    gpa: 8.8,
    phone: '55 8765 4321',
    email: 'sofia.mtz@next.edu.mx'
  }
];

export const MOCK_SUBJECTS: Subject[] = [
  { id: 'sub1', name: 'Física II', group: '601-A', schedule: 'Lun-Mie 08:00 - 10:00', period: '2024-B', status: 'Activa', enrolledStudents: 32 },
  { id: 'sub2', name: 'Cálculo Diferencial', group: '601-A', schedule: 'Mar-Jue 10:00 - 12:00', period: '2024-B', status: 'Activa', enrolledStudents: 28 },
  { id: 'sub3', name: 'Historia de México', group: '402-B', schedule: 'Vie 08:00 - 12:00', period: '2024-B', status: 'Activa', enrolledStudents: 45 }
];

export const MOCK_ACTIVITIES: Activity[] = [
  { id: 'act1', subjectId: 'sub1', title: 'Leyes de Newton', description: 'Mapa mental y resolución de problemas.', dueDate: '2024-06-05', submissionsCount: 22, totalStudents: 32 },
  { id: 'act2', subjectId: 'sub1', title: 'Práctica de Laboratorio', description: 'Reporte de fricción estática.', dueDate: '2024-06-12', submissionsCount: 0, totalStudents: 32 }
];

export const MOCK_GRADES: GradeEntry[] = [
  { studentId: 's1', studentName: 'Diego García', activityScore: 9.5, examScore: 9.0, finalAverage: 9.2, observations: 'Excelente desempeño.' },
  { studentId: 's2', studentName: 'Sofía Martínez', activityScore: 8.0, examScore: 8.5, finalAverage: 8.3, observations: 'Buen trabajo, requiere reforzar teoría.' }
];

export const MOCK_CONTENTS: ContentItem[] = [
  { id: 'c1', title: 'Guía de Estudio - Semana 1', type: 'PDF', week: 1, visible: true },
  { id: 'c2', title: 'Introducción a la Termodinámica', type: 'Video', week: 2, visible: true },
  { id: 'c3', title: 'Presentación de Clase 3', type: 'Presentación', week: 3, visible: false },
];

export const MOCK_AGENDA: CalendarEvent[] = [
  { id: 'e1', title: 'Clase Física II - 601A', date: '2024-05-27', type: 'Clase' },
  { id: 'e2', title: 'Entrega Tarea 1', date: '2024-05-28', type: 'Entrega' },
  { id: 'e3', title: 'Examen Parcial 1', date: '2024-05-30', type: 'Examen' },
];

export const PROFESSOR_KPIS: ProfessorKPIs = {
  assignedSubjects: 3,
  activeGroups: 2,
  pendingActivities: 5,
  scheduledExams: 2,
  averageGPA: 8.4,
  totalStudents: 105
};

export const MOCK_AUDIT: AuditLog[] = [
  { id: 'a1', user: 'Prof. Ricardo V.', action: 'Publicación de Tarea', module: 'Actividades', timestamp: '2024-05-24 10:15' },
  { id: 'a2', user: 'Prof. Ricardo V.', action: 'Calificación de Examen', module: 'Calificaciones', timestamp: '2024-05-24 11:30' }
];

export const MOCK_DOCS: OfficialDoc[] = [
  { id: 'd1', studentId: 's1', studentName: 'Diego García', type: 'Certificado', status: 'Completo', requestDate: '2024-05-20' },
  { id: 'd2', studentId: 's2', studentName: 'Sofía Martínez', type: 'Historial SEP', status: 'En proceso', requestDate: '2024-05-22' }
];

export const STUDENT_MODULES = [
  { id: 'materia', title: 'Materias y Cursos', icon: '📖', description: 'Acceso a contenidos, tareas y recursos didácticos de tus materias activas.' },
  { id: 'calificaciones', title: 'Calificaciones', icon: '🎯', description: 'Consulta de promedios, historiales académicos y boletas oficiales.' },
  { id: 'pagos', title: 'Pagos y Finanzas', icon: '💳', description: 'Estado de cuenta, recibos de pago y fechas de vencimiento de colegiaturas.' },
];

export const MOCK_SEDES: Sede[] = [
  { 
    id: 'sede1', 
    name: 'Campus Central CDMX', 
    address: 'Av. Insurgentes Sur 1234, Ciudad de México', 
    phone: '55 9000 1122', 
    manager: 'Dra. Elena Ramos',
    activeStudents: 2450,
    status: 'Operativa'
  },
  { 
    id: 'sede2', 
    name: 'Sede Poniente Guadalajara', 
    address: 'Av. Vallarta 500, Guadalajara, Jalisco', 
    phone: '33 4000 5566', 
    manager: 'Ing. Carlos Ortiz',
    activeStudents: 1200,
    status: 'Operativa'
  },
  { 
    id: 'sede3', 
    name: 'Nodo Industrial Monterrey', 
    address: 'San Pedro Garza García, Monterrey', 
    phone: '81 3000 7788', 
    manager: 'Lic. Martha Ruiz',
    activeStudents: 850,
    status: 'Operativa'
  },
  { 
    id: 'sede4', 
    name: 'Campus Virtual Global', 
    address: 'Acceso Digital 24/7', 
    phone: '800 NEXT EDU', 
    manager: 'Mtro. Ricardo Valdivia',
    activeStudents: 5000,
    status: 'Operativa'
  }
];

export const MEXICAN_STATES = [
  "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua", "Ciudad de México", "Coahuila", "Colima", "Durango", "Estado de México", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
];
