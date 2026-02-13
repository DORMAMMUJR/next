import React, { useState } from 'react';
import { Settings, User, Building2, Bell, Shield, Smartphone, Plus, Trash2 } from 'lucide-react';

interface SettingsViewProps {
    availableSedes?: string[];
    onAddSede?: (sede: string) => void;
    theme?: string;
    toggleTheme?: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ availableSedes = [], onAddSede, theme, toggleTheme }) => {
    const [newSedeName, setNewSedeName] = useState('');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const handleAddSede = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSedeName.trim() && onAddSede) {
            // Slugify simple para el ID, o usar el nombre tal cual
            const slug = newSedeName.toLowerCase().replace(/\s+/g, '-');
            // En una app real, verificarías duplicados aquí
            onAddSede(slug); // Por ahora usamos el slug como ID y nombre en App.tsx logic (aunque App.tsx usa nombres en minuscula)
            setNewSedeName('');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            <div>
                <h2 className="text-3xl font-black italic uppercase text-zinc-900 dark:text-white">Ajustes</h2>
                <p className="text-zinc-500 font-medium">Configura tu perfil, gestiona las sedes y preferencias.</p>
            </div>

            {/* SECCIÓN 1: MI PERFIL */}
            <section className="bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 rounded-3xl p-8 shadow-sm border border-zinc-100">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <User size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Mi Perfil</h3>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400 border-4 border-white shadow-lg">
                        <User size={48} />
                    </div>
                    <div className="space-y-4 flex-1 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Nombre Completo</label>
                                <input type="text" defaultValue="Administrador" className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-zinc-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Correo Electrónico</label>
                                <input type="email" defaultValue="admin@platform.com" className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-zinc-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button className="px-6 py-2 bg-black text-white rounded-xl font-bold text-sm hover:scale-105 transition-transform">
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECCIÓN 2: GESTIÓN DE SEDES */}
            <section className="bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 rounded-3xl p-8 shadow-sm border border-zinc-100">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Gestión de Sedes</h3>
                        <p className="text-sm text-zinc-500">Agrega nuevas sedes para organizar tu institución.</p>
                    </div>
                </div>

                <div className="mb-6">
                    <form onSubmit={handleAddSede} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Nombre de la nueva sede (ej. Puebla)"
                            className="flex-1 p-3 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                            value={newSedeName}
                            onChange={(e) => setNewSedeName(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={!newSedeName.trim() || !onAddSede}
                            className="bg-amber-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Plus size={20} />
                            <span className="hidden md:inline">Agregar</span>
                        </button>
                    </form>
                </div>

                <div className="space-y-2">
                    {availableSedes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {availableSedes.map((sede) => (
                                <div key={sede} className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-100 rounded-xl group hover:border-zinc-300 transition-colors">
                                    <span className="font-bold text-zinc-700 capitalize">{sede}</span>
                                    {/* Botón de eliminar deshabilitado visualmente para demo */}
                                    <button className="text-zinc-300 hover:text-red-500 transition-colors p-2" title="No disponible en demo">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-zinc-400 italic text-center py-4">No hay sedes registradas.</p>
                    )}
                </div>
            </section>

            {/* SECCIÓN 3: PREFERENCIAS DEL SISTEMA */}
            <section className="bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 rounded-3xl p-8 shadow-sm border border-zinc-100">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                        <Settings size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Preferencias del Sistema</h3>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-zinc-600">
                                <Bell size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-zinc-900">Notificaciones</h4>
                                <p className="text-xs text-zinc-500">Recibir alertas de pagos y mensajes.</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={notificationsEnabled} onChange={() => setNotificationsEnabled(!notificationsEnabled)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-zinc-600">
                                <Shield size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-zinc-900 dark:text-white">Modo Oscuro</h4>
                                <p className="text-xs text-zinc-500">Interfaz oscura para reducir fatiga visual.</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={theme === 'dark'}
                                onChange={toggleTheme}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-zinc-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900"></div>
                        </label>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SettingsView;
