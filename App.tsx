
import React, { useState, useEffect } from 'react';
import { Role, AdminSection, Student } from './types';
import { STUDENT_MODULES, MOCK_STUDENTS, MOCK_AUDIT, PROFESSOR_KPIS, MOCK_SEDES, MEXICAN_STATES } from './constants';
import Layout from './components/Layout';
import AIAssistant from './components/AIAssistant';

const App: React.FC = () => {
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'admin' | 'sedes' | 'login'>('home');
  const [adminSection, setAdminSection] = useState<AdminSection>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loginTargetRole, setLoginTargetRole] = useState<Role | null>(null);

  // Asegurar que el scroll esté arriba al cambiar de vista
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView, adminSection]);

  const handleRoleSelect = (role: Role) => {
    if (!activeRole) {
      setLoginTargetRole(role);
      setCurrentView('login');
    } else {
      setActiveRole(role);
      if (role === Role.ALUMNO) {
        setCurrentView('dashboard');
      } else {
        setCurrentView('admin');
        setAdminSection('dashboard');
      }
    }
  };

  const handleLogout = () => {
    setActiveRole(null);
    setLoginTargetRole(null);
    setCurrentView('home');
    setSelectedStudent(null);
  };

  const StatusPill = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      'Regular': 'bg-green-100 text-green-700',
      'Al día': 'bg-green-100 text-green-700',
      'Completo': 'bg-green-100 text-green-700',
      'Operativa': 'bg-green-100 text-green-700',
      'Vencido': 'bg-red-100 text-red-700',
      'Deudor': 'bg-orange-100 text-orange-700',
      'En proceso': 'bg-blue-100 text-blue-700',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${colors[status] || 'bg-zinc-100 text-zinc-500'}`}>
        {status}
      </span>
    );
  };

  const LoginView = () => {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (user.toLowerCase() === 'victor' && pass === 'next') {
        const role = loginTargetRole || Role.ALUMNO;
        setActiveRole(role);
        if (role === Role.ALUMNO) setCurrentView('dashboard');
        else {
          setCurrentView('admin');
          setAdminSection('dashboard');
        }
      } else {
        setError('Acceso denegado. Intenta con victor / next');
      }
    };

    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 animate-in fade-in zoom-in duration-500">
        <div className="w-full max-w-md bg-white border border-zinc-100 p-12 rounded-[48px] shadow-2xl relative overflow-hidden">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black tracking-tighter mb-2">Acceso NEXT<span className="text-next-green">.</span></h2>
            <p className="text-zinc-400 font-bold uppercase text-[9px] tracking-[0.3em]">Credenciales de Bachillerato Ejecutivo</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input 
              type="text" 
              placeholder="Usuario" 
              className="w-full bg-zinc-50 border-none rounded-3xl px-8 py-5 text-sm font-bold focus:ring-2 focus:ring-next-green transition-all"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
            <input 
              type="password" 
              placeholder="Contraseña" 
              className="w-full bg-zinc-50 border-none rounded-3xl px-8 py-5 text-sm font-bold focus:ring-2 focus:ring-next-green transition-all"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>}
            <button type="submit" className="w-full bg-black text-white py-6 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-next-green transition-all transform active:scale-95 shadow-lg">Entrar</button>
          </form>
          <button onClick={() => setCurrentView('home')} className="w-full mt-8 text-zinc-300 hover:text-black text-[9px] font-black uppercase tracking-widest transition-colors">← Cancelar</button>
        </div>
      </div>
    );
  };

  const ControlEscolarDashboard = () => (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-black tracking-tighter">Control Escolar<span className="text-next-green">.</span></h2>
          <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-3 italic">Estatus General de Matrícula</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Alumnos Totales', value: '452', icon: '👥' },
          { label: 'Expedientes SEP', value: '92%', icon: '📜' },
          { label: 'Ingresos Mensuales', value: '$1.2M', icon: '💰' },
          { label: 'Alertas Bajas', value: '12', icon: '⚠️', color: 'text-orange-500' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white border-2 border-zinc-50 p-8 rounded-[40px] shadow-sm hover:border-next-green transition-all">
            <div className="text-2xl mb-4">{kpi.icon}</div>
            <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest mb-1">{kpi.label}</p>
            <p className={`text-4xl font-black tracking-tighter ${kpi.color || 'text-black'}`}>{kpi.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-zinc-50 p-12 rounded-[56px]">
        <h3 className="text-2xl font-black mb-8 italic">Acciones Rápidas</h3>
        <div className="grid md:grid-cols-3 gap-6">
           {['Inscribir Alumno', 'Generar Boletas', 'Reporte SEP'].map(a => (
             <button key={a} className="bg-white p-8 rounded-[32px] font-black uppercase text-[10px] tracking-widest text-zinc-400 hover:text-next-green hover:shadow-xl transition-all text-left">
               <span className="block text-2xl mb-2">⚡</span> {a}
             </button>
           ))}
        </div>
      </div>
    </div>
  );

  const AlumnosView = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <h2 className="text-4xl font-black tracking-tighter">Base de Alumnos<span className="text-next-green">.</span></h2>
        <div className="flex gap-4 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="bg-zinc-100 border-none rounded-2xl px-6 py-4 text-xs font-bold focus:ring-2 focus:ring-next-green flex-1 md:w-80"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-next-green text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">+ Nuevo</button>
        </div>
      </div>
      <div className="bg-white border border-zinc-100 rounded-[40px] overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <th className="px-10 py-6">Alumno</th>
              <th className="px-6 py-6">Grupo</th>
              <th className="px-6 py-6">Estatus</th>
              <th className="px-10 py-6 text-right">Detalle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {MOCK_STUDENTS.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(s => (
              <tr key={s.id} className="hover:bg-zinc-50/50 transition-colors">
                <td className="px-10 py-6">
                  <div className="flex items-center gap-4">
                    <img src={s.avatar} className="w-10 h-10 rounded-xl bg-zinc-100" alt={s.name} />
                    <div>
                      <p className="font-black text-zinc-800">{s.name}</p>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase">{s.enrollment}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 font-bold text-zinc-500">{s.group}</td>
                <td className="px-6 py-6"><StatusPill status={s.academicStatus} /></td>
                <td className="px-10 py-6 text-right">
                  <button 
                    onClick={() => { setSelectedStudent(s); setAdminSection('expedientes'); }}
                    className="text-next-green text-[10px] font-black uppercase hover:underline"
                  >
                    Ver Más
                  </button>
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
      <div className="space-y-12 animate-in fade-in duration-500">
        <div className="flex items-center gap-8">
          <img src={s.avatar} className="w-32 h-32 rounded-[40px] shadow-2xl border-4 border-white" />
          <div>
            <h2 className="text-5xl font-black tracking-tighter">{s.name}<span className="text-next-green">.</span></h2>
            <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.4em] mt-2">{s.enrollment} • {s.group}</p>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white border border-zinc-100 p-12 rounded-[56px] shadow-sm">
            <h3 className="text-2xl font-black mb-10 italic">Expediente Académico Digital</h3>
            <div className="space-y-8">
              {[
                { label: 'CURP', value: s.curp },
                { label: 'Tutor Responsable', value: s.tutor },
                { label: 'Correo Institucional', value: s.email },
                { label: 'Promedio Acumulado', value: s.gpa.toString(), bold: true },
              ].map((item, i) => (
                <div key={i} className="flex justify-between border-b border-zinc-50 pb-4">
                  <span className="text-[10px] font-black uppercase text-zinc-300">{item.label}</span>
                  <span className={`font-bold ${item.bold ? 'text-2xl text-next-green font-black' : 'text-zinc-600'}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-black text-white p-12 rounded-[56px] flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-black mb-6 italic text-next-green">Carga de Documentos</h3>
              <p className="text-zinc-500 text-xs mb-8 leading-relaxed">Sube el certificado de secundaria escaneado en formato PDF para validación SEP.</p>
              <div className="border-2 border-dashed border-zinc-800 rounded-3xl p-8 text-center hover:border-next-green transition-all cursor-pointer">
                <span className="text-3xl block mb-2">📁</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Arrastra aquí tu archivo</span>
              </div>
            </div>
            <button className="mt-8 bg-next-green text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest">Validar Documentación</button>
          </div>
        </div>
      </div>
    );
  };

  const AuditoriaView = () => (
    <div className="space-y-8 animate-in fade-in">
       <h2 className="text-4xl font-black tracking-tighter">Registro de Auditoría<span className="text-next-green">.</span></h2>
       <div className="bg-white border border-zinc-100 rounded-[40px] overflow-hidden shadow-sm">
         <table className="w-full text-left">
           <thead className="bg-zinc-50 text-[10px] font-black uppercase tracking-widest text-zinc-300">
             <tr><th className="px-10 py-6">Usuario</th><th className="px-6 py-6">Módulo</th><th className="px-6 py-6">Acción</th><th className="px-10 py-6 text-right">Fecha</th></tr>
           </thead>
           <tbody className="divide-y divide-zinc-50">
             {MOCK_AUDIT.map(log => (
               <tr key={log.id} className="text-xs">
                 <td className="px-10 py-6 font-black text-next-green">{log.user}</td>
                 <td className="px-6 py-6 text-zinc-400 font-bold uppercase">{log.module}</td>
                 <td className="px-6 py-6 font-bold">{log.action}</td>
                 <td className="px-10 py-6 text-right text-zinc-400">{log.timestamp}</td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
    </div>
  );

  const SedesView = () => (
    <div className="space-y-16 animate-in fade-in duration-700 max-w-7xl mx-auto py-12">
      <div className="text-center space-y-4">
        <span className="bg-next-green text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Presencia Nacional</span>
        <h2 className="text-7xl font-black tracking-tighter">Nuestras Sedes<span className="text-next-green">.</span></h2>
        <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.5em] italic">Centros de atención y aprendizaje NEXT</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {MOCK_SEDES.map(sede => (
          <div key={sede.id} className="bg-white border border-zinc-100 p-12 rounded-[64px] hover:border-next-green transition-all shadow-lg group">
            <div className="flex justify-between items-start mb-12">
               <div className="w-20 h-20 bg-zinc-50 rounded-[32px] flex items-center justify-center text-4xl group-hover:bg-next-green/10 transition-colors">📍</div>
               <StatusPill status={sede.status} />
            </div>
            <h3 className="text-4xl font-black tracking-tighter mb-4">{sede.name}</h3>
            <p className="text-zinc-400 text-sm mb-12 max-w-xs font-medium leading-relaxed">{sede.address}</p>
            <div className="flex justify-between items-end border-t border-zinc-50 pt-10">
              <div>
                <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest mb-1">Director de Sede</p>
                <p className="font-bold text-zinc-800">{sede.manager}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest mb-1">Matrícula</p>
                <p className="text-3xl font-black text-next-green">{sede.activeStudents.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-zinc-50 p-16 rounded-[72px] text-center">
         <h3 className="text-3xl font-black tracking-tighter mb-12">Cobertura Total en México<span className="text-next-green">.</span></h3>
         <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {MEXICAN_STATES.map(s => (
              <span key={s} className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-next-green cursor-default transition-all">{s}</span>
            ))}
         </div>
      </div>
    </div>
  );

  const HomeView = () => (
    <div className="animate-in fade-in duration-1000">
      <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-50">
           <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-next-green/5 blur-[120px] rounded-full"></div>
           <div className="absolute bottom-20 left-[-10%] w-[500px] h-[500px] bg-next-green/10 blur-[120px] rounded-full"></div>
        </div>
        <span className="bg-zinc-100 text-zinc-500 px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.3em] mb-8 border border-zinc-200">RVOE SEP Oficial</span>
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-12">
          NEXT <br />
          <span className="text-next-green italic">Bachillerato</span> <br />
          Ejecutivo<span className="text-next-green">.</span>
        </h1>
        <p className="max-w-2xl text-zinc-400 text-lg md:text-xl font-medium leading-relaxed mb-12">
          La plataforma educativa más avanzada para concluir tu bachillerato con flexibilidad, acompañamiento de expertos y tecnología de punta.
        </p>
        <div className="flex flex-col sm:flex-row gap-6">
           <button onClick={() => handleRoleSelect(Role.ALUMNO)} className="bg-next-green text-white px-12 py-7 rounded-[32px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-next-green/20 hover:-translate-y-1 transition-all">Iniciar Inscripción</button>
           <button onClick={() => setCurrentView('sedes')} className="bg-black text-white px-12 py-7 rounded-[32px] font-black text-xs uppercase tracking-[0.2em] hover:-translate-y-1 transition-all">Nuestras Sedes</button>
        </div>
      </section>
      
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          {[
            { title: 'Modalidad 100% Online', desc: 'Estudia a tu ritmo con nuestra plataforma disponible 24/7 desde cualquier dispositivo.', icon: '🌐' },
            { title: 'Certificación SEP', desc: 'Validez oficial en toda la República Mexicana y el extranjero para continuar tus estudios.', icon: '📜' },
            { title: 'Mentores Expertos', desc: 'Acompañamiento personalizado por docentes con amplia experiencia académica y profesional.', icon: '🧠' }
          ].map((item, i) => (
            <div key={i} className="bg-zinc-50 p-12 rounded-[56px] hover:bg-white border border-transparent hover:border-zinc-100 hover:shadow-2xl transition-all group">
              <div className="text-5xl mb-8 group-hover:scale-110 transition-transform inline-block">{item.icon}</div>
              <h3 className="text-2xl font-black mb-4 italic">{item.title}</h3>
              <p className="text-zinc-400 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <Layout 
      activeRole={activeRole} 
      onRoleSelect={handleRoleSelect} 
      onHome={() => setCurrentView('home')}
      onLogout={handleLogout}
      onSedes={() => setCurrentView('sedes')}
      currentAdminSection={adminSection}
      onAdminSectionChange={setAdminSection}
    >
      {currentView === 'home' && <HomeView />}
      {currentView === 'login' && <LoginView />}
      {currentView === 'sedes' && <SedesView />}
      {currentView === 'dashboard' && activeRole === Role.ALUMNO && (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-12 animate-in fade-in">
           <div className="text-center">
             <h2 className="text-6xl font-black tracking-tighter">¡Hola de nuevo, Victor!<span className="text-next-green">.</span></h2>
             <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.5em] mt-4">Panel del Alumno Activo</p>
           </div>
           <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl">
             {STUDENT_MODULES.map(m => (
               <div key={m.id} className="bg-white border-2 border-zinc-50 p-12 rounded-[56px] hover:border-next-green transition-all shadow-sm cursor-pointer group">
                  <div className="text-5xl mb-8 group-hover:scale-110 transition-transform">{m.icon}</div>
                  <h3 className="text-2xl font-black italic mb-3">{m.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed font-medium">{m.description}</p>
               </div>
             ))}
           </div>
        </div>
      )}
      {currentView === 'admin' && (
        <>
          {adminSection === 'dashboard' && activeRole === Role.CONTROL_ESCOLAR && <ControlEscolarDashboard />}
          {adminSection === 'alumnos' && <AlumnosView />}
          {adminSection === 'expedientes' && <ExpedienteView />}
          {adminSection === 'auditoria' && <AuditoriaView />}
          {adminSection === 'sedes' && <SedesView />}
          {['pagos', 'materias', 'profesores', 'reportes'].includes(adminSection) && (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <span className="text-6xl">🛠️</span>
              <h2 className="text-4xl font-black italic text-zinc-200 uppercase tracking-widest">{adminSection} en desarrollo...</h2>
            </div>
          )}
        </>
      )}
      <AIAssistant />
    </Layout>
  );
};

export default App;
