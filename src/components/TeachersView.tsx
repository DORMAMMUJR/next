import React from 'react';
import { Users, HardHat } from 'lucide-react';

const TeachersView = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
            <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mb-6 text-zinc-400">
                <Users size={48} />
            </div>
            <h2 className="text-3xl font-black italic uppercase mb-2">Directorio de Docentes</h2>
            <p className="text-zinc-500 max-w-md mb-8">
                Aquí podrás gestionar los perfiles, asignaciones y rendimiento de tus profesores por sede.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-500 bg-amber-50 px-4 py-2 rounded-full">
                <HardHat size={16} /> En construcción
            </div>
        </div>
    );
};

export default TeachersView;
