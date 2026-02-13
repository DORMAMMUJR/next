
import React, { useState } from 'react';
import { CityData } from '../types';

interface AdminAuditTableProps {
  data: CityData;
  onVerifyPayment: (pagoId: string, currentStatus: boolean, alumnoId: string) => void;
  onOpenProof: (url: string) => void;
}

const AdminAuditTable: React.FC<AdminAuditTableProps> = ({ data, onVerifyPayment, onOpenProof }) => {
  const [expandedTeachers, setExpandedTeachers] = useState<Set<string>>(new Set());

  const toggleTeacher = (teacherId: string) => {
    const newExpanded = new Set(expandedTeachers);
    if (newExpanded.has(teacherId)) {
      newExpanded.delete(teacherId);
    } else {
      newExpanded.add(teacherId);
    }
    setExpandedTeachers(newExpanded);
  };

  // Group students by teacher
  const studentsByTeacher = React.useMemo(() => {
    const groups: Record<string, typeof data.alumnos> = {};
    // Initialize groups for all teachers
    data.docentes.forEach(d => {
       groups[d.id] = [];
    });
    // Add 'Unassigned' group
    groups['UNASSIGNED'] = [];

    data.alumnos.forEach(a => {
      const tId = a.docente_id || 'UNASSIGNED';
      if (groups[tId]) {
        groups[tId].push(a);
      } else {
        // Fallback if teacher ID doesn't exist in doc list
        groups['UNASSIGNED'].push(a);
      }
    });
    return groups;
  }, [data]);

  return (
    <div className="bg-white border border-zinc-200 rounded-[32px] overflow-hidden shadow-xl animate-in fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-black text-white text-[9px] font-black uppercase tracking-widest">
            <tr>
              <th className="p-6">Responsable Académico</th>
              <th className="p-6">Grupo / ID</th>
              <th className="p-6 text-center">Total Alumnos</th>
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
                           {debtCount} con Adeudo
                         </span>
                       ) : (
                         <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wide">
                           0% Morosidad
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
                                        <th className="p-4">Estatus Pago</th>
                                        <th className="p-4">Evidencia</th>
                                        <th className="p-4 text-right pr-6">Validación Dueña</th>
                                     </tr>
                                  </thead>
                                  <tbody className="divide-y divide-zinc-50">
                                     {students.map(student => {
                                        const studentPagos = data.pagos.filter(p => p.alumno_id === student.id);
                                        const lastPayment = studentPagos.sort((a,b) => new Date(b.fecha_pago).getTime() - new Date(a.fecha_pago).getTime())[0];
                                        const hasPending = studentPagos.some(p => p.estatus === 'Pagado' && !p.verified);

                                        return (
                                           <tr key={student.id} className="hover:bg-zinc-50/50">
                                              <td className="p-4 pl-6">
                                                 <p className="text-xs font-bold uppercase text-black">{student.nombre_completo}</p>
                                                 {hasPending && <span className="text-[8px] text-orange-500 font-black uppercase mt-1 block">● Pago por revisar</span>}
                                              </td>
                                              <td className="p-4 font-mono text-xs text-zinc-600">
                                                 {student.matricula}
                                              </td>
                                              <td className="p-4">
                                                 {student.financial_status === 'CLEAN' ? (
                                                    <span className="text-green-600 text-[9px] font-black uppercase bg-green-50 px-2 py-1 rounded">● Al Corriente</span>
                                                 ) : (
                                                    <span className="text-red-600 text-[9px] font-black uppercase bg-red-50 px-2 py-1 rounded">● Adeudo</span>
                                                 )}
                                              </td>
                                              <td className="p-4">
                                                 {lastPayment && lastPayment.proof_url ? (
                                                    <button 
                                                      onClick={() => onOpenProof(lastPayment.proof_url!)}
                                                      className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase hover:bg-blue-100 transition-colors"
                                                    >
                                                      📄 Ver Voucher
                                                    </button>
                                                 ) : (
                                                    <span className="text-zinc-300 text-[9px] font-bold uppercase">Sin Archivo</span>
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
      </div>
    </div>
  );
};

export default AdminAuditTable;
