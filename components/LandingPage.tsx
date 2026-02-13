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
    const el = document.getElementById(section);
    if (el) {
        // Offset for fixed navbar
        const y = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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

  // Helper variables for Modal display
  const roleTitle = loginMode === 'STUDENT' ? 'Soy Alumno' : loginMode === 'TEACHER' ? 'Soy Docente' : 'Administración';
  const roleSubtitle = loginMode === 'STUDENT' ? 'Portal Estudiantil' : loginMode === 'TEACHER' ? 'Claustro Académico' : 'Acceso Restringido';
  const placeholderID = loginMode === 'STUDENT' ? 'EJ. NX-001023' : loginMode === 'TEACHER' ? 'ID Empleado' : 'ID Usuario';
  const placeholderPass = loginMode === 'STUDENT' ? 'DDMMAAAA' : 'Contraseña';

  // --- SECTIONS ---

  const HomeSection = () => (
    <div id="HOME" className="min-h-screen pt-32 pb-16 flex flex-col items-center justify-center text-center relative overflow-x-hidden px-4 bg-grid-pattern">
      {/* Abstract Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-gradient-to-tr from-zinc-200 to-transparent rounded-full blur-[60px] md:blur-[100px] -z-10 opacity-50"></div>
      
      <div className="animate-fade-in-up w-full max-w-5xl mx-auto flex flex-col items-center">
        <span className="inline-block py-2 px-6 border border-zinc-200 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-6 md:mb-8 bg-white/80 backdrop-blur-sm text-zinc-600 shadow-sm">
          Inscripciones Abiertas 2026
        </span>
        
        {/* Adjusted Font Sizes: Reduced significantly on mobile to fit screen width */}
        <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-black italic tracking-tighter uppercase leading-[0.9] mb-8 text-black drop-shadow-sm max-w-[90vw]">
          Bachillerato<br/>Digital de<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-next-green to-green-400">Alto Rendimiento</span>
        </h1>
        
        <p className="max-w-xl mx-auto text-sm md:text-lg font-medium text-zinc-600 mb-10 md:mb-12 leading-relaxed px-6">
          Una plataforma diseñada para el éxito profesional. Estudia con validez oficial, tecnología de punta y un modelo ejecutivo de 18 meses.
        </p>
        
        <div className="flex flex-col w-full px-6 gap-4 sm:flex-row sm:justify-center sm:w-auto">
          <button onClick={() => scrollToSection('ALUMNOS')} className="w-full sm:w-auto bg-black text-white px-8 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:-translate-y-1 transition-transform shadow-xl hover:shadow-next-green/30">
            Soy Estudiante
          </button>
          <button onClick={() => scrollToSection('DOCENTES')} className="w-full sm:w-auto bg-white text-black border-2 border-zinc-200 px-8 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:border-black hover:bg-zinc-50 transition-colors">
            Soy Docente
          </button>
        </div>
      </div>
    </div>
  );

  const StudentSection = () => (
    <div id="ALUMNOS" className="min-h-[80vh] bg-zinc-50 py-24 px-6 flex items-center relative overflow-hidden">
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50"></div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="order-2 md:order-1">
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-6 text-black leading-none">
            Tu Futuro<br/>Comienza Aquí<span className="text-next-green">.</span>
          </h2>
          <p className="text-zinc-600 font-medium mb-8 leading-relaxed text-sm md:text-lg">
            Accede a tu historial académico, gestiona tus pagos y descarga tus constancias con un solo clic. Nuestra plataforma está diseñada para que te concentres en lo más importante: aprender.
          </p>
          <ul className="space-y-4 md:space-y-6 mb-10">
            {['Trámites 100% Digitales', 'Consulta de Calificaciones en Tiempo Real', 'Facturación Automática'].map(item => (
              <li key={item} className="flex items-center gap-4 text-xs md:text-sm font-bold text-black uppercase tracking-wide">
                <span className="w-6 h-6 md:w-8 md:h-8 bg-next-green/10 rounded-full flex items-center justify-center text-next-green text-xs md:text-sm flex-shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <button 
            onClick={() => openLogin('STUDENT')}
            className="w-full md:w-auto bg-black text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-xl flex items-center justify-center gap-2 group"
          >
            Iniciar Sesión <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
        <div className="order-1 md:order-2 bg-white p-4 rounded-[40px] md:rounded-[48px] shadow-2xl rotate-3 border-4 border-white ring-1 ring-zinc-200/50 max-w-[280px] md:max-w-none mx-auto">
           {/* Decorative mockup representation */}
           <div className="aspect-[4/3] bg-zinc-100 rounded-[28px] md:rounded-[32px] flex items-center justify-center overflow-hidden relative border border-zinc-200">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-zinc-200"></div>
              <span className="text-[8rem] md:text-[12rem] relative z-10 opacity-5 text-black font-black">A+</span>
              <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 md:right-8 bg-white/80 backdrop-blur-md p-4 md:p-6 rounded-3xl shadow-lg flex items-center gap-4 md:gap-6 border border-white/50">
                 <div className="w-12 h-12 md:w-16 md:h-16 bg-next-green rounded-2xl flex items-center justify-center text-white font-black text-xl md:text-2xl shadow-lg shadow-next-green/30">9.8</div>
                 <div className="space-y-2">
                    <div className="h-2 w-24 md:w-32 bg-zinc-800 rounded-full opacity-10"></div>
                    <div className="h-2 w-16 md:w-20 bg-zinc-800 rounded-full opacity-5"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  const TeacherSection = () => (
    <div id="DOCENTES" className="min-h-[80vh] bg-white py-24 px-6 flex items-center bg-grid-pattern">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
         <div className="order-1 bg-black p-4 rounded-[40px] md:rounded-[48px] shadow-2xl -rotate-2 ring-4 ring-zinc-100 max-w-[280px] md:max-w-none mx-auto mb-8 md:mb-0">
            <div className="aspect-[4/3] bg-zinc-900 rounded-[28px] md:rounded-[32px] flex items-center justify-center overflow-hidden relative border border-zinc-800">
              <span className="text-[8rem] md:text-[10rem] relative z-10 opacity-20 text-white font-serif">Aa</span>
              <div className="absolute top-6 md:top-8 right-6 md:right-8 bg-next-green px-4 md:px-6 py-2 md:py-3 rounded-full">
                <span className="text-[10px] md:text-xs font-black uppercase text-white tracking-widest">Claustro 2026</span>
              </div>
           </div>
        </div>
        <div className="order-2">
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-6 text-black leading-none">
            Excelencia<br/>Docente<span className="text-next-green">.</span>
          </h2>
          <p className="text-zinc-600 font-medium mb-8 leading-relaxed text-sm md:text-lg">
            Herramientas avanzadas para el seguimiento académico. Gestiona listas de asistencia, calificaciones parciales y reportes de desempeño desde cualquier dispositivo.
          </p>
          <div className="grid grid-cols-2 gap-4 md:gap-6 mb-10">
             <div className="bg-zinc-50 p-6 md:p-8 rounded-3xl border border-zinc-100 hover:border-zinc-300 transition-colors">
                <h4 className="font-black text-2xl md:text-4xl mb-2 text-black">15+</h4>
                <p className="text-[9px] md:text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Sedes Nacionales</p>
             </div>
             <div className="bg-zinc-50 p-6 md:p-8 rounded-3xl border border-zinc-100 hover:border-zinc-300 transition-colors">
                <h4 className="font-black text-2xl md:text-4xl mb-2 text-black">24/7</h4>
                <p className="text-[9px] md:text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Soporte Académico</p>
             </div>
          </div>
          <button 
             onClick={() => openLogin('TEACHER')}
             className="w-full md:w-auto border-2 border-black text-black px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 group"
          >
            Acceso Docente <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-next-green selection:text-white overflow-x-hidden">
      <Navbar 
        mode="landing"
        onHome={() => scrollToSection('HOME')}
        activeSection={activeSection}
        onNavigate={(section) => scrollToSection(section)}
        onOpenLogin={(mode) => openLogin(mode)}
      />
      
      <HomeSection />
      <StudentSection />
      <TeacherSection />

      <Footer />
      
      {/* Login Modal Rendered Inline to prevent re-mounting and focus loss */}
      {loginMode !== 'NONE' && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={() => setLoginMode('NONE')}></div>
          <div className="bg-white w-full max-w-md p-8 md:p-10 rounded-[40px] shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 border border-white/20">
            <button onClick={() => setLoginMode('NONE')} className="absolute top-6 right-6 w-8 h-8 md:w-10 md:h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-500 hover:bg-zinc-200 hover:text-black transition-colors font-bold text-lg">✕</button>
            
            <div className="text-center mb-8 mt-2">
              <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter mb-2 text-black">{roleTitle}</h2>
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-next-green">{roleSubtitle}</p>
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
              <form onSubmit={handleLoginSubmit} className="space-y-4 md:space-y-6">
                {errorMsg && (
                  <div className="bg-zinc-900 text-white p-4 rounded-2xl text-xs font-bold flex items-center gap-3 animate-pulse shadow-lg">
                    <span className="text-red-500 text-lg">🚫</span> {errorMsg}
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Identificador</label>
                  <input 
                    type="text" 
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value.toUpperCase())}
                    placeholder={placeholderID}
                    className="w-full bg-zinc-50 border-2 border-transparent focus:border-zinc-900 focus:bg-white rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all placeholder:text-zinc-300 text-black shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Clave de Acceso</label>
                  <div className="relative">
                    <input 
                      type={loginMode === 'STUDENT' ? "text" : showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={placeholderPass}
                      className="w-full bg-zinc-50 border-2 border-transparent focus:border-zinc-900 focus:bg-white rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all placeholder:text-zinc-300 text-black pr-12 shadow-inner"
                    />
                    {loginMode !== 'STUDENT' && (
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-black transition-colors"
                      >
                        {showPassword ? '👁️' : '🔒'}
                      </button>
                    )}
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-next-green hover:text-white transition-all shadow-xl mt-6 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                >
                  {loading ? 'Verificando...' : 'Acceder'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;