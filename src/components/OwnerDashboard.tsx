import React from 'react';
import { CityData } from '../types';
import { CheckCircle, XCircle, CreditCard, User, AlertTriangle, TrendingUp, Lock } from 'lucide-react';

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

    return (
        <div className="space-y-8 animate-in fade-in pb-20 max-w-7xl mx-auto">

            {/* 1. Encabezado */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest bg-zinc-100 px-3 py-1 rounded-full">
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
                        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-2">Dinero en Caja (Confirmado)</p>
                        <p className="text-5xl font-black text-green-400 tracking-tighter">${dineroReunido.toLocaleString()}</p>
                        <p className="text-xs text-zinc-500 mt-2 font-bold">De {alCorriente} alumnos pagados</p>
                    </div>

                    {/* Columna 2: La barra de progreso (El detector visual) */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase">
                            <span className="text-zinc-400">Progreso de Cobranza</span>
                            <span className={porcentajeCobrado < 50 ? "text-red-500" : "text-green-500"}>{porcentajeCobrado}%</span>
                        </div>
                        <div className="h-4 w-full bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
                            <div
                                style={{ width: `${porcentajeCobrado}%` }}
                                className={`h-full transition-all duration-1000 ${porcentajeCobrado < 50 ? 'bg-red-500' : 'bg-green-500'
                                    }`}
                            />
                        </div>
                        <p className="text-[10px] text-zinc-500 text-center mt-1">
                            Meta Mensual: ${dineroTotalEsperado.toLocaleString()}
                        </p>
                    </div>

                    {/* Columna 3: ALERTA DE FUGA (Lo que falta) */}
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                        <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="text-yellow-400" size={16} />
                            <p className="text-yellow-400 text-[9px] font-black uppercase tracking-widest">Faltante / Posible Fuga</p>
                        </div>
                        <p className="text-2xl font-black text-white">${dineroFaltante.toLocaleString()}</p>
                        <p className="text-[10px] text-zinc-400 leading-tight mt-1">
                            Este dinero corresponde a los <strong>{conDeuda} alumnos</strong> marcados como activos pero sin pago registrado.
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. Tabla de Cobranza (Ya la tenías, la mantenemos igual de útil) */}
            <div className="bg-white border border-zinc-200 rounded-[32px] overflow-hidden shadow-lg shadow-zinc-200/50">
                <div className="p-8 border-b border-zinc-100 flex justify-between items-center">
                    <h3 className="text-xl font-black italic uppercase">Detalle de Alumnos</h3>
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Gestión Individual</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-50/50 text-[9px] font-black uppercase text-zinc-400 tracking-widest">
                            <tr>
                                <th className="p-6 pl-8">Alumno</th>
                                <th className="p-6">Docente</th>
                                <th className="p-6 text-center">Estatus</th>
                                <th className="p-6 text-right pr-8">Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {data.alumnos.length === 0 ? (
                                <tr><td colSpan={4} className="p-10 text-center text-zinc-400 font-bold">No hay alumnos registrados.</td></tr>
                            ) : (
                                data.alumnos.map((alumno) => {
                                    const tieneDeuda = alumno.financial_status === 'DEBT';
                                    const docente = data.docentes.find(d => d.id === alumno.docente_id);

                                    return (
                                        <tr key={alumno.id} className="hover:bg-zinc-50 transition-colors group">
                                            <td className="p-6 pl-8">
                                                <p className="font-bold text-sm text-zinc-900">{alumno.nombre_completo}</p>
                                                <p className="font-mono text-xs text-zinc-400 mt-1">{alumno.matricula || 'S/M'}</p>
                                            </td>
                                            <td className="p-6">
                                                {docente ? (
                                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-100 text-xs font-bold text-zinc-600">
                                                        <User size={12} /> {docente.nombre_completo}
                                                    </span>
                                                ) : <span className="text-zinc-300 text-xs font-bold">Sin asignar</span>}
                                            </td>
                                            <td className="p-6 text-center">
                                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${tieneDeuda ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'
                                                    }`}>
                                                    {tieneDeuda ? <XCircle size={14} /> : <CheckCircle size={14} />}
                                                    {tieneDeuda ? 'Sin Pago' : 'Pagado'}
                                                </div>
                                            </td>
                                            <td className="p-6 text-right pr-8">
                                                {tieneDeuda ? (
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm(`¿Confirmar que recibiste $${COSTO_COLEGIATURA} de ${alumno.nombre_completo}?`)) {
                                                                onVerifyPayment('manual', false, alumno.id);
                                                            }
                                                        }}
                                                        className="bg-black text-white px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-green-600 hover:shadow-lg transition-all flex items-center gap-2 ml-auto"
                                                    >
                                                        <CreditCard size={14} /> Cobrar
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            // Opción para revertir pago si fue error (seguridad)
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
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
