import React from 'react';
import { Docente, Alumno } from '../types';
import { Mail, Phone, Users, MapPin, Search, Plus } from 'lucide-react';

interface TeachersViewProps {
    docentes: Docente[];
    alumnos: Alumno[];
    onOpenAddTeacher?: () => void;
}

const TeachersView: React.FC<TeachersViewProps> = ({ docentes, alumnos, onOpenAddTeacher }) => {
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredDocentes = docentes.filter(docente =>
        docente.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        docente.sede_slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStudentCount = (docenteId: string) => {
        return alumnos.filter(a => a.docente_id === docenteId).length;
    };

    // Función auxiliar para obtener una imagen determinista basada en el ID
    const getAvatarUrl = (id: string, gender: 'men' | 'women' = 'men') => {
        // Usamos el último caracter del ID para seleccionar una imagen "aleatoria" pero constante
        const seed = String(id).charCodeAt(String(id).length - 1) % 50;
        return `https://randomuser.me/api/portraits/${gender}/${seed}.jpg`;
    };


    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black italic uppercase text-zinc-900">Directorio de Docentes</h2>
                    <p className="text-zinc-500 font-medium">Gestiona y contacta al equipo académico.</p>
                </div>

                {onOpenAddTeacher && (
                    <button
                        onClick={onOpenAddTeacher}
                        className="bg-black text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl flex items-center gap-2"
                    >
                        <Plus size={16} /> Nuevo Docente
                    </button>
                )}

                {/* Barra de búsqueda */}
                <div className="relative group w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o sede..."
                        className="pl-10 pr-4 py-3 w-full border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm group-hover:shadow-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocentes.map((docente, index) => {
                    // Alternar género para variedad visual en fotos
                    const gender = index % 2 === 0 ? 'men' : 'women';

                    return (
                        <div key={docente.id} className="bg-white rounded-3xl p-6 border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img
                                            src={getAvatarUrl(docente.id, gender)}
                                            alt={docente.nombre_completo}
                                            className="w-16 h-16 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform"
                                        />
                                        <div className="absolute -bottom-2 -right-2 bg-blue-50 text-blue-600 p-1.5 rounded-lg border border-white shadow-sm">
                                            <MapPin size={12} fill="currentColor" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-zinc-900 leading-tight">{docente.nombre_completo}</h3>
                                        <span className="inline-block mt-1 px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[10px] font-black uppercase tracking-wider rounded-md">
                                            {docente.sede_slug}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                                    <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
                                        <Users size={16} />
                                        <span>Alumnos</span>
                                    </div>
                                    <span className="font-bold text-zinc-900">{getStudentCount(docente.id)}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <a href={`mailto:${docente.email || 'correo@ejemplo.com'}`} className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-800 transition-colors">
                                    <Mail size={16} />
                                    Email
                                </a>
                                <button className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-zinc-200 text-zinc-700 text-sm font-bold hover:bg-zinc-50 hover:border-zinc-300 transition-colors">
                                    <Phone size={16} />
                                    Llamar
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredDocentes.length === 0 && (
                <div className="text-center py-20 opacity-50">
                    <p className="text-xl font-bold text-zinc-600">No se encontraron docentes.</p>
                </div>
            )}
        </div>
    );
};

export default TeachersView;
