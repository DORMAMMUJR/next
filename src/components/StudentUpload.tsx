import React, { useState } from 'react';
import { Upload, CheckCircle, Search, ArrowLeft } from 'lucide-react';

interface StudentUploadProps {
    onBack: () => void;
    onUpload: (matricula: string, file: File) => void;
}

const StudentUpload: React.FC<StudentUploadProps> = ({ onBack, onUpload }) => {
    const [matricula, setMatricula] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !matricula) return;

        // Aquí simulamos el envío
        onUpload(matricula, file);
        setStatus('success');
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 animate-in zoom-in">
                <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full">
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} />
                    </div>
                    <h2 className="text-3xl font-black italic uppercase mb-2">¡Recibido!</h2>
                    <p className="text-zinc-500 font-medium mb-8">
                        Tu comprobante para la matrícula <span className="font-bold text-black">{matricula}</span> se envió correctamente.
                        <br /><br />
                        Tu estatus se actualizará en cuanto Administración lo valide.
                    </p>
                    <button
                        onClick={onBack}
                        className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                        Volver al Inicio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative">
            {/* Botón regresar */}
            <button onClick={onBack} className="absolute top-6 left-6 p-3 rounded-full hover:bg-zinc-100 transition-colors">
                <ArrowLeft size={24} />
            </button>

            <div className="w-full max-w-md space-y-8 animate-in slide-in-from-bottom-10">
                <div className="text-center">
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter text-zinc-900">Subir Pago<span className="text-green-500">.</span></h1>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-2">Sube tu ticket o captura de transferencia</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Input Matrícula */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-zinc-500 ml-1">Tu Matrícula</label>
                        <div className="relative">
                            <Search className="absolute left-4 top-4 text-zinc-300" size={20} />
                            <input
                                required
                                type="text"
                                value={matricula}
                                onChange={(e) => setMatricula(e.target.value.toUpperCase())}
                                className="w-full bg-zinc-50 border-2 border-zinc-100 focus:border-black rounded-2xl py-4 pl-12 pr-4 font-mono text-lg font-bold uppercase outline-none transition-colors placeholder:text-zinc-400"
                                placeholder="EJ: AGS-2026-001"
                            />
                        </div>
                    </div>

                    {/* Input Archivo (Drag & Drop visual) */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-zinc-500 ml-1">Comprobante</label>
                        <label className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-zinc-300 rounded-2xl cursor-pointer hover:bg-zinc-50 hover:border-black transition-all group overflow-hidden">
                            {file ? (
                                <div className="text-center p-4">
                                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <CheckCircle size={24} />
                                    </div>
                                    <p className="font-bold text-sm text-zinc-800 break-all">{file.name}</p>
                                    <p className="text-[10px] uppercase font-bold text-zinc-500 mt-1">Clic para cambiar</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-10 h-10 mb-3 text-zinc-300 group-hover:text-black transition-colors" />
                                    <p className="mb-2 text-sm text-zinc-600 font-bold"><span className="text-black">Toca aquí</span> para subir foto</p>
                                    <p className="text-xs text-zinc-500">PNG, JPG o PDF</p>
                                </div>
                            )}
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*,application/pdf"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={!matricula || !file}
                        className="w-full bg-black text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-black/20"
                    >
                        Enviar a Revisión
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StudentUpload;
