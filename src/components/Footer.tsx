

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white py-12 px-6 mt-auto animate-in slide-in-from-bottom-10 duration-700">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-zinc-800 pb-12">

        {/* Columna 1: Marca */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          <h2 className="text-3xl font-black italic tracking-tighter">NEXT<span className="text-next-green">.</span></h2>
          <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
            Plataforma integral de gestión académica. Control de pagos, auditoría y seguimiento docente en tiempo real.
          </p>
          <div className="flex gap-4 pt-4">
            {/* Redes Sociales (Simuladas con texto estilizado o iconos) */}
            <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-white hover:text-black transition-all">FB</a>
            <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-white hover:text-black transition-all">IG</a>
            <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-white hover:text-black transition-all">X</a>
          </div>
        </div>

        {/* Columna 2: Enlaces */}
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500">Plataforma</h4>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li><a href="#" className="hover:text-white transition-colors">Soporte Técnico</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Manual de Usuario</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Reportar Fallo</a></li>
          </ul>
        </div>

        {/* Columna 3: Legal */}
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500">Legal</h4>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Términos de Uso</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Falla Intecnia © 2026</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
        <p>System Status: <span className="text-green-500">● Operational</span></p>
        <p>Designed by Falla Intecnia</p>
      </div>
    </footer>
  );
};

export default Footer;