import React, { useState, useEffect } from 'react';
import { Search, Upload, CheckCircle, MapPin, ArrowLeft } from 'lucide-react';

interface StudentUploadProps {
    onBack: () => void;
    onUpload: (matricula: string, file: File) => void;
}

const StudentUpload: React.FC<StudentUploadProps> = ({ onBack, onUpload }) => {
    const [step, setStep] = useState(1); // 1: Identificación, 2: Subida, 3: Éxito
    const [matricula, setMatricula] = useState('');
    const [student, setStudent] = useState<{ nombre: string; sede: string; id: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    // Consulta rápida a la base de datos (Postgres) al escribir la matrícula
    useEffect(() => {
        if (matricula.length >= 7) { // Ej: AGS-2026-001
            setLoading(true);
            // Aquí harías: fetch(`/api/verificar/${matricula}`)
            setTimeout(() => {
                setStudent({ nombre: "Juan Pérez Test", sede: "Aguascalientes", id: 1 });
                setLoading(false);
            }, 800);
        } else {
            setStudent(null);
        }
    }, [matricula]);

    const handleFinish = () => {
        if (student && file) {
            onUpload(matricula, file);
            setStep(3);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white flex flex-col items-center justify-center p-6 relative">
            <button onClick={onBack} className="absolute top-8 left-8 p-3 rounded-full hover:bg-zinc-100 transition-colors">
                <ArrowLeft size={24} className="text-zinc-950" />
            </button>

            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-5xl font-black italic uppercase tracking-tighter text-zinc-950">Pagos NX<span className="text-green-500">.</span></h1>
                    <p className="text-zinc-600 font-bold uppercase tracking-widest text-[10px] mt-2 italic">Sin filas, sin contraseñas.</p>
                </div>

                {step < 3 && (
                    <div className="bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 border-2 border-zinc-100 p-8 rounded-[2.5rem] shadow-sm space-y-6">
                        {/* PASO 1: MATRÍCULA */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-zinc-900 ml-1">Tu Matrícula Oficial</label>
                            <div className="relative">
                                <Search className={`absolute left-4 top-4 transition-colors ${student ? 'text-green-500' : 'text-zinc-400'}`} size={20} />
                                <input
                                    type="text"
                                    value={matricula}
                                    onChange={(e) => setMatricula(e.target.value.toUpperCase())}
                                    className="w-full bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white border-2 border-zinc-200 focus:border-zinc-950 rounded-2xl py-4 pl-12 pr-4 font-mono text-xl font-bold uppercase outline-none transition-all text-zinc-950"
                                    placeholder="AGS-XXXX-XXX"
                                />
                            </div>
                        </div>

                        {/* DETECCIÓN AUTOMÁTICA */}
                        {loading && <p className="text-center text-xs font-bold text-zinc-400 animate-pulse italic">Buscando en sistema...</p>}

                        {student && (
                            <div className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white p-5 rounded-2xl border-2 border-green-500 animate-in zoom-in-95">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-zinc-950 text-white rounded-full flex items-center justify-center font-black">
                                        {String(student.nombre || "U").charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-green-600">Alumno Identificado ✅</p>
                                        <h3 className="text-lg font-black text-zinc-950 uppercase italic">{student.nombre}</h3>
                                        <p className="text-xs font-bold text-zinc-500 flex items-center gap-1"><MapPin size={10} /> {student.sede}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SUBIDA DE COMPROBANTE */}
                        {student && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                                <label className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-[2rem] cursor-pointer transition-all ${file ? 'border-green-500 bg-green-50' : 'border-zinc-300 hover:border-zinc-950 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white'}`}>
                                    {file ? (
                                        <div className="text-center p-4">
                                            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                                            <p className="font-bold text-xs text-zinc-950">{file.name}</p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <Upload className="w-10 h-10 mb-2 text-zinc-300 mx-auto" />
                                            <p className="text-xs text-zinc-500 font-black uppercase">Subir Foto del Ticket</p>
                                        </div>
                                    )}
                                    <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                                </label>

                                <button
                                    disabled={!file}
                                    onClick={handleFinish}
                                    className="w-full bg-zinc-950 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 disabled:opacity-50 shadow-xl shadow-zinc-200 transition-all"
                                >
                                    Confirmar y Enviar Pago
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {step === 3 && (
                    <div className="text-center space-y-6 animate-in zoom-in">
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                            <CheckCircle size={50} />
                        </div>
                        <h2 className="text-4xl font-black italic uppercase text-zinc-950">¡Todo listo!</h2>
                        <p className="text-zinc-600 font-bold max-w-xs mx-auto">Tu pago ha sido enviado. La administración revisará tu comprobante en breve.</p>
                        <button onClick={onBack} className="text-zinc-950 font-black uppercase tracking-widest text-xs border-b-2 border-zinc-950 pb-1">Volver al inicio</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentUpload;
