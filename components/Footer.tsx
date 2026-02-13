
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-zinc-900 mt-auto w-full">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 mb-12">
        <div>
          <h4 className="text-2xl font-black italic mb-4 text-white">NEXT<span className="text-next-green">.</span></h4>
          <p className="text-xs text-zinc-300 font-medium leading-relaxed">
            Plataforma educativa de alto rendimiento. Bachillerato ejecutivo digital con validez oficial RVOE 2026.
          </p>
        </div>
        <div>
          <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">Contacto</h5>
          <p className="text-xs text-zinc-300 mb-2">Av. Universidad 1001, Aguascalientes, Ags.</p>
          <p className="text-xs text-zinc-300 mb-2">contacto@next-edu.mx</p>
          <div className="flex gap-4 mt-4">
            <span className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-xs text-white hover:bg-next-green hover:text-black transition-colors cursor-pointer border border-zinc-700">FB</span>
            <span className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-xs text-white hover:bg-next-green hover:text-black transition-colors cursor-pointer border border-zinc-700">IG</span>
            <span className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-xs text-white hover:bg-next-green hover:text-black transition-colors cursor-pointer border border-zinc-700">X</span>
          </div>
        </div>
        <div>
          <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">Legal</h5>
          <ul className="space-y-2 text-xs text-zinc-300">
            <li className="hover:text-white cursor-pointer">Aviso de Privacidad</li>
            <li className="hover:text-white cursor-pointer">Términos y Condiciones</li>
            <li className="hover:text-white cursor-pointer">Reglamento Escolar</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-zinc-900 pt-8 text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
          Desarrollado por Falla Intecnia © 2026
        </p>
      </div>
    </footer>
  );
};

export default Footer;
