import React, { useState } from 'react';
import { CityData } from '../types';
import { CheckCircle, XCircle, User, AlertTriangle, Lock, ChevronDown, ChevronRight } from 'lucide-react';

interface DashboardProps {
    data: CityData;
    sedeName: string;
    onVerifyPayment: (pagoId: string, status: boolean, alumnoId: string) => void;
    onOpenAddModal: () => void;
}

const OwnerDashboard: React.FC<DashboardProps> = ({ data, sedeName, onVerifyPayment, onOpenAddModal }) => {
    // --- LÓGICA ANTI-ROBO ---
    const COSTO_COLEGIATURA = 1500; // Ajusta este valor al precio real o hazlo dinámico después

    const totalAlumnos = data.alumnos.length;
    const conDeuda = data.alumnos.filter(a => a.financial_status === 'DEBT').length;
    const alCorriente = totalAlumnos - conDeuda;

    // DINERO:
    const dineroReunido = alCorriente * COSTO_COLEGIATURA; // Lo que ya entró a caja
    const dineroFaltante = conDeuda * COSTO_COLEGIATURA;   // Lo que falta por entrar (o lo que se están robando si no reportan)
    const dineroTotalEsperado = totalAlumnos * COSTO_COLEGIATURA; // El potencial máximo

    // Porcentaje de Recaudación
    const porcentajeCobrado = totalAlumnos > 0 ? Math.round((alCorriente / totalAlumnos) * 100) : 0;

    // Filtrar datos según la sede activa
    const docentesDeSede = sedeName === 'GENERAL'
        ? data.docentes
        : data.docentes.filter(d => d.sede_slug === sedeName);

    // Estado para controlar qué profesor está "abierto" (expandido)
    // Guardamos los ID de los profes expandidos
    const [expandedDocentes, setExpandedDocentes] = useState<string[]>([]);

    const toggleDocente = (docenteId: string) => {
        setExpandedDocentes(prev =>
            prev.includes(docenteId) ? prev.filter(id => id !== docenteId) : [...prev, docenteId]
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in pb-20 max-w-7xl mx-auto">

            {/* 1. Encabezado */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest bg-zinc-100 px-3 py-1 rounded-full">
                        Sede: {sedeName}
                    </span>
                    <h2 className="text-4xl mt-4 font-black italic uppercase tracking-tighter">
                        Panel de Control<span className="text-green-500">.</span>
                    </h2>
                </div>
                <button
                    onClick={onOpenAddModal}
                    className="bg-black text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl"
                >
                    + Nuevo Alumno
                </button>
            </div>

            {/* 2. ✨ LA HERRAMIENTA EXTRA: AUDITORÍA FINANCIERA ✨ */}
            <div className="bg-zinc-900 text-white p-8 rounded-[32px] relative overflow-hidden shadow-2xl shadow-black/30">
                <div className="absolute top-0 right-0 p-10 opacity-10"><Lock size={120} /></div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

                    {/* Columna 1: El dinero real */}
                    <div>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">Dinero en Caja (Confirmado)</p>
                        <p className="text-5xl font-black text-green-400 tracking-tighter font-mono bg-zinc-800/50 inline-block px-2 rounded-lg">${dineroReunido.toLocaleString()}</p>
                        <p className="text-xs text-zinc-500 mt-2 font-bold">De <span className="font-mono text-zinc-300">{alCorriente}</span> alumnos pagados</p>
                    </div>

                    {/* Columna 2: La barra de progreso (El detector visual) */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase">
                            <span className="text-zinc-500">Progreso de Cobranza</span>
                            <span className={`font-mono ${porcentajeCobrado < 50 ? "text-red-500" : "text-green-500"}`}>{porcentajeCobrado}%</span>
                        </div>
                        <div className="h-4 w-full bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
                            <div
                                style={{ width: `${porcentajeCobrado}%` }}
                                className={`h-full transition-all duration-1000 ${porcentajeCobrado < 50 ? 'bg-red-500' : 'bg-green-500'
                                    }`}
                            />
                        </div>
                        <p className="text-[10px] text-zinc-500 text-center mt-1">
                            Meta Mensual: <span className="font-mono text-zinc-400">${dineroTotalEsperado.toLocaleString()}</span>
                        </p>
                    </div>

                    {/* Columna 3: ALERTA DE FUGA (Lo que falta) */}
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                        <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="text-yellow-400" size={16} />
                            <p className="text-yellow-400 text-[9px] font-black uppercase tracking-widest">Faltante / Posible Fuga</p>
                        </div>
                        <p className="text-2xl font-black text-white font-mono">${dineroFaltante.toLocaleString()}</p>
                        <p className="text-[10px] text-zinc-400 leading-tight mt-1">
                            Este dinero corresponde a los <strong className="font-mono text-white">{conDeuda} alumnos</strong> marcados como activos pero sin pago registrado.
                        </p>
                    </div>
                </div>
            </div>

            {/* --- SECCIÓN DE LISTAS POR DOCENTE --- */}
            <div className="space-y-6">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">
                    Nómina Académica <span className="text-zinc-500 text-sm not-italic font-bold">({sedeName})</span>
                </h3>

                {docentesDeSede.length === 0 ? (
                    <div className="p-10 text-center text-zinc-500 border border-dashed border-zinc-300 rounded-xl">
                        No hay docentes registrados en esta sede.
                    </div>
                ) : (
                    docentesDeSede.map((docente) => {
                        // Buscamos SOLO los alumnos de ESTE maestro
                        const misAlumnos = data.alumnos.filter(a => a.docente_id === docente.id);
                        const totalDeuda = misAlumnos.filter(a => a.financial_status === 'DEBT').length;
                        const isExpanded = expandedDocentes.includes(docente.id);

                        return (
                            <div key={docente.id} className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md">

                                {/* 1. ENCABEZADO DEL MAESTRO (Clickeable) */}
                                <button
                                    onClick={() => toggleDocente(docente.id)}
                                    className="w-full flex items-center justify-between p-6 bg-white hover:bg-zinc-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-full transition-colors ${isExpanded ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                                            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                        </div>
                                        <div className="text-left">
                                            <p className="font-black text-lg text-zinc-800 uppercase italic">{docente.nombre_completo}</p>
                                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                                                <span className="font-mono text-black">{misAlumnos.length}</span> Alumnos asignados
                                            </p>
                                        </div>
                                    </div>

                                    {/* Resumen rápido de deuda del grupo */}
                                    <div className="flex items-center gap-4">
                                        {totalDeuda > 0 && (
                                            <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                                <XCircle size={12} /> <span className="font-mono">{totalDeuda}</span> Deudores
                                            </span>
                                        )}
                                        <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                                            <User size={20} className="text-zinc-500" />
                                        </div>
                                    </div>
                                </button>

                                {/* 2. TABLA DE ALUMNOS (Solo si está expandido) */}
                                {isExpanded && (
                                    <div className="border-t border-zinc-100 bg-zinc-50/50 p-4 animate-in slide-in-from-top-2">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">
                                                    <tr>
                                                        <th className="p-4 pl-6">Estudiante</th>
                                                        <th className="p-4">Matrícula</th>
                                                        <th className="p-4 text-center">Estado de Pago</th>
                                                        <th className="p-4 text-right">Acción</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-zinc-200/50 text-sm">
                                                    {misAlumnos.map(alumno => (
                                                        <tr key={alumno.id} className="hover:bg-white transition-colors">
                                                            <td className="p-4 pl-6 font-bold text-zinc-700">{alumno.nombre_completo}</td>
                                                            <td className="p-4 font-mono text-xs text-zinc-500">{alumno.matricula}</td>
                                                            <td className="p-4 text-center">
                                                                {alumno.financial_status === 'DEBT' ? (
                                                                    <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold">
                                                                        <XCircle size={12} /> Pendiente
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">
                                                                        <CheckCircle size={12} /> Pagado
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="p-4 text-right">
                                                                {alumno.financial_status === 'DEBT' ? (
                                                                    <button
                                                                        onClick={() => {
                                                                            if (window.confirm(`¿Confirmar que recibiste $${COSTO_COLEGIATURA} de ${alumno.nombre_completo}?`)) {
                                                                                onVerifyPayment('manual', false, alumno.id);
                                                                            }
                                                                        }}
                                                                        className="bg-black text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-colors shadow-lg shadow-black/10"
                                                                    >
                                                                        Cobrar
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => {
                                                                            if (window.confirm(`¿Marcar a ${alumno.nombre_completo} nuevamente con deuda?`)) {
                                                                                onVerifyPayment('manual', true, alumno.id);
                                                                            }
                                                                        }}
                                                                        className="text-zinc-300 hover:text-red-500 font-bold text-xs uppercase tracking-widest transition-colors"
                                                                    >
                                                                        Revertir
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default OwnerDashboard;
