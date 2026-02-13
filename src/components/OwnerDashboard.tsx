import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, AlertCircle, TrendingUp } from 'lucide-react';
import AdminAuditTable from './AdminAuditTable';
import { CityData } from '../types';

interface DashboardProps {
    data: CityData;
    onVerifyPayment: (pagoId: string, status: boolean, alumnoId: string) => void;
    onOpenAddModal: () => void;
}

const OwnerDashboard: React.FC<DashboardProps> = ({ data, onVerifyPayment, onOpenAddModal }) => {
    // Cálculos Reales
    const totalAlumnos = data.alumnos.length;
    const deudores = data.alumnos.filter(a => a.financial_status === 'DEBT').length;
    const alCorriente = totalAlumnos - deudores;
    const ingresoEstimado = alCorriente * 1500; // Ejemplo: $1500 por colegiatura

    // Datos para la gráfica (Simulados para el demo visual)
    const chartData = [
        { name: 'Sem 1', ingresos: 4000 },
        { name: 'Sem 2', ingresos: 3000 },
        { name: 'Sem 3', ingresos: ingresoEstimado },
        { name: 'Sem 4', ingresos: ingresoEstimado + 2000 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in pb-20 max-w-7xl mx-auto">
            {/* Encabezado */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-zinc-100 pb-6">
                <div>
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter">Dashboard<span className="text-green-500">.</span></h2>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Resumen Financiero & Académico</p>
                </div>
                <button
                    onClick={onOpenAddModal}
                    className="bg-black text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2 shadow-xl shadow-black/10"
                >
                    <Users size={16} /> Nuevo Alumno
                </button>
            </div>

            {/* Tarjetas de Estadísticas (Stat Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-zinc-50 rounded-xl"><Users className="text-black" size={24} /></div>
                        <span className="text-[10px] font-black uppercase text-zinc-400 bg-zinc-50 px-2 py-1 rounded">Total Activos</span>
                    </div>
                    <p className="text-4xl font-black tracking-tighter">{totalAlumnos}</p>
                    <p className="text-xs text-zinc-400 mt-1 font-bold">Matrícula General</p>
                </div>

                <div className="bg-black text-white p-6 rounded-2xl shadow-xl shadow-black/20">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-zinc-800 rounded-xl"><DollarSign className="text-green-400" size={24} /></div>
                        <span className="text-[10px] font-black uppercase text-zinc-500 bg-zinc-900 px-2 py-1 rounded">Ingresos</span>
                    </div>
                    <p className="text-4xl font-black tracking-tighter">${ingresoEstimado.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <TrendingUp size={14} className="text-green-400" />
                        <p className="text-xs text-zinc-400 font-bold">Cobranza al día</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-6 opacity-5"><AlertCircle size={100} className="text-red-500" /></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-50 rounded-xl"><AlertCircle className="text-red-500" size={24} /></div>
                        <span className="text-[10px] font-black uppercase text-red-300 bg-red-50 px-2 py-1 rounded">Atención</span>
                    </div>
                    <p className="text-4xl font-black tracking-tighter text-red-500">{deudores}</p>
                    <p className="text-xs text-red-400 mt-1 font-bold">Pagos Pendientes</p>
                </div>
            </div>

            {/* Gráfica y Tabla */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sección Gráfica */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm h-[400px]">
                    <h3 className="text-lg font-black italic uppercase mb-6">Tendencia de Ingresos</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#a1a1aa' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#a1a1aa' }} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                            <Area type="monotone" dataKey="ingresos" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorIngresos)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Sección Lista Rápida (Reutilizando tu tabla existente) */}
                <div className="lg:col-span-3 bg-white border border-zinc-100 rounded-3xl p-2 shadow-sm">
                    <div className="p-6 border-b border-zinc-50">
                        <h3 className="text-lg font-black italic uppercase">Auditoría de Pagos</h3>
                    </div>
                    <AdminAuditTable data={data} onVerifyPayment={onVerifyPayment} onOpenProof={() => { }} />
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
