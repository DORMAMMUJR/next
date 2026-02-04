
import React, { useState } from 'react';
import { Role, AdminSection, Student, Subject, Activity, GradeEntry, ProfessorKPIs, OfficialDoc, AuditLog, ContentItem, CalendarEvent, Sede } from './types';
import { STUDENT_MODULES, MOCK_STUDENTS, MOCK_AUDIT, MOCK_SUBJECTS, MOCK_ACTIVITIES, MOCK_GRADES, MOCK_CONTENTS, MOCK_AGENDA, PROFESSOR_KPIS, MOCK_DOCS, MOCK_SEDES, MEXICAN_STATES } from './constants';
import Layout from './components/Layout';
import AIAssistant from './components/AIAssistant';

const App: React.FC = () => {
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'materia' | 'calificaciones' | 'pagos' | 'admin' | 'sedes' | 'login'>('home');
  const [adminSection, setAdminSection] = useState<AdminSection>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loginTargetRole, setLoginTargetRole] = useState<Role | null>(null);

  const handleRoleSelect = (role: Role) => {
    // Si no hay sesión, requerir login para Alumnos y Profesores
    if ((role === Role.ALUMNO || role === Role.PROFESOR) && !activeRole) {
      setLoginTargetRole(role);
      setCurrentView('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setActiveRole(role);
    if (role === Role.CONTROL_ESCOLAR || role === Role.DIRECCION || role === Role.FINANZAS || role === Role.PROFESOR) {
      setCurrentView('admin');
      setAdminSection('dashboard');
    } else {
      setCurrentView('dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetToHome = () => {
    setActiveRole(null);
    setLoginTargetRole(null);
    setCurrentView('home');
    setSelectedStudent(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSedesClick = () => {
    setCurrentView('sedes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewExpediente = (student: Student) => {
    setSelectedStudent(student);
    setAdminSection('expedientes');
  };

  // --- COMPONENTES DE SOPORTE ---
  const StatusPill = ({ status }: { status: string }) => {
    const colors: any = {
      'Regular': 'bg-next-green/10 text-next-green',
      'Al día': 'bg-next-green/10 text-next-green',
      'Completo': 'bg-next-green/10 text-next-green',
      'Operativa': 'bg-next-green/10 text-next-green',
      'Vencido': 'bg-red-500/10 text-red-500',
      'Deudor': 'bg-orange-500/10 text-orange-500',
      'Pendiente': 'bg-orange-500/10 text-orange-500',
      'En proceso': 'bg-blue-500/10 text-blue-500',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${colors[status] || 'bg-zinc-100 text-zinc-400'}`}>
        {status}
      </span>
    );
  };

  // --- VISTA DE LOGIN UNIFICADA ---
  const LoginView = () => {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Credenciales universales solicitadas: victor / next
      if (user.toLowerCase() === 'victor' && pass === 'next') {
        const role = loginTargetRole || Role.ALUMNO;
        setActiveRole(role);
        
        if (role === Role.PROFESOR) {
          setCurrentView('admin');
          setAdminSection('dashboard');
        } else {
          setCurrentView('dashboard');
        }
        setError('');
      } else {
        setError('Usuario o contraseña incorrectos. (victor / next)');
      }
    };

    const roleName = loginTargetRole === Role.PROFESOR ? 'Profesores' : 'Alumnos';

    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
        <div className="w-full max-w-md bg-white border-2 border-zinc-50 p-12 rounded-[56px] shadow-2xl shadow-zinc-200/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-next-green/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black tracking-tighter text-next-black mb-2">Acceso {roleName}<span className="text-next-green">.</span></h2>
            <p className="text-zinc-400 font-bold uppercase text-[9px] tracking-[0.3em]">Introduce tus credenciales NEXT</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-300 ml-4">Usuario</label>
              <input 
                type="text" 
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="Ingresa tu usuario"
                className="w-full bg-zinc-50 border-none rounded-3xl px-8 py-5 text-sm font-bold focus:ring-2 focus:ring-next-green transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-300 ml-4">Contraseña</label>
              <input 
                type="password" 
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-50 border-none rounded-3xl px-8 py-5 text-sm font-bold focus:ring-2 focus:ring-next-green transition-all"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-[10px] font-bold uppercase text-center animate-pulse">{error}</p>
            )}

            <button 
              type="submit"
              className="w-full bg-next-black text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-next-green hover:shadow-xl hover:shadow-next-green/20 transition-all transform active:scale-95"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-8 text-center">
            <button onClick={resetToHome} className="text-zinc-300 hover:text-next-black text-[9px] font-black uppercase tracking-widest transition-colors">← Volver al inicio</button>
          </div>
        </div>
      </div>
    );
  };

  // --- VISTAS DE CONTROL ESCOLAR ---
  const ControlEscolarDashboard = () => (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header>
        <h2 className="text-5xl font-black tracking-tighter text-next-black">Control Escolar<span className="text-next-green">.</span></h2>
        <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-3 italic">Gestión de Matrícula y Procesos Académicos</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { label: 'Alumnos Activos', value: 452, icon: '👥' },
          { label: 'Pagos Pendientes', value: 28, icon: '💳', color: 'text-red-500' },
          { label: 'Promedio Gral.', value: 8.7, icon: '🎯' },
          { label: 'Materias Activas', value: 14, icon: '📖' },
          { label: 'Exámenes Prog.', value: 6, icon: '📝' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white border-2 border-zinc-50 p-8 rounded-[32px] hover:border-next-green transition-all shadow-sm">
            <div className="text-2xl mb-4">{kpi.icon}</div>
            <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest mb-1">{kpi.label}</p>
            <p className={`text-4xl font-black tracking-tighter ${kpi.color || 'text-next-black'}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-zinc-50 p-10 rounded-[48px]">
          <h3 className="text-xl font-black mb-10 italic">Inscripciones Recientes</h3>
          <div className="h-48 flex items-end gap-4">
            {[40, 65, 30, 85, 95, 75, 55].map((h, i) => (
              <div key={i} className="flex-1 bg-next-green/20 hover:bg-next-green rounded-t-xl transition-all relative group">
                <div className="absolute inset-x-0 bottom-0 bg-next-green rounded-t-xl" style={{ height: `${h}%` }}></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 text-[9px] font-black text-zinc-300 uppercase tracking-widest px-2">
            <span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span><span>May</span><span>Jun</span><span>Jul</span>
          </div>
        </div>
        <div className="bg-next-black text-white p-10 rounded-[48px] relative overflow-hidden flex flex-col justify-between">
           <div className="absolute top-0 right-0 w-32 h-32 bg-next-green rounded-full blur-[70px] opacity-20 -mr-16 -mt-16"></div>
           <div>
             <h3 className="text-xl font-black mb-4 italic">Estatus de Documentación</h3>
             <p className="text-zinc-500 text-sm mb-8 leading-relaxed">El 88% de los alumnos de nuevo ingreso han completado su expediente digital SEP.</p>
             <div className="text-5xl font-black text-next-green tracking-tighter">88%</div>
             <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] mt-2">Expedientes Completos</p>
           </div>
           <button onClick={() => setAdminSection('alumnos')} className="mt-10 py-4 bg-next-green text-next-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white transition-all">Ver Lista de Alumnos</button>
        </div>
      </div>
    </div>
  );

  const AlumnosView = () => (
    <div className="space-y-8 animate-in fade-in">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-next-black">Alumnos<span className="text-next-green">.</span></h2>
          <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-3">Base de Datos de Matrícula Activa</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Buscar por nombre o matrícula..." 
            className="w-full md:w-80 bg-zinc-50 border-none rounded-2xl px-6 py-4 text-xs font-bold focus:ring-2 focus:ring-next-green transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-next-green text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-next-black transition-all">+ Nuevo</button>
        </div>
      </header>
      <div className="bg-white border-2 border-zinc-50 rounded-[40px] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-zinc-50/50 text-[10px] font-black uppercase tracking-widest text-zinc-300">
            <tr><th className="px-10 py-8">Alumno / Matrícula</th><th className="px-6 py-8">Grupo</th><th className="px-6 py-8">Estatus</th><th className="px-10 py-8 text-right">Acciones</th></tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {MOCK_STUDENTS.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(s => (
              <tr key={s.id} className="hover:bg-zinc-50/30 transition-colors group">
                <td className="px-10 py-8">
                  <div className="flex items-center gap-4">
                    <img src={s.avatar} className="w-10 h-10 rounded-xl bg-zinc-100" />
                    <div>
                      <p className="font-black text-lg tracking-tight">{s.name}</p>
                      <p className="text-[10px] text-zinc-400 font-bold">{s.enrollment}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-8 font-bold text-zinc-600">{s.group}</td>
                <td className="px-6 py-8"><StatusPill status={s.academicStatus} /></td>
                <td className="px-10 py-8 text-right">
                  <button onClick={() => handleViewExpediente(s)} className="text-next-green font-black text-[10px] uppercase hover:underline">Ver Expediente</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ExpedienteView = () => {
    const s = selectedStudent || MOCK_STUDENTS[0];
    return (
      <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
        <header className="flex justify-between items-end">
          <div className="flex items-center gap-8">
            <img src={s.avatar} className="w-32 h-32 rounded-[32px] bg-zinc-100 shadow-xl" />
            <div>
              <h2 className="text-5xl font-black tracking-tighter text-next-black">{s.name}<span className="text-next-green">.</span></h2>
              <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-3">{s.enrollment} • Grupo {s.group}</p>
              <div className="mt-4 flex gap-3">
                 <StatusPill status={s.academicStatus} />
                 <StatusPill status={s.paymentStatus} />
              </div>
            </div>
          </div>
          <button onClick={() => setAdminSection('alumnos')} className="bg-zinc-100 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all">← Volver</button>
        </header>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white border-2 border-zinc-50 p-10 rounded-[48px] shadow-sm">
             <h3 className="text-xl font-black mb-8 italic">Información General</h3>
             <div className="space-y-6">
                <div className="flex justify-between border-b border-zinc-50 pb-2"><span className="text-[10px] font-black uppercase text-zinc-300">CURP</span><span className="font-bold">{s.curp}</span></div>
                <div className="flex justify-between border-b border-zinc-50 pb-2"><span className="text-[10px] font-black uppercase text-zinc-300">Email</span><span className="font-bold text-next-green">{s.email}</span></div>
                <div className="flex justify-between border-b border-zinc-50 pb-2"><span className="text-[10px] font-black uppercase text-zinc-300">Tutor</span><span className="font-bold">{s.tutor}</span></div>
                <div className="flex justify-between border-b border-zinc-50 pb-2"><span className="text-[10px] font-black uppercase text-zinc-300">Promedio</span><span className="font-black text-xl">{s.gpa}</span></div>
             </div>
          </div>
          <div className="bg-next-black text-white p-10 rounded-[48px]">
             <h3 className="text-xl font-black mb-6 italic text-next-green">Expediente SEP</h3>
             <div className="space-y-3">
               {['Certificado_Secundaria.pdf', 'Acta_Nacimiento.pdf', 'CURP_Validado.pdf'].map((doc, i) => (
                 <div key={i} className="flex justify-between items-center p-4 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-next-green transition-all">
                   <span className="text-xs font-bold text-zinc-400">{doc}</span>
                   <button className="text-next-green text-xs font-black">Descargar</button>
                 </div>
               ))}
               <button className="w-full mt-6 py-4 border-2 border-dashed border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:border-next-green hover:text-next-green transition-all">Cargar Nuevo PDF</button>
             </div>
          </div>
        </div>
      </div>
    );
  };

  const AuditoriaView = () => (
    <div className="space-y-12 animate-in fade-in">
      <header>
        <h2 className="text-5xl font-black tracking-tighter text-next-black">Auditoría<span className="text-next-green">.</span></h2>
        <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-3">Historial Inalterable de Acciones</p>
      </header>
      <div className="bg-white border-2 border-zinc-50 rounded-[40px] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-zinc-50/50 text-[10px] font-black uppercase tracking-widest text-zinc-300">
            <tr><th className="px-10 py-8">Usuario</th><th className="px-6 py-8">Módulo</th><th className="px-6 py-8">Acción</th><th className="px-10 py-8 text-right">Fecha / Hora</th></tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {MOCK_AUDIT.map(log => (
              <tr key={log.id} className="hover:bg-zinc-50/30 transition-colors">
                <td className="px-10 py-8 font-black text-next-green">{log.user}</td>
                <td className="px-6 py-8 font-black uppercase text-[10px] text-zinc-400">{log.module}</td>
                <td className="px-6 py-8 font-bold text-sm">{log.action}</td>
                <td className="px-10 py-8 text-right text-[10px] font-medium text-zinc-400">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // --- VISTA DE SEDES ---
  const SedesView = () => (
    <div className="space-y-12 animate-in fade-in duration-500 max-w-6xl mx-auto py-12">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-zinc-100 pb-12">
        <div>
          <span className="bg-next-green/10 text-next-green px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 inline-block">Presencia Nacional</span>
          <h2 className="text-6xl font-black tracking-tighter text-next-black">Nuestras Sedes<span className="text-next-green">.</span></h2>
          <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-4 italic">Encuentra tu centro NEXT más cercano</p>
        </div>
        {activeRole === Role.CONTROL_ESCOLAR && (
          <button className="bg-next-black text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-next-green transition-all shadow-xl shadow-zinc-200">+ Nueva Sede</button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {MOCK_SEDES.map((sede) => (
          <div key={sede.id} className="bg-white border-2 border-zinc-50 p-10 rounded-[48px] hover:border-next-green transition-all shadow-sm group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-50 rounded-full blur-3xl group-hover:bg-next-green/10 transition-colors"></div>
            <div className="flex justify-between items-start mb-10 relative z-10">
              <div className="w-16 h-16 bg-zinc-50 rounded-3xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">📍</div>
              <StatusPill status={sede.status} />
            </div>
            <h3 className="text-3xl font-black tracking-tighter mb-2 relative z-10">{sede.name}</h3>
            <p className="text-zinc-400 text-sm font-medium mb-10 max-w-xs relative z-10 leading-relaxed">{sede.address}</p>
            <div className="grid grid-cols-2 gap-8 border-t border-zinc-50 pt-10 relative z-10">
              <div>
                <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest mb-2">Director</p>
                <p className="font-bold text-next-black text-sm">{sede.manager}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest mb-2">Matrícula</p>
                <p className="font-black text-xl text-next-green">{sede.activeStudents.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 space-y-8 p-12 bg-zinc-50 rounded-[56px]">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-black tracking-tighter">Cobertura en toda la República Mexicana<span className="text-next-green">.</span></h3>
          <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-4 italic">Alumnos en los 32 estados de México</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-6 gap-x-4">
          {MEXICAN_STATES.map((estado, idx) => (
            <div 
              key={idx} 
              className="text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-next-green cursor-default transition-colors duration-300 text-center"
            >
              {estado}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // --- VISTAS DE PROFESOR ---
  const ProfessorDashboard = () => (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header>
        <h2 className="text-5xl font-black tracking-tighter text-next-black">Panel Docente<span className="text-next-green">.</span></h2>
        <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-3 italic">Gestión de Aprendizaje y Seguimiento</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Materias', value: PROFESSOR_KPIS.assignedSubjects, icon: '📖' },
          { label: 'Grupos', value: PROFESSOR_KPIS.activeGroups, icon: '👥' },
          { label: 'Pendientes', value: PROFESSOR_KPIS.pendingActivities, icon: '✍️', color: 'text-orange-500' },
          { label: 'Exámenes', value: PROFESSOR_KPIS.scheduledExams, icon: '📝' },
          { label: 'Promedio Gral.', value: PROFESSOR_KPIS.averageGPA, icon: '🎯' },
          { label: 'Alumnos', value: PROFESSOR_KPIS.totalStudents, icon: '🎓' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white border-2 border-zinc-50 p-6 rounded-[32px] hover:border-next-green transition-all shadow-sm">
            <div className="text-xl mb-3">{kpi.icon}</div>
            <p className="text-[8px] font-black text-zinc-300 uppercase tracking-widest mb-1">{kpi.label}</p>
            <p className={`text-3xl font-black tracking-tighter ${kpi.color || 'text-next-black'}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-zinc-50 p-10 rounded-[48px]">
          <h3 className="text-xl font-black mb-10 italic">Avance Académico por Grupo</h3>
          <div className="space-y-6">
            {['601-A', '402-B', '201-C'].map((grupo, i) => (
              <div key={i}>
                <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                  <span>Grupo {grupo}</span>
                  <span className="text-next-green">{85 - i * 15}%</span>
                </div>
                <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                  <div className="h-full bg-next-green transition-all duration-1000" style={{ width: `${85 - i * 15}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-next-black text-white p-10 rounded-[48px] relative overflow-hidden flex flex-col justify-between">
           <div className="absolute top-0 right-0 w-32 h-32 bg-next-green rounded-full blur-[70px] opacity-20 -mr-16 -mt-16"></div>
           <div>
             <h3 className="text-xl font-black mb-4 italic">Participación Estudiantil</h3>
             <p className="text-zinc-500 text-sm mb-8 leading-relaxed">El índice de entrega de actividades ha subido un 12% este parcial.</p>
             <div className="text-5xl font-black text-next-green tracking-tighter">94%</div>
             <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] mt-2">Cumplimiento Global</p>
           </div>
           <button onClick={() => setAdminSection('actividades')} className="mt-10 py-4 bg-next-green text-next-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white transition-all">Revisar Actividades</button>
        </div>
      </div>
    </div>
  );

  // --- MANEJO DE VISTAS PRINCIPALES ---
  const AdminView = () => {
    if (activeRole === Role.PROFESOR) {
      switch(adminSection) {
        case 'dashboard': return <ProfessorDashboard />;
        case 'mis_materias': return <div className="text-center py-20 font-black italic text-zinc-100 text-6xl">Mis Materias.</div>;
        case 'contenidos': return <div className="text-center py-20 font-black italic text-zinc-100 text-6xl">Contenidos.</div>;
        default: return <div className="text-center py-20 text-zinc-300 font-black italic">Módulo {adminSection.toUpperCase()} en desarrollo...</div>;
      }
    }

    if (activeRole === Role.CONTROL_ESCOLAR) {
      switch(adminSection) {
        case 'dashboard': return <ControlEscolarDashboard />;
        case 'alumnos': return <AlumnosView />;
        case 'expedientes': return <ExpedienteView />;
        case 'auditoria': return <AuditoriaView />;
        case 'sedes': return <SedesView />;
        case 'documentacion': return <div className="text-center py-20 font-black italic text-zinc-100 text-6xl">Documentos SEP.</div>;
        default: return <div className="text-center py-20 text-zinc-300 font-black italic">Modulo {adminSection.toUpperCase()} en desarrollo...</div>;
      }
    }

    return <div className="text-center py-20 text-zinc-300 font-black italic">Modulo {adminSection.toUpperCase()} en desarrollo...</div>;
  };

  const HomeView = () => (
    <div className="animate-in fade-in duration-700">
      {/* SECCIÓN HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white px-6">
        <div className="absolute top-0 left-0 w-full h-full">
           <div className="absolute top-20 right-[-10%] w-[60%] h-[80%] bg-zinc-50 rounded-l-[100px] -z-10 hidden lg:block"></div>
        </div>
        
        <div className="max-w-[1400px] w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8 text-center lg:text-left">
            <span className="bg-next-green/10 text-next-green px-4 py-2 rounded-full text-[12px] font-black uppercase tracking-[0.2em] border border-next-green/20">
              Excelencia Académica Digital
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-[100px] font-black tracking-tighter leading-[0.9] text-next-black">
              NEXT <br /> 
              <span className="text-next-green italic">Bachillerato</span> <br />
              Ejecutivo<span className="text-next-green">.</span>
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-zinc-400 tracking-tight italic">
              Preparándote para el futuro
            </h2>
            <p className="text-zinc-500 text-lg md:text-xl font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              Concluye tu bachillerato con modalidad ejecutiva, acompañamiento académico y una plataforma digital completa para estudiar desde cualquier lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <button onClick={() => handleRoleSelect(Role.ALUMNO)} className="bg-next-green text-white px-10 py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-next-green/30 hover:-translate-y-1 transition-all">Inscríbete hoy</button>
              <button className="bg-next-black text-white px-10 py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:-translate-y-1 transition-all">Solicita información</button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" className="rounded-[40px] w-full h-64 object-cover shadow-2xl" alt="Estudiantes" />
                <img src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=800" className="rounded-[40px] w-full h-80 object-cover shadow-2xl" alt="Aulas" />
              </div>
              <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800" className="rounded-[40px] w-full h-80 object-cover shadow-2xl" alt="Plataforma" />
                <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800" className="rounded-[40px] w-full h-64 object-cover shadow-2xl" alt="Profesor" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN BENEFICIOS */}
      <section className="py-24 bg-zinc-50 rounded-[100px] mx-6">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
             <h2 className="text-5xl md:text-7xl font-black tracking-tighter">¿Por qué elegir NEXT?<span className="text-next-green">.</span></h2>
             <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.4em]">Innovación constante en tu educación</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Plataforma completa', icon: '🖥️', img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800' },
              { title: 'Profesores certificados', icon: '👨‍🏫', img: 'https://images.unsplash.com/photo-1544717297-fa154ddad021?auto=format&fit=crop&q=80&w=800' },
              { title: 'Control total', icon: '📊', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800' },
              { title: 'Estudia a tu ritmo', icon: '⚡', img: 'https://images.unsplash.com/photo-148441785559c-44973896cf4b?auto=format&fit=crop&q=80&w=800' }
            ].map((benefit, i) => (
              <div key={i} className="bg-white p-8 rounded-[48px] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
                <div className="relative h-48 mb-8 overflow-hidden rounded-[32px]">
                   <img src={benefit.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={benefit.title} />
                </div>
                <div className="text-3xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-black mb-3 italic">{benefit.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-zinc-100 pt-24 pb-12 px-6">
         <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <h3 className="text-3xl font-black italic tracking-tighter">NEXT<span className="text-next-green">.</span></h3>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300 mb-4">Contacto</p>
               <p className="text-sm font-bold text-zinc-600">contacto@next.edu.mx</p>
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300 mb-4">Legal</p>
               <p className="text-sm font-bold text-zinc-600">Aviso de Privacidad</p>
            </div>
            <div className="flex gap-4">
               {['FB', 'IG', 'LI'].map(s => (
                 <div key={s} className="w-10 h-10 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center justify-center text-[10px] font-black">{s}</div>
               ))}
            </div>
         </div>
      </footer>
    </div>
  );

  return (
    <Layout 
      activeRole={activeRole} 
      onRoleSelect={handleRoleSelect} 
      onHome={resetToHome}
      onLogout={resetToHome}
      onSedes={handleSedesClick}
      currentAdminSection={adminSection}
      onAdminSectionChange={setAdminSection}
    >
      {currentView === 'home' && <HomeView />}
      {currentView === 'login' && <LoginView />}
      {currentView === 'sedes' && <SedesView />}
      {currentView === 'dashboard' && (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
           <div className="w-32 h-32 bg-next-green/10 rounded-full flex items-center justify-center text-5xl">✨</div>
           <div className="text-center">
             <h2 className="text-6xl font-black tracking-tighter">¡Bienvenido, Victor!<span className="text-next-green">.</span></h2>
             <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.4em] mt-4">Panel del Alumno Activo</p>
           </div>
           <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl mt-12">
             {STUDENT_MODULES.map(m => (
               <div key={m.id} className="bg-white border-2 border-zinc-50 p-10 rounded-[48px] hover:border-next-green transition-all shadow-sm cursor-pointer group">
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{m.icon}</div>
                  <h3 className="text-xl font-black italic mb-2">{m.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{m.description}</p>
               </div>
             ))}
           </div>
        </div>
      )}
      {currentView === 'admin' && <AdminView />}
      <AIAssistant />
    </Layout>
  );
};

export default App;
