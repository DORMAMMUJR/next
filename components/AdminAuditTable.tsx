import React from 'react';
import { CityData } from '../types';

interface Props {
  data: CityData;
  onVerifyPayment: (pagoId: string, currentStatus: boolean, alumnoId: string) => void;
  onOpenProof: (url: string) => void;
}

const AdminAuditTable: React.FC<Props> = ({ data, onVerifyPayment }) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-[32px] overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-zinc-100 text-[9px] font-black uppercase tracking-widest text-zinc-500">
          <tr>
            <th className="p-6">Alumno / Matrícula</th>
            <th className="p-6">Docente Responsable</th>
            <th className="p-6 text-center">Estatus Financiero</th>
            <th className="p-6 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {data.alumnos.map((alumno) => {
            // Buscamos al maestro de este alumno
            const docente = data.docentes.find(d => d.id === alumno.docente_id);
            const tieneDeuda = alumno.financial_status === 'DEBT';

            return (
              <tr key={alumno.id} className={`group transition-colors ${tieneDeuda ? 'bg-red-50/40 hover:bg-red-50/60' : 'hover:bg-zinc-50'}`}>
                <td className="p-6">
                  <p className="font-bold text-sm text-black uppercase">{alumno.nombre_completo}</p>
                  <p className="text-[10px] font-mono text-zinc-400 mt-1">{alumno.matricula}</p>
                </td>
                
                <td className="p-6">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] grayscale opacity-50">👤</div>
                      <div>
                        <p className="text-xs font-bold text-zinc-700 uppercase">{docente?.nombre_completo || 'Sin Asignar'}</p>
                        <p className="text-[9px] font-black text-zinc-300 uppercase">{docente?.sede_slug}</p>
                      </div>
                   </div>
                </td>

                <td className="p-6 text-center">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${tieneDeuda ? 'bg-white border-red-200 shadow-sm' : 'bg-green-50 border-green-200'}`}>
                    <div className={`w-2 h-2 rounded-full ${tieneDeuda ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                    <span className={`text-[9px] font-black uppercase tracking-wider ${tieneDeuda ? 'text-red-600' : 'text-green-700'}`}>
                      {tieneDeuda ? 'ADEUDO PENDIENTE' : 'AL CORRIENTE'}
                    </span>
                  </div>
                </td>

                <td className="p-6 text-right">
                    {tieneDeuda ? (
                        <button 
                            onClick={() => onVerifyPayment('dummy_pago_id', false, alumno.id)}
                            className="bg-black text-white text-[10px] font-black uppercase tracking-wider px-5 py-3 rounded-xl hover:bg-next-green hover:shadow-lg transition-all active:scale-95 border-2 border-transparent"
                        >
                            Validar Pago
                        </button>
                    ) : (
                        <span className="text-zinc-300 text-xl font-bold">✓</span>
                    )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAuditTable;