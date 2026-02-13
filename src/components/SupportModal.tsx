import React from 'react';
import { X, MessageCircle, Mail, Phone, ExternalLink } from 'lucide-react';

interface SupportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop con blur */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-8 pb-0 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-black italic tracking-tighter mb-1">AYUDA Y SOPORTE</h2>
                        <p className="text-zinc-500 text-sm font-medium">Estamos aquí para ayudarte.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-4">

                    {/* Card WhatsApp */}
                    <a
                        href="#"
                        className="flex items-center gap-4 p-4 rounded-2xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors group cursor-pointer border border-[#25D366]/20"
                    >
                        <div className="w-12 h-12 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/30 group-hover:scale-110 transition-transform">
                            <MessageCircle size={24} fill="currentColor" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-black group-hover:text-[#25D366] transition-colors">WhatsApp Soporte</h3>
                            <p className="text-xs font-semibold text-zinc-500">Respuesta inmediata</p>
                        </div>
                        <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>

                    {/* Card Email */}
                    <a
                        href="mailto:soporte@platform.com"
                        className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-colors group cursor-pointer border border-zinc-100"
                    >
                        <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-110 transition-transform">
                            <Mail size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold">Enviar Correo</h3>
                            <p className="text-xs font-semibold text-zinc-500">soporte@platform.com</p>
                        </div>
                        <ExternalLink size={16} className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>

                    {/* Card Teléfono */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                        <div className="w-12 h-12 rounded-xl bg-zinc-200 text-zinc-500 flex items-center justify-center">
                            <Phone size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-zinc-400">Línea Directa</h3>
                            <p className="text-xs font-semibold text-zinc-400">Lunes a Viernes 9am - 6pm</p>
                        </div>
                        <span className="text-[10px] font-black uppercase bg-zinc-100 text-zinc-400 px-2 py-1 rounded">Offline</span>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 bg-zinc-50 border-t border-zinc-100 text-center">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                        School Platform v2.0.4 &bull; 2026
                    </p>
                </div>

            </div>
        </div>
    );
};

export default SupportModal;
