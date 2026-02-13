import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Hash, Briefcase, Plus, X } from 'lucide-react';
import { Docente } from '../types';

interface NewStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    docentes: Docente[];
}

const NewStudentModal: React.FC<NewStudentModalProps> = ({ isOpen, onClose, onSave, docentes }) => {
    const [data, setData] = useState({
        nombre: '',
        matricula: '',
        docenteId: '',
        id: `ALUM-${Math.random().toString(36).substr(2, 5)}`
    });

    const handleSave = () => {
        if (!data.nombre || !data.matricula || !data.docenteId) return;
        onSave({
            id: data.id,
            nombre_completo: data.nombre,
            matricula: data.matricula,
            docente_id: data.docenteId,
            grupo: 'A',
            generacion: '2026'
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl relative z-10 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-2xl font-black italic text-zinc-900">Nuevo Estudiante</h3>
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wide mt-1">Ingresar datos manualmente</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center hover:bg-zinc-100 transition-colors"
                            >
                                <X className="w-5 h-5 text-zinc-400" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="space-y-6">

                            {/* Input Group */}
                            <div className="space-y-4">
                                <div className="group relative">
                                    <User className="absolute left-4 top-4 text-zinc-400 w-5 h-5 group-focus-within:text-black transition-colors" />
                                    <input
                                        autoFocus
                                        className="w-full bg-zinc-50 border-2 border-transparent focus:bg-white focus:border-black rounded-2xl pl-12 pr-4 py-4 font-bold text-sm outline-none transition-all placeholder-zinc-400"
                                        placeholder="Nombre Completo"
                                        value={data.nombre}
                                        onChange={e => setData({ ...data, nombre: e.target.value })}
                                    />
                                </div>

                                <div className="group relative">
                                    <Hash className="absolute left-4 top-4 text-zinc-400 w-5 h-5 group-focus-within:text-black transition-colors" />
                                    <input
                                        className="w-full bg-zinc-50 border-2 border-transparent focus:bg-white focus:border-black rounded-2xl pl-12 pr-4 py-4 font-mono text-sm outline-none transition-all placeholder-zinc-400"
                                        placeholder="Matrícula / ID Oficial"
                                        value={data.matricula}
                                        onChange={e => setData({ ...data, matricula: e.target.value })}
                                    />
                                </div>

                                <div className="group relative">
                                    <Briefcase className="absolute left-4 top-4 text-zinc-400 w-5 h-5 group-focus-within:text-black transition-colors" />
                                    <select
                                        className="w-full bg-zinc-50 border-2 border-transparent focus:bg-white focus:border-black rounded-2xl pl-12 pr-10 py-4 font-bold text-sm outline-none transition-all appearance-none cursor-pointer text-zinc-700"
                                        onChange={e => setData({ ...data, docenteId: e.target.value })}
                                        value={data.docenteId}
                                    >
                                        <option value="">Seleccionar Docente Responsable...</option>
                                        {docentes.map(d => (
                                            <option key={d.id} value={d.id}>{d.nombre_completo}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-4 pointer-events-none">
                                        <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 flex gap-4">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-4 rounded-xl font-bold text-xs uppercase tracking-widest text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-[2] bg-zinc-900 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-zinc-900/10 flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Registrar Alumno
                                </button>
                            </div>

                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default NewStudentModal;
