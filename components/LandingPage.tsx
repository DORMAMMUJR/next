
import React, { useState } from 'react';

interface LandingPageProps {
  onEnterApp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    institucion: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de envío a backend/API para ventas B2B
    console.log("Lead Institucional capturado:", formData);
    setSubmitted(true);
    // Simular redirección tras 2 segundos
    setTimeout(() => {
      onEnterApp();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-next-green selection:text-white">
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-zinc-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-3xl font-black italic tracking-tighter uppercase cursor-pointer text-black" onClick={onEnterApp}>
            NEXT<span className="text-next-green">.</span>
          </div>
          <button 
            onClick={onEnterApp}
            className="text-[10px] font-black uppercase tracking-widest text-zinc-900 hover:text-white hover:bg-black transition-all border border-zinc-300 hover:border-black px-6 py-2 rounded-full"
          >
            Iniciar Sesión →
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="pt-32 pb-20 px-6 lg:pt-48 lg:pb-32">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
            <span className="inline-block bg-zinc-100 text-next-green px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-zinc-200">
              Software de Gestión Escolar v2.0
            </span>
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-[0.9] text-black">
              CONTROL TOTAL.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-next-green to-emerald-700">SIN COMPLICACIONES</span>.
            </h1>
            <p className="text-lg text-zinc-800 font-medium max-w-lg leading-relaxed border-l-4 border-next-green pl-6">
              La plataforma definitiva para directores. Centraliza expedientes RVOE, cobranza y auditoría académica en una sola interfaz segura y fácil de usar.
            </p>
            <div className="flex gap-4 pt-4">
              <a href="#registro" className="bg-black text-white px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-next-green transition-all shadow-xl hover:scale-105 border border-black">
                Agendar Demostración
              </a>
              <button onClick={onEnterApp} className="px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest text-zinc-900 border border-zinc-300 hover:border-black hover:bg-zinc-50 transition-all">
                Ver Dashboard Demo
              </button>
            </div>
            
            <div className="pt-8 flex items-center gap-4 opacity-80">
                <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-zinc-200 border-2 border-white flex items-center justify-center text-[8px] font-bold">DIR</div>
                    ))}
                </div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Más de 50 planteles confían en NEXT.</p>
            </div>
          </div>

          {/* --- LEAD FORM CARD (B2B FOCUS) --- */}
          <div id="registro" className="relative animate-in slide-in-from-right-8 duration-1000 delay-200">
            <div className="absolute -inset-1 bg-gradient-to-r from-zinc-200 to-zinc-400 rounded-[40px] blur opacity-40"></div>
            <div className="relative bg-white border border-zinc-200 p-8 md:p-12 rounded-[40px] shadow-2xl">
              {!submitted ? (
                <>
                  <div className="mb-8">
                    <h3 className="text-2xl font-black italic uppercase tracking-tight mb-2 text-black">Solicitar Acceso Institucional</h3>
                    <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Optimice la gestión de su colegio hoy mismo.</p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-2">Director / Administrativo</label>
                      <input 
                        type="text" 
                        required
                        placeholder="NOMBRE COMPLETO" 
                        className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        onChange={e => setFormData({...formData, nombre: e.target.value})}
                      />
                    </div>
                    <div>
                       <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-2">Correo Institucional</label>
                      <input 
                        type="email" 
                        required
                        placeholder="CORREO@COLEGIO.EDU.MX" 
                        className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    
                    {/* MODIFICADO: Grid Responsivo para Teléfono e Institución */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                             <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-2">Teléfono de Contacto</label>
                            <input 
                                type="tel" 
                                required
                                inputMode="numeric"
                                pattern="[0-9]*"
                                placeholder="55 1234 5678" 
                                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all appearance-none"
                                onChange={e => setFormData({...formData, telefono: e.target.value})}
                            />
                        </div>
                        <div>
                             <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-2">Institución</label>
                            <input 
                                type="text" 
                                required
                                placeholder="NOMBRE DEL COLEGIO" 
                                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                onChange={e => setFormData({...formData, institucion: e.target.value})}
                            />
                        </div>
                    </div>
                    
                    <button type="submit" className="w-full bg-black text-white py-5 rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-next-green transition-all mt-4 border-2 border-black hover:border-next-green shadow-lg">
                      Solicitar Demo Gratuita
                    </button>
                    <p className="text-[9px] text-zinc-500 text-center mt-4 font-medium flex justify-center items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Sus datos están encriptados y seguros.
                    </p>
                  </form>
                </>
              ) : (
                <div className="text-center py-10 space-y-6">
                  <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-4xl mx-auto shadow-xl">
                    ✓
                  </div>
                  <h3 className="text-2xl font-black italic uppercase text-black">Solicitud Recibida</h3>
                  <p className="text-zinc-800 text-xs font-bold uppercase tracking-widest">
                    Un consultor educativo se pondrá en contacto con {formData.institucion} en breve.
                  </p>
                  <p className="text-zinc-500 text-sm">Redirigiendo al panel de demostración...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* --- B2B FEATURES STRIP --- */}
      <section className="bg-black text-white py-20 overflow-hidden border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
             <div className="space-y-2">
                <span className="text-next-green text-3xl">🔒</span>
                <h4 className="font-black uppercase text-xs tracking-[0.2em]">Seguridad Bancaria</h4>
                <p className="text-[10px] text-zinc-500">Encriptación de datos nivel financiero</p>
             </div>
             <div className="space-y-2">
                <span className="text-next-green text-3xl">📊</span>
                <h4 className="font-black uppercase text-xs tracking-[0.2em]">Auditoría Real</h4>
                <p className="text-[10px] text-zinc-500">Reportes de ingresos y egresos al instante</p>
             </div>
             <div className="space-y-2">
                <span className="text-next-green text-3xl">📁</span>
                <h4 className="font-black uppercase text-xs tracking-[0.2em]">Expediente Digital</h4>
                <p className="text-[10px] text-zinc-500">Documentación validada en la nube</p>
             </div>
             <div className="space-y-2">
                <span className="text-next-green text-3xl">🚀</span>
                <h4 className="font-black uppercase text-xs tracking-[0.2em]">Escalabilidad</h4>
                <p className="text-[10px] text-zinc-500">Gestión multisede sin fricción</p>
             </div>
        </div>
      </section>

      {/* --- FOOTER SIMPLE --- */}
      <footer className="bg-white py-12 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
                <p className="text-3xl font-black italic tracking-tighter uppercase mb-1 text-zinc-900">
                    NEXT<span className="text-next-green">.</span>
                </p>
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.3em]">
                    Educational Management Systems
                </p>
            </div>
            <div className="flex gap-6">
                 <a href="#" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black">Soporte</a>
                 <a href="#" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black">Privacidad</a>
                 <a href="#" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black">Contacto</a>
            </div>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                © 2026 Next Education.
            </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
