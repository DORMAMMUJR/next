import React from 'react';
import { X, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';

interface PaymentReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    alumno: any;
    onApprove: () => void;
    onReject: () => void;
}

const PaymentReviewModal: React.FC<PaymentReviewModalProps> = ({ isOpen, onClose, alumno, onApprove, onReject }) => {
    if (!isOpen || !alumno) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="bg-white w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row md:h-auto">

                {/* Lado Izquierdo: La Evidencia (Foto) */}
                <div className="bg-zinc-100 flex-1 relative flex items-center justify-center p-4 border-r border-zinc-200 min-h-[300px]">
                    {/* Simulamos la imagen del comprobante */}
                    <div className="text-center">
                        <div className="w-48 h-64 bg-white shadow-lg mx-auto mb-4 flex items-center justify-center border border-zinc-200 rotate-2 rounded-lg">
                            <span className="text-zinc-300 font-black text-2xl uppercase -rotate-45">Comprobante.jpg</span>
                        </div>
                        <button className="text-xs font-bold text-blue-600 flex items-center justify-center gap-1 hover:underline mx-auto">
                            <ExternalLink size={12} /> Ver tamaño completo
                        </button>
                    </div>

                    <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase backdrop-blur-sm">
                        Enviado hace 2 horas
                    </div>
                </div>

                {/* Lado Derecho: Controles */}
                <div className="w-full md:w-80 p-8 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="font-black italic uppercase text-xl text-zinc-900">Revisión de Pago</h3>
                            <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors"><X size={20} /></button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Alumno</p>
                                <p className="font-bold text-lg text-zinc-900">{alumno.nombre_completo}</p>
                                <p className="font-mono text-xs text-zinc-500">{alumno.matricula}</p>
                            </div>

                            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Monto Esperado</p>
                                <p className="font-mono font-black text-2xl text-zinc-900">$1,500.00</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 mt-8">
                        <button
                            onClick={onApprove}
                            className="w-full bg-green-500 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-green-600 shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 transition-colors"
                        >
                            <CheckCircle size={18} /> Aprobar Pago
                        </button>

                        <button
                            onClick={onReject}
                            className="w-full bg-white border-2 border-red-100 text-red-500 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-red-50 hover:border-red-200 flex items-center justify-center gap-2 transition-colors"
                        >
                            <AlertTriangle size={18} /> Rechazar
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PaymentReviewModal;
