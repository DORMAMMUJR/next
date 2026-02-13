import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Camera, Mic, Paperclip, MoreVertical, MessageSquare } from 'lucide-react';

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
            text: "¡Hola! 👋 Bienvenido al soporte multimedia. ¿En qué podemos ayudarte hoy?",
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
            <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl border border-zinc-100 flex flex-col h-[500px]">

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
                    className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50/50 scroll-smooth"
                >
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}
                        >
                            <div className={`max-w-[80%] p-4 rounded-2xl text-sm shadow-sm ${msg.sender === 'user'
                                    ? 'bg-black text-white rounded-tr-none'
                                    : 'bg-white border border-zinc-100 text-zinc-800 rounded-tl-none'
                                }`}>
                                <p className="font-medium leading-relaxed">{msg.text}</p>
                                <p className={`text-[9px] mt-2 font-bold uppercase tracking-wider ${msg.sender === 'user' ? 'text-zinc-400' : 'text-zinc-400'
                                    }`}>
                                    {msg.timestamp}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Multimedia e Input */}
                <div className="p-4 bg-white border-t border-zinc-100 space-y-3">
                    {/* Botones Multimedia */}
                    <div className="flex items-center gap-2 px-1">
                        <button className="flex-1 flex items-center justify-center py-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 rounded-xl transition-all hover:scale-105 active:scale-95 border border-zinc-100 group" title="Cámara">
                            <Camera size={18} className="group-hover:text-black transition-colors" />
                        </button>
                        <button className="flex-1 flex items-center justify-center py-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 rounded-xl transition-all hover:scale-105 active:scale-95 border border-zinc-100 group" title="Audio">
                            <Mic size={18} className="group-hover:text-black transition-colors" />
                        </button>
                        <button className="flex-1 flex items-center justify-center py-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 rounded-xl transition-all hover:scale-105 active:scale-95 border border-zinc-100 group" title="Adjuntar">
                            <Paperclip size={18} className="group-hover:text-black transition-colors" />
                        </button>
                    </div>

                    {/* Input de Texto */}
                    <div className="relative flex items-center gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Escribe un mensaje..."
                            className="w-full bg-zinc-100 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-black transition-all outline-none pr-12 font-medium"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim()}
                            className="absolute right-2 p-2 bg-black text-white rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
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

