import { Settings, HardHat } from 'lucide-react';

const SettingsView = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
            <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mb-6 text-zinc-500">
                <Settings size={48} />
            </div>
            <h2 className="text-3xl font-black italic uppercase mb-2 text-zinc-900">Ajustes de Plataforma</h2>
            <p className="text-zinc-600 font-medium max-w-md mb-8">
                Configuración global, gestión de usuarios administrativos y parámetros del sistema.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-500 bg-amber-50 px-4 py-2 rounded-full">
                <HardHat size={16} /> Próximamente
            </div>
        </div>
    );
};

export default SettingsView;
