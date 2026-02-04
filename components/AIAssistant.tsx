
import React, { useState, useRef, useEffect } from 'react';
import { getAIResponse } from '../services/geminiService';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string }[]>([
    { role: 'assistant', text: '¡Hola! Soy tu guía NEXT. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Maintain auto-scroll as messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    const aiResponse = await getAIResponse(userMessage);
    setMessages(prev => [...prev, { role: 'assistant', text: aiResponse || "No pude procesar tu solicitud." }]);
    setIsLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-black text-next-green rounded-full shadow-2xl z-[100] flex items-center justify-center text-2xl hover:scale-110 transition-all border-2 border-next-green/20"
      >
        {isOpen ? '✕' : '✨'}
      </button>

      {isOpen && (
        <div className="fixed bottom-28 right-8 w-full max-w-[400px] h-[600px] bg-white border-2 border-zinc-100 rounded-[40px] shadow-2xl z-[100] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-6 bg-black text-white">
            <h3 className="text-xl font-black italic">NEXT AI Assistant<span className="text-next-green">.</span></h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Gemini 3 Powered</p>
          </div>
          
          <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-[13px] leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-next-green text-white font-bold rounded-tr-none' 
                    : 'bg-zinc-50 text-zinc-800 font-medium rounded-tl-none border border-zinc-100'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-50 p-4 rounded-3xl rounded-tl-none border border-zinc-100">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-zinc-100">
            <div className="relative">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu consulta..."
                className="w-full bg-zinc-50 border-none rounded-2xl px-6 py-4 text-xs font-bold pr-14 focus:ring-2 focus:ring-next-green transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-2 w-10 h-10 bg-black text-next-green rounded-xl flex items-center justify-center hover:bg-zinc-800 disabled:opacity-50 transition-all"
              >
                ↑
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
