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
        // Si el término no está en el concepto, verificamos si está en el alumno asociado luego.
        // Pero para estadísticas puras de pagos, verificamos concepto aquí o dejamos pasar si el alumno matchea.
        // Estrategia: Dejamos pasar todos aquí y filtramos en la vista de Totales cruzando con alumnos.
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
        <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center flex-1">
                <div className="relative flex-1 min-w-[200px]">
                    <span className="absolute left-3 top-3 text-zinc-400">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Buscar alumno, matrícula o concepto..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-black outline-none uppercase"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                        <label className="text-[8px] font-black uppercase text-zinc-400 ml-1">Desde</label>
                        <input 
                            type="date" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[8px] font-black uppercase text-zinc-400 ml-1">Hasta</label>
                        <input 
                            type="date" 
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                        />
                    </div>
                </div>
            </div>
            {(startDate || endDate || searchTerm) && (
                <button 
                    onClick={() => { setStartDate(''); setEndDate(''); setSearchTerm(''); }}
                    className="text-[9px] font-black uppercase text-red-500 hover:text-red-700 underline"
                >
                    Limpiar Filtros
                </button>
            )}
        </div>

        {/* Dynamic Stats Cards */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Total Validado</p>
            <p className="text-2xl font-black text-next-green font-mono">${stats.verified.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Pendiente Validación</p>
            <p className="text-2xl font-black text-orange-500 font-mono">${stats.pendingValidation.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Cartera Vencida</p>
            <p className="text-2xl font-black text-red-500 font-mono">${stats.overdue.toLocaleString()}</p>
        </div>
         <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Por Cobrar</p>
            <p className="text-2xl font-black text-zinc-400 font-mono">${stats.pending.toLocaleString()}</p>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white border border-zinc-200 rounded-[32px] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-black text-white text-[9px] font-black uppercase tracking-widest">
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
                    <tr className={`hover:bg-zinc-50 transition-colors ${isExpanded ? 'bg-zinc-50' : ''}`}>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs">🍎</div>
                           <div>
                             <p className="font-bold text-sm uppercase text-black">{teacher.nombre_completo}</p>
                             <p className="text-[9px] text-zinc-500 uppercase">{teacher.email}</p>
                           </div>
                        </div>
                      </td>
                      <td className="p-6 text-xs font-mono font-bold text-zinc-600">
                         {teacher.id}
                      </td>
                      <td className="p-6 text-center font-black text-lg">
                         {students.length}
                      </td>
                      <td className="p-6 text-center">
                         {debtCount > 0 ? (
                           <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wide">
                             {debtCount} En Deuda
                           </span>
                         ) : (
                           <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wide">
                             Al Corriente
                           </span>
                         )}
                      </td>
                      <td className="p-6 text-right">
                         <button 
                           onClick={() => toggleTeacher(teacher.id)}
                           className="text-[10px] font-black uppercase tracking-widest border border-black px-4 py-2 rounded-xl hover:bg-black hover:text-white transition-all shadow-sm"
                         >
                           {isExpanded ? 'Ocultar' : 'Auditar'}
                         </button>
                      </td>
                    </tr>

                    {/* Child Rows: Students Table */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={5} className="p-0">
                           <div className="bg-zinc-100/50 p-4 md:p-8 shadow-inner animate-in slide-in-from-top-2 border-b border-zinc-200">
                              <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
                                 <table className="w-full">
                                    <thead className="bg-zinc-50 text-[8px] font-black uppercase tracking-widest text-zinc-500 border-b border-zinc-100">
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
                                          // Filter payments for this specific student based on global filters
                                          const studentPagos = filteredPagos.filter(p => p.alumno_id === student.id);
                                          
                                          // Find the most relevant payment to show (Last one in date range, or just last one)
                                          const lastPayment = studentPagos.sort((a,b) => new Date(b.fecha_pago).getTime() - new Date(a.fecha_pago).getTime())[0];
                                          const hasPending = studentPagos.some(p => p.estatus === 'Pagado' && !p.verified);

                                          return (
                                             <tr key={student.id} className="hover:bg-zinc-50/50">
                                                <td className="p-4 pl-6">
                                                   <p className="text-xs font-bold uppercase text-black">{student.nombre_completo}</p>
                                                   {hasPending && <span className="text-[8px] text-orange-500 font-black uppercase mt-1 block">● Pago pendiente validación</span>}
                                                </td>
                                                <td className="p-4 font-mono text-xs text-zinc-600">
                                                   {student.matricula}
                                                </td>
                                                <td className="p-4">
                                                   <span className={`px-2 py-1 rounded text-[8px] font-black uppercase ${
                                                     student.financial_status === 'DEBT' 
                                                       ? 'bg-red-100 text-red-700' 
                                                       : 'bg-green-100 text-green-700'
                                                   }`}>
                                                     {student.financial_status === 'DEBT' ? 'EN DEUDA' : 'AL CORRIENTE'}
                                                   </span>
                                                </td>
                                                <td className="p-4">
                                                   {lastPayment ? (
                                                      <div className="flex flex-col">
                                                          <span className="text-[10px] font-bold uppercase">{lastPayment.concepto}</span>
                                                          <span className="text-[9px] text-zinc-500 font-mono">${lastPayment.monto} - {new Date(lastPayment.fecha_pago).toLocaleDateString()}</span>
                                                          {lastPayment.proof_url && (
                                                            <button 
                                                                onClick={() => onOpenProof(lastPayment.proof_url!)}
                                                                className="text-blue-600 hover:underline text-[9px] font-bold uppercase mt-1 text-left"
                                                            >
                                                                Ver Voucher
                                                            </button>
                                                          )}
                                                      </div>
                                                   ) : (
                                                      <span className="text-zinc-300 text-[9px] font-bold uppercase">Sin pagos en rango</span>
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
                                                        <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-next-green peer-hover:ring-2 peer-hover:ring-next-green/20"></div>
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
             <div className="p-10 text-center text-zinc-400 font-bold uppercase text-xs">
                No se encontraron alumnos con los filtros seleccionados.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAuditTable;