
import React, { useState, useEffect, Suspense } from 'react';
import { Role, AdminSection, Student } from './types';
import { STUDENT_MODULES, MOCK_STUDENTS, MOCK_AUDIT, MOCK_SEDES, MEXICAN_STATES } from './constants';
import Layout from './components/Layout';
import AIAssistant from './components/AIAssistant';

const App: React.FC = () => {
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'admin' | 'sedes' | 'login'>('home');
  const [adminSection, setAdminSection] = useState<AdminSection>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loginTargetRole, setLoginTargetRole] = useState<Role | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView, adminSection]);

  const handleRoleSelect = (role: Role) => {
    if (!activeRole) {
      setLoginTargetRole(role);
      setCurrentView('login');
    } else {
      setActiveRole(role);
      if (role === Role.ALUMNO) setCurrentView('dashboard');
      else {
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
      // Victor / Next son las credenciales maestras solicitadas
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
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-zinc-100 p-12 rounded-[48px] shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black tracking-tighter mb-2">Acceso NEXT<span className="text-next-green">.</span></h2>
            <p className="text-zinc-400 font-bold uppercase text-[9px] tracking-[0.3em]">Plataforma Educativa de Alto Rendimiento</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input 
              type="text" 
              placeholder="Usuario" 
              className="w-full bg-zinc-50 border-none rounded-3xl px-8 py-5 text-sm font-bold focus:ring-2 focus:ring-next-green outline-none transition-all"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
            <input 
              type="password" 
              placeholder="Contraseña" 
              className="w-full bg-zinc-50 border-none rounded-3xl px-8 py-5 text-sm font-bold focus:ring-2 focus:ring-next-green outline-none transition-all"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>}
            <button type="submit" className="w-full bg-black text-white py-6 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-next-green transition-all shadow-lg">Entrar</button>
          </form>
          <button onClick={() => setCurrentView('home')} className="w-full mt-8 text-zinc-300 hover:text-black text-[9px] font-black uppercase tracking-widest transition-colors">← Volver al Inicio</button>
        </div>
      </div>
    );
  };

  const ControlEscolarDashboard = () => (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-black tracking-tighter">Control Escolar<span className="text-next-green">.</span></h2>
          <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-3 italic">Panel Administrativo Central</p>
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
    </div>
  );

  const HomeView = () => (
    <div className="max-w-7xl mx-auto">
      <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6">
        <span className="bg-zinc-100 text-zinc-500 px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.3em] mb-8 border border-zinc-200">Reconocimiento SEP Oficial</span>
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-12">
          NEXT <br />
          <span className="text-next-green italic">Bachillerato</span> <br />
          Digital<span className="text-next-green">.</span>
        </h1>
        <p className="max-w-2xl text-zinc-400 text-lg md:text-xl font-medium leading-relaxed mb-12">
          Termina tu bachillerato en 18 meses con una plataforma diseñada para el éxito. Flexibilidad total con validez oficial garantizada.
        </p>
        <div className="flex flex-col sm:flex-row gap-6">
           <button onClick={() => handleRoleSelect(Role.ALUMNO)} className="bg-next-green text-white px-12 py-7 rounded-[32px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-next-green/20 hover:-translate-y-1 transition-all">Iniciar Ahora</button>
           <button onClick={() => setCurrentView('sedes')} className="bg-black text-white px-12 py-7 rounded-[32px] font-black text-xs uppercase tracking-[0.2em] hover:-translate-y-1 transition-all">Ver Sedes</button>
        </div>
      </section>
    </div>
  );

  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-next-green font-black animate-pulse">CARGANDO...</div></div>}>
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
        {currentView === 'sedes' && <div className="animate-in fade-in py-12"><h2 className="text-5xl font-black tracking-tighter mb-12 text-center">Nuestras Sedes Nacionales<span className="text-next-green">.</span></h2><div className="grid md:grid-cols-2 gap-8">{MOCK_SEDES.map(s => <div key={s.id} className="bg-white p-12 border border-zinc-100 rounded-[56px] shadow-sm"><h3 className="text-3xl font-black italic mb-4">{s.name}</h3><p className="text-zinc-400 font-medium mb-6">{s.address}</p><div className="flex justify-between items-end"><p className="text-next-green font-black">{s.activeStudents} Alumnos</p><p className="text-[10px] font-black uppercase text-zinc-300">📍 Operativo</p></div></div>)}</div></div>}
        {currentView === 'dashboard' && activeRole === Role.ALUMNO && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-12 animate-in fade-in">
             <div className="text-center">
               <h2 className="text-6xl font-black tracking-tighter">Panel de Victor<span className="text-next-green">.</span></h2>
               <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.5em] mt-4">Matrícula Activa: NX-2024-001</p>
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
        {currentView === 'admin' && adminSection === 'dashboard' && activeRole === Role.CONTROL_ESCOLAR && <ControlEscolarDashboard />}
        {currentView === 'admin' && adminSection !== 'dashboard' && (
          <div className="py-32 text-center">
            <span className="text-6xl mb-6 block">🚧</span>
            <h2 className="text-4xl font-black italic text-zinc-200 uppercase tracking-widest">{adminSection}</h2>
            <p className="text-zinc-400 mt-4 font-bold uppercase text-[10px]">Módulo en proceso de actualización digital</p>
          </div>
        )}
        <AIAssistant />
      </Layout>
    </Suspense>
  );
};

export default App;
