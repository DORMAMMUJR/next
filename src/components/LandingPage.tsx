import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Role } from '../types';
import Footer from './Footer';

interface LandingProps {
  onLogin: (identifier: string, credential: string, role: Role) => Promise<{ success: boolean; error?: string }>;
  onGoToUpload: () => void;
}

const LandingPage: React.FC<LandingProps> = ({ onLogin, onGoToUpload }) => {
  const [viewState, setViewState] = useState<'menu' | 'login'>('menu');
  const [selectedRole, setSelectedRole] = useState<Role>(Role.PROFESOR);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelection = (role: Role) => {
    setSelectedRole(role);
    setViewState('login');
    setError(null);
    setIdentifier('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await onLogin(identifier, password, selectedRole);
    if (!result.success) setError(result.error || 'Credenciales incorrectas');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-between relative overflow-hidden font-sans text-zinc-900">

      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white to-transparent -z-10" />
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-30 -z-10 animate-pulse" />
      <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30 -z-10 animate-pulse delay-700" />

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col items-center justify-center p-6 w-full max-w-7xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">

          {/* Branding Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left space-y-8"
          >
            <div className="inline-block bg-zinc-900 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 shadow-lg shadow-zinc-200/50">
              Versión 2.0
            </div>
            <h1 className="text-8xl md:text-9xl font-black italic tracking-tighter text-zinc-900 leading-[0.85]">
              NEXT<span className="text-green-500">.</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium text-zinc-600 max-w-lg leading-relaxed">
              La evolución del control escolar. Gestión administrativa y docente centralizada en una sola plataforma segura.
            </p>
          </motion.div>

          {/* Interaction Section */}
          <div className="w-full max-w-md ml-auto relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {viewState === 'menu' ? (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-5"
                >
                  <button
                    onClick={() => handleSelection(Role.PROFESOR)}
                    className="group w-full bg-white border border-zinc-200 p-8 rounded-[2rem] flex items-center justify-between transition-all hover:shadow-2xl hover:scale-[1.02] hover:border-zinc-300 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="text-left relative z-10">
                      <span className="font-bold text-xs uppercase tracking-widest text-zinc-500 group-hover:text-green-600 block mb-2 transition-colors">Acceso</span>
                      <span className="text-4xl font-black text-zinc-900">Docentes</span>
                    </div>
                    <div className="w-14 h-14 bg-zinc-50 rounded-full flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all shadow-sm group-hover:shadow-green-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelection(Role.OWNER)}
                    className="group w-full bg-zinc-900 text-white border border-zinc-900 p-8 rounded-[2rem] flex items-center justify-between transition-all hover:shadow-2xl hover:scale-[1.02] hover:bg-black relative overflow-hidden"
                  >
                    <div className="text-left relative z-10">
                      <span className="font-bold text-xs uppercase tracking-widest text-zinc-500 block mb-2">Acceso</span>
                      <span className="text-4xl font-black text-white">Admin</span>
                    </div>
                    <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all shadow-sm group-hover:shadow-white/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </div>
                  </button>

                  <div className="pt-4 border-t border-zinc-100">
                    <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-3 text-center">Zona de Alumnos</p>
                    <button
                      onClick={onGoToUpload}
                      className="group w-full bg-white border-2 border-zinc-100 p-4 rounded-xl flex items-center justify-center gap-3 transition-all hover:border-black hover:shadow-lg hover:scale-[1.02]"
                    >
                      <span className="font-bold text-xs uppercase tracking-widest text-zinc-600 group-hover:text-black transition-colors">Alumnos</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-black"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  onSubmit={handleSubmit}
                  className="bg-white border border-zinc-200 p-10 rounded-[2.5rem] shadow-2xl space-y-8 relative"
                >
                  <button
                    type="button"
                    onClick={() => setViewState('menu')}
                    className="absolute top-8 right-8 text-zinc-400 hover:text-zinc-900 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                  </button>

                  <div className="mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 block mb-2">
                      {selectedRole === Role.OWNER ? 'Portal Administrativo' : 'Portal Docente'}
                    </span>
                    <h2 className="text-3xl font-black italic text-zinc-900">Iniciar Sesión</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="group relative">
                      <input
                        autoFocus
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="peer w-full bg-zinc-50 border-2 border-transparent focus:bg-white focus:border-zinc-900 rounded-2xl p-5 pt-7 font-bold text-lg outline-none transition-all placeholder-transparent"
                        placeholder="Identificador"
                        id="identifier"
                      />
                      <label
                        htmlFor="identifier"
                        className="absolute left-5 top-5 text-zinc-500 text-xs font-bold uppercase tracking-widest transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-zinc-900"
                      >
                        Identificador
                      </label>
                    </div>

                    <div className="group relative">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="peer w-full bg-zinc-50 border-2 border-transparent focus:bg-white focus:border-zinc-900 rounded-2xl p-5 pt-7 font-bold text-lg outline-none transition-all placeholder-transparent"
                        placeholder="Contraseña"
                        id="password"
                      />
                      <label
                        htmlFor="password"
                        className="absolute left-5 top-5 text-zinc-500 text-xs font-bold uppercase tracking-widest transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-zinc-900"
                      >
                        Clave de Acceso
                      </label>
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 text-red-600 text-xs font-bold p-4 rounded-xl text-center border border-red-100 flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
                      {error}
                    </motion.div>
                  )}

                  <button
                    disabled={loading}
                    className="w-full bg-zinc-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-zinc-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Validando...
                      </>
                    ) : (
                      <>
                        Iniciar Sesión
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                      </>
                    )}
                  </button>


                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;