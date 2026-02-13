import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Hash, Plus, X, MapPin, DollarSign, GraduationCap } from 'lucide-react';
import { Docente } from '../types';

interface NewStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    docentes: Docente[];
    activeSede?: string;
}

const NewStudentModal: React.FC<NewStudentModalProps> = ({ isOpen, onClose, onSave, docentes, activeSede }) => {
    const [data, setData] = useState({
        nombre: '',
        matriculaManual: '',
        docenteId: '',
        sede: activeSede === 'GENERAL' ? 'aguascalientes' : (activeSede || 'aguascalientes'),
        colegiatura: '1500',
        id: `ALUM-${Math.random().toString(36).substr(2, 5)}`
    });

    // Filtramos: Solo mostramos maestros que estén en la sede seleccionada
    const maestrosFiltrados = docentes.filter(d =>
        d.sede_slug === data.sede || d.sede === data.sede
    );

    const handleSave = () => {
        if (!data.nombre || !data.docenteId) return;
        // Generamos matrícula si no la ponen manual
        const sedePrefix = data.sede.substring(0, 3).toUpperCase();
        const matriculaFinal = data.matriculaManual || `${sedePrefix}-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`;

        onSave({
            id: data.id,
            nombre_completo: data.nombre,
            matricula: matriculaFinal,
            docente_id: data.docenteId,
            sede: data.sede,
            colegiatura: data.colegiatura,
            financial_status: 'DEBT',
            historial_pagos: [0, 0, 0, 0, 0],
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
                                <h3 className="text-2xl font-black italic text-zinc-900">Inscribir Alumno</h3>
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

                            <div className="space-y-4">
                                {/* Nombre */}
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

                                {/* Matrícula (Opcional - auto-generada si vacía) */}
                                <div className="group relative">
                                    <Hash className="absolute left-4 top-4 text-zinc-400 w-5 h-5 group-focus-within:text-black transition-colors" />
                                    <input
                                        className="w-full bg-zinc-50 border-2 border-transparent focus:bg-white focus:border-black rounded-2xl pl-12 pr-4 py-4 font-mono text-sm outline-none transition-all placeholder-zinc-400"
                                        placeholder="Matrícula (auto-generada si vacío)"
                                        value={data.matriculaManual}
                                        onChange={e => setData({ ...data, matriculaManual: e.target.value })}
                                    />
                                </div>

                                {/* Sede */}
                                <div className="group relative">
                                    <MapPin className="absolute left-4 top-4 text-zinc-400 w-5 h-5 group-focus-within:text-black transition-colors" />
                                    <select
                                        className="w-full bg-zinc-50 border-2 border-transparent focus:bg-white focus:border-black rounded-2xl pl-12 pr-10 py-4 font-bold text-sm outline-none transition-all appearance-none cursor-pointer text-zinc-700"
                                        value={data.sede}
                                        onChange={e => setData({ ...data, sede: e.target.value, docenteId: '' })}
                                    >
                                        <option value="aguascalientes">Aguascalientes</option>
                                        <option value="cdmx">CDMX</option>
                                        <option value="monterrey">Monterrey</option>
                                        <option value="guadalajara">Guadalajara</option>
                                        <option value="queretaro">Querétaro</option>
                                        <option value="cancun">Cancún</option>
                                    </select>
                                    <div className="absolute right-4 top-4 pointer-events-none">
                                        <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>

                                {/* Docente (filtrado por sede) */}
                                <div className="group relative">
                                    <GraduationCap className="absolute left-4 top-4 text-zinc-400 w-5 h-5 group-focus-within:text-black transition-colors" />
                                    <select
                                        required
                                        className="w-full bg-zinc-50 border-2 border-transparent focus:bg-white focus:border-black rounded-2xl pl-12 pr-10 py-4 font-bold text-sm outline-none transition-all appearance-none cursor-pointer text-zinc-700"
                                        onChange={e => setData({ ...data, docenteId: e.target.value })}
                                        value={data.docenteId}
                                    >
                                        <option value="">Seleccionar Docente...</option>
                                        {maestrosFiltrados.length > 0 ? (
                                            maestrosFiltrados.map(d => (
                                                <option key={d.id} value={d.id}>{d.nombre_completo || d.nombre}</option>
                                            ))
                                        ) : (
                                            <option disabled>No hay maestros en esta sede</option>
                                        )}
                                    </select>
                                    <div className="absolute right-4 top-4 pointer-events-none">
                                        <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                                <p className="text-[10px] text-zinc-500 font-medium ml-2 -mt-2">
                                    * Solo se muestran maestros de {data.sede}
                                </p>

                                {/* Colegiatura */}
                                <div className="group relative">
                                    <DollarSign className="absolute left-4 top-4 text-zinc-400 w-5 h-5 group-focus-within:text-black transition-colors" />
                                    <input
                                        className="w-full bg-zinc-50 border-2 border-transparent focus:bg-white focus:border-black rounded-2xl pl-12 pr-4 py-4 font-mono text-sm outline-none transition-all placeholder-zinc-400"
                                        placeholder="Colegiatura mensual"
                                        value={data.colegiatura}
                                        onChange={e => setData({ ...data, colegiatura: e.target.value })}
                                    />
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
                                    Confirmar Inscripción
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
