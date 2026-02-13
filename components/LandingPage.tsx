import React, { useState } from 'react';
import { Role } from '../types';
import Navbar from './Navbar';
import Footer from './Footer';

interface LoginProps {
  onLogin: (id: string, password: string, role: Role) => Promise<{ success: boolean; error?: string; status?: 'CLEAN' | 'DEBT' }>;
}

type PortalSection = 'HOME' | 'ALUMNOS' | 'DOCENTES';
type LoginMode = 'NONE' | 'STUDENT' | 'TEACHER' | 'ADMIN';

const LandingPage: React.FC<LoginProps> = ({ onLogin }) => {
  const [activeSection, setActiveSection] = useState<PortalSection>('HOME');
  const [loginMode, setLoginMode] = useState<LoginMode>('NONE');
  
  // Login Form States
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [debtLock, setDebtLock] = useState(false);
  const [panicSent, setPanicSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for toggle

  // --- NAVIGATION HANDLERS ---
  const scrollToSection = (section: PortalSection) => {
    setActiveSection(section);
    setLoginMode('NONE');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openLogin = (mode: LoginMode) => {
    setLoginMode(mode);
    setIdentifier('');
    setPassword('');
    setErrorMsg(null);
    setDebtLock(false);
    setPanicSent(false);
    setShowPassword(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setDebtLock(false);
    
    // Determine Role based on Login Mode
    let roleToAuth = Role.ALUMNO;
    if (loginMode === 'TEACHER') roleToAuth = Role.PROFESOR;
    if (loginMode === 'ADMIN') roleToAuth = Role.OWNER; // Or logic for owner/admin

    // Simulamos delay
    await new Promise(r => setTimeout(r, 800));

    const result = await onLogin(identifier, password, roleToAuth);

    if (!result.success) {
      if (result.status === 'DEBT' && roleToAuth === Role.ALUMNO) {
        setDebtLock(true);
      } else {
        setErrorMsg(result.error || "Credenciales inválidas.");
      }
    }
    setLoading(false);
  };

  const handlePanicButton = () => {
    setPanicSent(true);
  };

  const LoginModal = () => {
    if (loginMode === 'NONE') return null;

    const roleTitle = loginMode === 'STUDENT' ? 'Soy Alumno' : loginMode === 'TEACHER' ? 'Soy Docente' : 'Administración';
    const roleSubtitle = loginMode === 'STUDENT' ? 'Portal Estudiantil' : loginMode === 'TEACHER' ? 'Claustro Académico' : 'Acceso Restringido';
    const placeholderID = loginMode === 'STUDENT' ? 'EJ. NX-001023' : loginMode === 'TEACHER' ? 'ID Empleado' : 'ID Usuario';
    const placeholderPass = loginMode === 'STUDENT' ? 'DDMMAAAA' : 'Contraseña';

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setLoginMode('NONE')}></div>
        <div className="bg-white w-full max-w-md p-8 md:p-12 rounded-[40px] shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 border-2 border-black/5">
          <button onClick={() => setLoginMode('NONE')} className="absolute top-6 right-6 text-zinc-500 hover:text-black transition-colors font-bold">✕</button>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2 text-black">{roleTitle}</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-next-green">{roleSubtitle}</p>
          </div>

          {debtLock ? (
             <div className="animate-in fade-in slide-in-from-bottom-4">
             <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-2xl mb-8 shadow-sm">
               <h3 className="text-xl font-black italic uppercase text-red-600 mb-2 tracking-tight">Acceso Bloqueado</h3>
               <p className="text-[10px] font-bold uppercase tracking-wide text-red-900 mb-4">
                 Se requiere pago inmediato.
               </p>
               <div className="text-[10px] text-red-800 font-medium leading-relaxed">
                 La matrícula <strong>{identifier}</strong> presenta adeudos. Contacta a finanzas.
               </div>
             </div>
             
             <button onClick={() => setDebtLock(false)} className="w-full bg-zinc-100 text-zinc-800 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-zinc-200 transition-all mb-3">
               Intentar otra cuenta
             </button>
 
             {!panicSent ? (
               <button onClick={handlePanicButton} className="w-full bg-red-600 text-white py-4 rounded-2xl font-black uppercase text-[9px] tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-200">
                   <span className="text-lg">🚨</span> Reportar pago no reconocido
               </button>
             ) : (
               <div className="bg-green-100 text-green-800 p-4 rounded-2xl text-[10px] font-bold text-center">
                   ✅ Reporte enviado a Dirección General.
               </div>
             )}
           </div>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {errorMsg && (
                <div className="bg-black text-white p-3 rounded-xl text-[9px] font-bold uppercase tracking-wide text-center animate-pulse">
                  🚫 {errorMsg}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-3">Identificador</label>
                <input 
                  type="text" 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value.toUpperCase())}
                  placeholder={placeholderID}
                  className="w-full bg-zinc-50 border-zinc-200 focus:border-next-green focus:bg-white border-2 rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all placeholder:text-zinc-400 text-black"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-3">Clave de Acceso</label>
                <div className="relative">
                  <input 
                    type={loginMode === 'STUDENT' ? "text" : showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={placeholderPass}
                    className="w-full bg-zinc-50 border-zinc-200 focus:border-next-green focus:bg-white border-2 rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all placeholder:text-zinc-400 text-black pr-12"
                  />
                  {loginMode !== 'STUDENT' && (
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors"
                    >
                      {showPassword ? '👁️' : '🔒'}
                    </button>
                  )}
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-next-green hover:text-white transition-all shadow-xl mt-4 disabled:opacity-50"
              >
                {loading ? 'Verificando...' : 'Acceder'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  };

  // --- SECTIONS ---

  const HomeSection = () => (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center text-center relative overflow-hidden px-4">
      {/* Abstract Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-zinc-100 rounded-full blur-3xl -z-10 opacity-60"></div>
      
      <span className="inline-block py-1.5 px-4 border border-black rounded-full text-[9px] font-black uppercase tracking-widest mb-6 bg-white text-black">
        Inscripciones Abiertas 2026
      </span>
      <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.9] mb-6 text-black">
        Bachillerato<br/>Digital de<br/><span className="text-next-green">Alto Rendimiento</span>
      </h1>
      <p className="max-w-xl text-sm md:text-base font-medium text-zinc-800 mb-10 leading-relaxed">
        Una plataforma diseñada para el éxito profesional. Estudia con validez oficial, tecnología de punta y un modelo ejecutivo de 18 meses.
      </p>
      <div className="flex flex-col md:flex-row gap-4">
        <button onClick={() => scrollToSection('ALUMNOS')} className="bg-black text-white px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform shadow-xl hover:shadow-next-green/20">
          Soy Estudiante
        </button>
        <button onClick={() => scrollToSection('DOCENTES')} className="bg-white text-black border-2 border-black px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-zinc-50 transition-colors">
          Soy Docente
        </button>
      </div>
    </div>
  );

  const StudentSection = () => (
    <div className="min-h-[80vh] bg-zinc-50 py-32 px-6 flex items-center">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-6 text-black">
            Tu Futuro<br/>Comienza Aquí<span className="text-next-green">.</span>
          </h2>
          <p className="text-zinc-700 font-medium mb-8 leading-relaxed text-base">
            Accede a tu historial académico, gestiona tus pagos y descarga tus constancias con un solo clic. Nuestra plataforma está diseñada para que te concentres en lo más importante: aprender.
          </p>
          <ul className="space-y-4 mb-10">
            {['Trámites 100% Digitales', 'Consulta de Calificaciones en Tiempo Real', 'Facturación Automática'].map(item => (
              <li key={item} className="flex items-center gap-3 text-sm font-bold text-black uppercase tracking-wide">
                <span className="w-6 h-6 bg-next-green rounded-full flex items-center justify-center text-white text-xs">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <button 
            onClick={() => openLogin('STUDENT')}
            className="bg-black text-white px-12 py-5 rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-next-green hover:text-white transition-all shadow-xl"
          >
            Iniciar Sesión
          </button>
        </div>
        <div className="bg-white p-8 rounded-[40px] shadow-2xl rotate-3 border border-zinc-200">
           {/* Decorative mockup representation */}
           <div className="aspect-[4/3] bg-zinc-100 rounded-3xl flex items-center justify-center overflow-hidden relative border border-zinc-200">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-200"></div>
              <span className="text-9xl relative z-10 opacity-10 text-black">🎓</span>
              <div className="absolute bottom-6 left-6 right-6 bg-white p-4 rounded-xl shadow-lg flex items-center gap-4 border border-zinc-100">
                 <div className="w-10 h-10 bg-next-green rounded-full flex items-center justify-center text-white font-bold">A+</div>
                 <div>
                    <div className="h-2 w-24 bg-zinc-300 rounded mb-1"></div>
                    <div className="h-2 w-16 bg-zinc-200 rounded"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  const TeacherSection = () => (
    <div className="min-h-[80vh] bg-white py-32 px-6 flex items-center">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
         <div className="order-2 md:order-1 bg-black p-8 rounded-[40px] shadow-2xl -rotate-2">
            <div className="aspect-[4/3] bg-zinc-900 rounded-3xl flex items-center justify-center overflow-hidden relative">
              <span className="text-9xl relative z-10 opacity-20 text-white">🍎</span>
              <div className="absolute top-6 right-6 bg-next-green px-4 py-2 rounded-lg">
                <span className="text-[10px] font-black uppercase text-white">Claustro 2026</span>
              </div>
           </div>
        </div>
        <div className="order-1 md:order-2">
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-6 text-black">
            Excelencia<br/>Docente<span className="text-next-green">.</span>
          </h2>
          <p className="text-zinc-700 font-medium mb-8 leading-relaxed text-base">
            Herramientas avanzadas para el seguimiento académico. Gestiona listas de asistencia, calificaciones parciales y reportes de desempeño desde cualquier dispositivo.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-10">
             <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
                <h4 className="font-black text-2xl mb-1 text-black">15+</h4>
                <p className="text-[9px] font-bold uppercase text-zinc-600">Sedes Nacionales</p>
             </div>
             <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
                <h4 className="font-black text-2xl mb-1 text-black">24/7</h4>
                <p className="text-[9px] font-bold uppercase text-zinc-600">Soporte Académico</p>
             </div>
          </div>
          <button 
             onClick={() => openLogin('TEACHER')}
             className="border-2 border-black text-black px-12 py-5 rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-black hover:text-white transition-all"
          >
            Acceso Docente
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-next-green selection:text-white">
      <Navbar 
        mode="landing"
        onHome={() => scrollToSection('HOME')}
        activeSection={activeSection}
        onNavigate={(section) => scrollToSection(section)}
        onOpenLogin={(mode) => openLogin(mode)}
      />
      
      {activeSection === 'HOME' && <HomeSection />}
      {activeSection === 'ALUMNOS' && <StudentSection />}
      {activeSection === 'DOCENTES' && <TeacherSection />}

      <Footer />
      <LoginModal />
    </div>
  );
};

export default LandingPage;