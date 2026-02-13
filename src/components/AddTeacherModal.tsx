import React, { useState } from 'react';
import { X, User, MapPin, Phone, Mail, BookOpen } from 'lucide-react';

interface AddTeacherModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (teacher: any) => void;
}

const AddTeacherModal: React.FC<AddTeacherModalProps> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        sede: 'aguascalientes',
        telefono: '',
        email: '',
        especialidad: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: Date.now().toString(), alumnos: 0, pagoPendiente: 0, estatus: 'Activo' });
        setFormData({ nombre: '', sede: 'aguascalientes', telefono: '', email: '', especialidad: '' });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-zinc-900 dark:text-zinc-100 w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
                <div className="bg-black p-6 flex justify-between items-center text-white">
                    <h3 className="font-black italic uppercase text-xl">Alta de Docente</h3>
                    <button onClick={onClose} className="hover:opacity-70 transition-opacity"><X /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Nombre Completo</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 text-zinc-400" size={18} />
                            <input required type="text" className="w-full bg-zinc-50 dark:bg-zinc-950 dark:text-white border border-zinc-200 rounded-xl py-3 pl-12 font-bold text-zinc-900 outline-none focus:border-black transition-colors"
                                value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} placeholder="Ej. Roberto Gómez" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Sede Asignada</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-3.5 text-zinc-400" size={18} />
                                <select className="w-full bg-zinc-50 dark:bg-zinc-950 dark:text-white border border-zinc-200 rounded-xl py-3 pl-12 font-bold appearance-none text-zinc-900 outline-none focus:border-black transition-colors"
                                    value={formData.sede} onChange={e => setFormData({ ...formData, sede: e.target.value })}>
                                    <option value="aguascalientes">Aguascalientes</option>
                                    <option value="cdmx">CDMX</option>
                                    <option value="monterrey">Monterrey</option>
                                    <option value="guadalajara">Guadalajara</option>
                                    <option value="queretaro">Querétaro</option>
                                    <option value="cancun">Cancún</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Especialidad</label>
                            <div className="relative">
                                <BookOpen className="absolute left-4 top-3.5 text-zinc-400" size={18} />
                                <input required type="text" className="w-full bg-zinc-50 dark:bg-zinc-950 dark:text-white border border-zinc-200 rounded-xl py-3 pl-12 font-bold text-zinc-900 outline-none focus:border-black transition-colors"
                                    value={formData.especialidad} onChange={e => setFormData({ ...formData, especialidad: e.target.value })} placeholder="Ej. Inglés" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Teléfono</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-3.5 text-zinc-400" size={18} />
                            <input required type="tel" className="w-full bg-zinc-50 dark:bg-zinc-950 dark:text-white border border-zinc-200 rounded-xl py-3 pl-12 font-bold text-zinc-900 outline-none focus:border-black transition-colors"
                                value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })} placeholder="449..." />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Email (Opcional)</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 text-zinc-400" size={18} />
                            <input type="email" className="w-full bg-zinc-50 dark:bg-zinc-950 dark:text-white border border-zinc-200 rounded-xl py-3 pl-12 font-bold text-zinc-900 outline-none focus:border-black transition-colors"
                                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="correo@ejemplo.com" />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-colors shadow-xl mt-4">
                        Registrar Docente
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTeacherModal;
