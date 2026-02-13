import React, { useState, useMemo } from 'react';
import { CityData, Pago } from '../types';

interface AdminAuditTableProps {
  data: CityData;
  onVerifyPayment: (pagoId: string, currentStatus: boolean, alumnoId: string) => void;
  onOpenProof: (url: string) => void;
}

const AdminAuditTable: React.FC<AdminAuditTableProps> = ({ data, onVerifyPayment, onOpenProof }) => {
  const [expandedTeachers, setExpandedTeachers] = useState<Set<string>>(new Set());
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const toggleTeacher = (teacherId: string) => {
    const newExpanded = new Set(expandedTeachers);
    if (newExpanded.has(teacherId)) {
      newExpanded.delete(teacherId);
    } else {
      newExpanded.add(teacherId);
    }
    setExpandedTeachers(newExpanded);
  };

  // 1. Filtrar Pagos primero (Por Fechas y Búsqueda de Concepto)
  const filteredPagos = useMemo(() => {
    return data.pagos.filter(p => {
      // Filtro de Fechas
      const pDate = new Date(p.fecha_pago);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      if (start && pDate < start) return false;
      if (end && pDate > end) return false;

      // Filtro de Búsqueda (si aplica al concepto)
      if (searchTerm && !p.concepto.toLowerCase().includes(searchTerm.toLowerCase())) {
        return true; 
      }

      return true;
    });
  }, [data.pagos, startDate, endDate, searchTerm]);

  // 2. Filtrar Alumnos (Por Nombre/Matrícula)
  const filteredAlumnos = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return data.alumnos.filter(a => {
      const matchName = a.nombre_completo.toLowerCase().includes(term);
      const matchMatricula = a.matricula?.toLowerCase().includes(term);
      
      // También incluir si el alumno tiene un pago que coincida con el término (ej: "Inscripción")
      const hasMatchingPayment = data.pagos.some(p => 
        p.alumno_id === a.id && p.concepto.toLowerCase().includes(term)
      );

      return matchName || matchMatricula || hasMatchingPayment;
    });
  }, [data.alumnos, data.pagos, searchTerm]);

  // 3. Calcular Totales Dinámicos (Solo de los alumnos y fechas filtrados)
  const stats = useMemo(() => {
    const relevantStudentIds = new Set(filteredAlumnos.map(a => a.id));
    
    // Usamos filteredPagos (que ya tiene fechas) y cruzamos con alumnos visibles
    const activePagos = filteredPagos.filter(p => relevantStudentIds.has(p.alumno_id));

    return activePagos.reduce((acc, curr) => {
      const monto = Number(curr.monto);
      if (curr.estatus === 'Pagado' && curr.verified) {
        acc.verified += monto;
      } else if (curr.estatus === 'Pagado' && !curr.verified) {
        acc.pendingValidation += monto;
      } else if (curr.estatus === 'Vencido') {
        acc.overdue += monto;
      } else {
        acc.pending += monto;
      }
      return acc;
    }, { verified: 0, pendingValidation: 0, overdue: 0, pending: 0 });
  }, [filteredPagos, filteredAlumnos]);

  // 4. Agrupar alumnos filtrados por docente para la tabla
  const studentsByTeacher = useMemo(() => {
    const groups: Record<string, typeof data.alumnos> = {};
    data.docentes.forEach(d => { groups[d.id] = []; });
    groups['UNASSIGNED'] = [];

    filteredAlumnos.forEach(a => {
      const tId = a.docente_id || 'UNASSIGNED';
      if (groups[tId]) {
        groups[tId].push(a);
      } else {
        groups['UNASSIGNED'].push(a);
      }
    });
    return groups;
  }, [data.docentes, filteredAlumnos]);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* --- CONTROL BAR & STATS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Filters */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center flex-1">
                <div className="relative flex-1 min-w-[200px]">
                    <span className="absolute left-4 top-3.5 text-zinc-400">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Buscar alumno, matrícula o concepto..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-black outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold uppercase text-zinc-400 ml-1 mb-1">Desde</label>
                        <input 
                            type="date" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xs font-bold outline-none"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold uppercase text-zinc-400 ml-1 mb-1">Hasta</label>
                        <input 
                            type="date" 
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xs font-bold outline-none"
                        />
                    </div>
                </div>
            </div>
            {(startDate || endDate || searchTerm) && (
                <button 
                    onClick={() => { setStartDate(''); setEndDate(''); setSearchTerm(''); }}
                    className="text-xs font-bold uppercase text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                >
                    Limpiar Filtros
                </button>
            )}
        </div>

        {/* Dynamic Stats Cards */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Validado</p>
            <p className="text-3xl font-black text-next-green font-mono mt-2">${stats.verified.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Pendiente Validación</p>
            <p className="text-3xl font-black text-orange-500 font-mono mt-2">${stats.pendingValidation.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Cartera Vencida</p>
            <p className="text-3xl font-black text-red-500 font-mono mt-2">${stats.overdue.toLocaleString()}</p>
        </div>
         <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Por Cobrar</p>
            <p className="text-3xl font-black text-zinc-300 font-mono mt-2">${stats.pending.toLocaleString()}</p>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white border border-zinc-200 rounded-[32px] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-black text-white text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="p-6">Responsable Académico</th>
                <th className="p-6">Grupo / ID</th>
                <th className="p-6 text-center">Alumnos Filtrados</th>
                <th className="p-6 text-center">Estatus Financiero</th>
                <th className="p-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {data.docentes.map(teacher => {
                const students = studentsByTeacher[teacher.id] || [];
                const isExpanded = expandedTeachers.has(teacher.id);
                const debtCount = students.filter(s => s.financial_status === 'DEBT').length;
                
                if (students.length === 0) return null; 

                return (
                  <React.Fragment key={teacher.id}>
                    {/* Parent Row: Teacher */}
                    <tr className={`transition-all duration-200 cursor-pointer ${isExpanded ? 'bg-zinc-50' : 'hover:bg-zinc-50'}`} onClick={() => toggleTeacher(teacher.id)}>
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-colors ${isExpanded ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                             {isExpanded ? '▼' : '▶'}
                           </div>
                           <div>
                             <p className="font-bold text-sm uppercase text-black">{teacher.nombre_completo}</p>
                             <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{teacher.email}</p>
                           </div>
                        </div>
                      </td>
                      <td className="p-6 text-xs font-mono font-bold text-zinc-600">
                         {teacher.id}
                      </td>
                      <td className="p-6 text-center font-black text-xl text-zinc-800">
                         {students.length}
                      </td>
                      <td className="p-6 text-center">
                         {debtCount > 0 ? (
                           <span className="bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-red-100">
                             {debtCount} En Deuda
                           </span>
                         ) : (
                           <span className="bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-green-100">
                             Al Corriente
                           </span>
                         )}
                      </td>
                      <td className="p-6 text-right">
                         <button 
                           onClick={(e) => { e.stopPropagation(); toggleTeacher(teacher.id); }}
                           className="text-[10px] font-black uppercase tracking-widest border border-zinc-200 px-5 py-2.5 rounded-xl hover:bg-black hover:text-white hover:border-black transition-all shadow-sm"
                         >
                           {isExpanded ? 'Cerrar' : 'Auditar'}
                         </button>
                      </td>
                    </tr>

                    {/* Child Rows: Students Table */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={5} className="p-0">
                           <div className="bg-zinc-50/50 p-6 md:p-8 animate-in slide-in-from-top-2 border-b border-zinc-200 relative">
                              {/* Visual connector line */}
                              <div className="absolute left-10 top-0 bottom-8 w-0.5 bg-zinc-200"></div>
                              
                              <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm relative z-10 ml-8">
                                 <table className="w-full">
                                    <thead className="bg-zinc-50 text-[9px] font-black uppercase tracking-widest text-zinc-500 border-b border-zinc-100">
                                       <tr>
                                          <th className="p-4 pl-6">Alumno</th>
                                          <th className="p-4">Matrícula</th>
                                          <th className="p-4">Estatus Alumno</th>
                                          <th className="p-4">Ultimo Pago</th>
                                          <th className="p-4 text-right pr-6">Validación Dueña</th>
                                       </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-50">
                                       {students.map(student => {
                                          const studentPagos = filteredPagos.filter(p => p.alumno_id === student.id);
                                          const lastPayment = studentPagos.sort((a,b) => new Date(b.fecha_pago).getTime() - new Date(a.fecha_pago).getTime())[0];
                                          const hasPending = studentPagos.some(p => p.estatus === 'Pagado' && !p.verified);

                                          return (
                                             <tr key={student.id} className="hover:bg-zinc-50/50 transition-colors">
                                                <td className="p-4 pl-6">
                                                   <p className="text-xs font-bold uppercase text-black">{student.nombre_completo}</p>
                                                   {hasPending && <span className="text-[9px] text-orange-500 font-bold uppercase mt-1 flex items-center gap-1">
                                                      <span className="w-2 h-2 rounded-full bg-orange-500"></span> Pago pendiente
                                                   </span>}
                                                </td>
                                                <td className="p-4 font-mono text-xs text-zinc-500">
                                                   {student.matricula}
                                                </td>
                                                <td className="p-4">
                                                   <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wide border ${
                                                     student.financial_status === 'DEBT' 
                                                       ? 'bg-red-50 text-red-700 border-red-100' 
                                                       : 'bg-green-50 text-green-700 border-green-100'
                                                   }`}>
                                                     {student.financial_status === 'DEBT' ? 'EN DEUDA' : 'AL CORRIENTE'}
                                                   </span>
                                                </td>
                                                <td className="p-4">
                                                   {lastPayment ? (
                                                      <div className="flex flex-col">
                                                          <span className="text-[10px] font-bold uppercase text-zinc-800">{lastPayment.concepto}</span>
                                                          <span className="text-[10px] text-zinc-500 font-mono">${lastPayment.monto} <span className="mx-1">•</span> {new Date(lastPayment.fecha_pago).toLocaleDateString()}</span>
                                                          {lastPayment.proof_url && (
                                                            <button 
                                                                onClick={() => onOpenProof(lastPayment.proof_url!)}
                                                                className="text-blue-600 hover:text-blue-800 hover:underline text-[9px] font-bold uppercase mt-1 text-left flex items-center gap-1"
                                                            >
                                                                <span>📎</span> Ver Voucher
                                                            </button>
                                                          )}
                                                      </div>
                                                   ) : (
                                                      <span className="text-zinc-300 text-[10px] font-bold uppercase italic">Sin pagos en rango</span>
                                                   )}
                                                </td>
                                                <td className="p-4 text-right pr-6">
                                                  {lastPayment && (
                                                     <label className="inline-flex items-center cursor-pointer group" title="Validar Pago">
                                                        <input 
                                                          type="checkbox" 
                                                          checked={lastPayment.verified || false} 
                                                          onChange={() => onVerifyPayment(lastPayment.id, lastPayment.verified || false, student.id)}
                                                          className="sr-only peer"
                                                        />
                                                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-next-green peer-checked:after:border-transparent transition-colors shadow-inner"></div>
                                                     </label>
                                                  )}
                                                </td>
                                             </tr>
                                          );
                                       })}
                                    </tbody>
                                 </table>
                              </div>
                           </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          {Object.keys(studentsByTeacher).length === 0 && (
             <div className="p-16 text-center">
                <p className="text-4xl mb-4 grayscale opacity-20">📂</p>
                <p className="text-zinc-400 font-bold uppercase text-sm">No se encontraron alumnos con los filtros seleccionados.</p>
                <button onClick={() => { setSearchTerm(''); setStartDate(''); setEndDate(''); }} className="mt-4 text-next-green font-bold text-xs uppercase hover:underline">Limpiar Filtros</button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAuditTable;