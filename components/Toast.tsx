
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-6 right-6 bg-black text-white px-6 py-4 rounded-xl shadow-2xl z-[200] animate-in slide-in-from-bottom-4 flex items-center gap-3">
       <span className="text-next-green text-xl">✓</span>
       <p className="text-xs font-black uppercase tracking-widest">{message}</p>
    </div>
  );
};

export default Toast;
