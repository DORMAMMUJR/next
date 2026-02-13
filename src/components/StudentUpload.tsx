import React, { useState } from 'react';
import { Upload, CheckCircle, Search, ArrowLeft, User, MapPin, AlertCircle } from 'lucide-react';

// Simulamos tu base de datos para que veas cómo funciona la búsqueda
const MOCK_DB_ALUMNOS = [
    { matricula: 'AGS-001', nombre: 'Juan Pérez', sede: 'Aguascalientes' },
    { matricula: 'CDMX-023', nombre: 'María González', sede: 'CDMX' },
    { matricula: 'MTY-555', nombre: 'Roberto Garza', sede: 'Monterrey' },
];

interface StudentUploadProps {
    onBack: () => void;
    onUpload: (matricula: string, file: File) => void;
}

const StudentUpload: React.FC<StudentUploadProps> = ({ onBack, onUpload }) => {
    // Pasos: 'search' -> 'confirm' -> 'success'
    const [step, setStep] = useState<'search' | 'confirm' | 'success'>('search');

    const [matriculaInput, setMatriculaInput] = useState('');
    const [foundStudent, setFoundStudent] = useState<any>(null);
    const [error, setError] = useState('');
    const [file, setFile] = useState<File | null>(null);

    // PASO 1: BUSCAR ALUMNO
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Aquí buscarías en tu base de datos real
        // Normalizamos a mayúsculas para evitar errores
        const student = MOCK_DB_ALUMNOS.find(a => a.matricula === matriculaInput.toUpperCase());

        if (student) {
            setFoundStudent(student);
            setStep('confirm'); // Pasamos al siguiente paso
        } else {
            setError('No encontramos esa matrícula. Verifica e intenta de nuevo.');
        }
    };

    // PASO 2: SUBIR ARCHIVO
    const handleUpload = () => {
        if (foundStudent && file) {
            onUpload(foundStudent.matricula, file);
            setStep('success');
        }
    };

    // --- VISTA DE ÉXITO ---
    if (step === 'success') {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 animate-in zoom-in">
                <div className="bg-white p-10 rounded-[32px] shadow-xl text-center max-w-md w-full border border-zinc-100">
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} />
                    </div>
                    <h2 className="text-3xl font-black italic uppercase mb-2">¡Recibido!</h2>
                    <p className="text-zinc-500 font-medium mb-8">
                        Gracias <span className="font-bold text-black">{foundStudent.nombre}</span>.<br />
                        Tu comprobante ha sido enviado a la administración de {foundStudent.sede}.
                    </p>
                    <button
                        onClick={() => { setStep('search'); setMatriculaInput(''); setFile(null); }}
                        className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                        Subir otro
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative">
            <button onClick={onBack} className="absolute top-6 left-6 p-3 rounded-full hover:bg-zinc-100 transition-colors">
                <ArrowLeft size={24} />
            </button>

            <div className="w-full max-w-md space-y-8 animate-in slide-in-from-bottom-10">
                <div className="text-center">
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter">Portal de Pagos<span className="text-green-500">.</span></h1>
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs mt-2">Identifícate para continuar</p>
                </div>

                {/* --- PASO 1: BUSCADOR --- */}
                {step === 'search' && (
                    <form onSubmit={handleSearch} className="space-y-6 bg-zinc-50 p-8 rounded-[32px] border border-zinc-100">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Ingresa tu Matrícula</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-4 text-zinc-300" size={20} />
                                <input
                                    autoFocus
                                    required
                                    type="text"
                                    value={matriculaInput}
                                    onChange={(e) => setMatriculaInput(e.target.value.toUpperCase())}
                                    className="w-full bg-white border-2 border-zinc-200 focus:border-black rounded-2xl py-4 pl-12 pr-4 font-mono text-xl font-bold uppercase outline-none transition-colors text-center tracking-widest"
                                    placeholder="AGS-..."
                                />
                            </div>
                            {error && (
                                <div className="flex items-center gap-2 text-red-500 text-xs font-bold mt-2 animate-pulse">
                                    <AlertCircle size={12} /> {error}
                                </div>
                            )}
                        </div>
                        <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg">
                            Buscar Alumno
                        </button>
                    </form>
                )}

                {/* --- PASO 2: CONFIRMACIÓN Y SUBIDA --- */}
                {step === 'confirm' && foundStudent && (
                    <div className="space-y-6 bg-white border border-zinc-200 p-8 rounded-[32px] shadow-2xl">

                        {/* Tarjeta de Identidad */}
                        <div className="bg-zinc-50 p-4 rounded-2xl flex items-center gap-4 border border-zinc-100">
                            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg">
                                {foundStudent.nombre.charAt(0)}
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-zinc-400">Alumno Identificado</p>
                                <h3 className="text-lg font-black italic uppercase">{foundStudent.nombre}</h3>
                                <p className="text-xs font-medium text-zinc-500 flex items-center gap-1">
                                    <MapPin size={10} /> {foundStudent.sede}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Sube tu Comprobante</label>
                            <label className={`relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all group overflow-hidden ${file ? 'border-green-500 bg-green-50' : 'border-zinc-300 hover:border-black hover:bg-zinc-50'}`}>
                                {file ? (
                                    <div className="text-center p-4">
                                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                        <p className="font-bold text-xs text-zinc-800 break-all">{file.name}</p>
                                        <p className="text-[9px] uppercase font-bold text-green-600 mt-1">Listo para enviar</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-2 text-zinc-300 group-hover:text-black transition-colors" />
                                        <p className="text-xs text-zinc-500 font-bold">Toca para subir foto</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*,.pdf"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                            </label>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => { setStep('search'); setFile(null); }}
                                className="flex-1 bg-zinc-100 text-zinc-500 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-200"
                            >
                                No soy yo
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={!file}
                                className="flex-[2] bg-green-500 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/30 transition-all"
                            >
                                Enviar Pago
                            </button>
                        </div>
                    </div>
                )}

            </div>

            {/* Footer Informativo */}
            <div className="absolute bottom-6 text-center">
                <p className="text-[10px] text-zinc-300 font-bold uppercase">Sistema de Validación Segura v1.0</p>
            </div>
        </div>
    );
};

export default StudentUpload;
