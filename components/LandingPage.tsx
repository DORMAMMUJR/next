import React, { useState } from 'react';
import { Role } from '../types';

interface LandingProps {
  onLogin: (identifier: string, credential: string, role: Role) => Promise<{ success: boolean; error?: string }>;
}

const LandingPage: React.FC<LandingProps> = ({ onLogin }) => {
  const [role, setRole] = useState<Role>(Role.PROFESOR);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await onLogin(identifier, password, role);
    if (!result.success) setError(result.error || 'Credenciales incorrectas');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Fondo decorativo sutil */}
      <div className="absolute top-0 left-0 w-full h-2 bg-black"></div>
      
      <div className="w-full max-w-md bg-white z-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <h1 className="text-6xl font-black italic tracking-tighter mb-2">NEXT<span className="text-next-green">.</span></h1>
          <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Plataforma de Control Académico</p>
        </div>

        {/* Selector de Rol (Tipo Pestaña) */}
        <div className="flex bg-zinc-100 p-1 rounded-xl mb-8">
          <button 
            onClick={() => setRole(Role.PROFESOR)}
            className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${role === Role.PROFESOR ? 'bg-white shadow-sm text-black' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
            Docentes
          </button>
          <button 
            onClick={() => setRole(Role.OWNER)}
            className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${role === Role.OWNER ? 'bg-black text-white shadow-md' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
            Administración
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              {role === Role.OWNER ? 'ID Administrativo' : 'ID Docente'}
            </label>
            <input 
              type="text" 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-zinc-50 border-2 border-transparent focus:border-black rounded-xl p-4 font-bold outline-none transition-all"
              placeholder={role === Role.OWNER ? "Ingrese ID (1234)" : "Ej. DOC-001"}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Contraseña
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-50 border-2 border-transparent focus:border-black rounded-xl p-4 font-bold outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold p-4 rounded-xl text-center animate-pulse">
              ⚠️ {error}
            </div>
          )}

          <button 
            disabled={loading}
            className={`w-full py-5 rounded-xl font-black text-sm uppercase tracking-widest transition-transform active:scale-95 hover:shadow-lg ${role === Role.OWNER ? 'bg-black text-white' : 'bg-zinc-900 text-white'}`}
          >
            {loading ? 'Accediendo...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-[10px] font-black uppercase text-zinc-300">
            Sistema Seguro • Falla Intecnia © 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;