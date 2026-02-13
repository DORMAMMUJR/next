import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Image, Mic, Video, MoreVertical, MessageSquare } from 'lucide-react';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'support';
    timestamp: string;
}

interface SupportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Hola, ¿cómo puedo ayudarte hoy?",
            sender: 'support',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    if (!isOpen) return null;

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newMessage: Message = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setInputValue('');

        // Simulación de respuesta automática
        setTimeout(() => {
            const reply: Message = {
                id: Date.now() + 1,
                text: "Entendido. Un agente revisará tu solicitud multimedia en breve. 🚀",
                sender: 'support',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, reply]);
        }, 1500);
    };

    return (
        <div className="fixed bottom-24 right-6 z-50 w-full max-w-[380px] animate-in slide-in-from-bottom-4 duration-300 ease-out">
            <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl border border-zinc-100 flex flex-col h-[520px]">

                {/* Header Superior Estilo Chat */}
                <div className="bg-black p-6 text-white flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                                <MessageSquare size={20} className="text-green-400" />
                            </div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full" title="Online"></span>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm leading-tight">Soporte Tech</h3>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">En línea ahora</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                            <MoreVertical size={18} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Área de Mensajes */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 scroll-smooth"
                >
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}
                        >
                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.sender === 'user'
                                ? 'bg-black text-white rounded-tr-none'
                                : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-none'
                                }`}>
                                <p className="font-bold leading-relaxed">{msg.text}</p>
                                <p className={`text-[9px] mt-2 font-bold uppercase tracking-wider ${msg.sender === 'user' ? 'text-zinc-400' : 'text-zinc-400'
                                    }`}>
                                    {msg.timestamp}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Barra Multimedia e Input */}
                <div className="p-4 bg-white border-t border-zinc-200">
                    {/* Iconos Multimedia (Imagen, Audio, Video) */}
                    <div className="flex gap-4 justify-around mb-3 text-zinc-400">
                        <button className="hover:text-black transition-colors active:scale-90" title="Enviar Imagen">
                            <Image size={20} />
                        </button>
                        <button className="hover:text-black transition-colors active:scale-90" title="Enviar Audio">
                            <Mic size={20} />
                        </button>
                        <button className="hover:text-black transition-colors active:scale-90" title="Enviar Video">
                            <Video size={20} />
                        </button>
                    </div>

                    {/* Input de Texto + Botón Enviar */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Escribe tu duda..."
                            className="flex-1 bg-zinc-100 rounded-xl px-4 py-2 font-bold text-sm outline-none focus:ring-2 focus:ring-black transition-all"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim()}
                            className="bg-black text-white p-2 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>

                {/* Badge Inferior */}
                <div className="py-2 bg-zinc-50 border-t border-zinc-100 text-center">
                    <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em]">
                        Powered by Antigravity AI
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SupportModal;
