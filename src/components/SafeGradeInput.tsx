
import React, { useState, useRef, useEffect } from 'react';

interface SafeGradeInputProps {
  currentGrade: number | null | undefined;
  studentName: string;
  isLocked: boolean;
  onSave: (newGrade: number) => void;
}

const SafeGradeInput: React.FC<SafeGradeInputProps> = ({ currentGrade, studentName, isLocked, onSave }) => {
  // Modes: 'view' (read-only), 'edit' (input active), 'confirm' (modal open)
  const [mode, setMode] = useState<'view' | 'edit' | 'confirm'>(currentGrade ? 'view' : 'edit');
  const [inputValue, setInputValue] = useState<string>(currentGrade?.toString() || '');
  const [error, setError] = useState<string | null>(null);

  // Focus input when entering edit mode
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (mode === 'edit' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mode]);

  const handleInitialSave = () => {
    const num = parseFloat(inputValue);
    if (isNaN(num) || num < 0 || num > 10) {
      setError('0-10');
      return;
    }
    setError(null);
    setMode('confirm');
  };

  const handleConfirm = () => {
    const num = parseFloat(inputValue);
    onSave(num);
    setMode('view');
  };

  const handleCancel = () => {
    setInputValue(currentGrade?.toString() || '');
    setMode(currentGrade ? 'view' : 'edit');
    setError(null);
  };

  // --- 1. STATE: LOCKED (DEBT) ---
  if (isLocked) {
    return (
      <div className="relative group flex justify-end">
        <div className="flex items-center gap-2 bg-zinc-100 border border-zinc-200 px-3 py-2 rounded-xl opacity-60 cursor-not-allowed">
          <span className="text-zinc-400 text-xs font-black uppercase">Bloqueado</span>
          <span className="text-sm">🔒</span>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 w-48 bg-black text-white text-[10px] p-3 rounded-xl shadow-xl invisible group-hover:visible z-50 animate-in fade-in slide-in-from-bottom-1">
          <p className="font-bold uppercase text-red-400 mb-1">Acción Restringida</p>
          <p className="leading-relaxed text-zinc-300">El alumno presenta retención administrativa. Favor de remitir a Finanzas.</p>
          <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-black rotate-45"></div>
        </div>
      </div>
    );
  }

  // --- 2. STATE: CONFIRMATION MODAL ---
  if (mode === 'confirm') {
    return (
      <>
        {/* Overlay backdrop */}
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[99]" onClick={() => setMode('edit')}></div>
        
        {/* Popover */}
        <div className="absolute right-0 bottom-full mb-2 w-72 bg-white rounded-2xl shadow-2xl border border-zinc-200 p-4 z-[100] animate-in zoom-in-95">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Confirmar Calificación</h4>
          <p className="text-sm font-medium text-zinc-800 mb-4">
            ¿Asentar <span className="font-black text-black bg-yellow-100 px-1 rounded">{inputValue}</span> a <br/>
            <span className="italic">{studentName.split(' ')[0]}</span>?
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => setMode('edit')}
              className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 py-2 rounded-lg text-[10px] font-black uppercase tracking-wide"
            >
              Corregir
            </button>
            <button 
              onClick={handleConfirm}
              className="flex-1 bg-black hover:bg-next-green hover:text-white text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-wide shadow-lg transition-all"
            >
              Confirmar
            </button>
          </div>
          {/* Arrow */}
          <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-white border-b border-r border-zinc-200 rotate-45"></div>
        </div>
        
        {/* Placeholder to keep layout stable while modal is open */}
        <div className="flex justify-end">
           <div className="w-20 h-10 bg-zinc-100 rounded-lg animate-pulse"></div>
        </div>
      </>
    );
  }

  // --- 3. STATE: EDIT / DRAFT ---
  if (mode === 'edit') {
    return (
      <div className="flex items-center justify-end gap-2 animate-in fade-in">
        <button 
          onClick={handleCancel}
          className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          title="Cancelar"
        >
          ✕
        </button>
        <div className="relative">
          <input
            ref={inputRef}
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInitialSave()}
            className={`w-20 p-2 text-center font-black text-lg rounded-xl border-2 outline-none transition-all
              ${error ? 'border-red-500 bg-red-50 text-red-600' : 'border-yellow-400 bg-yellow-50 text-black focus:ring-4 focus:ring-yellow-100'}`}
          />
          {error && <span className="absolute -bottom-4 right-0 text-[8px] font-black text-red-500 uppercase">{error}</span>}
        </div>
        <button 
          onClick={handleInitialSave}
          className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 hover:bg-next-green transition-all shadow-lg"
          title="Guardar Borrador"
        >
          ✓
        </button>
      </div>
    );
  }

  // --- 4. STATE: VIEW (READ ONLY) ---
  return (
    <div className="flex justify-end group">
      <button 
        onClick={() => setMode('edit')}
        className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-zinc-50 border border-transparent hover:border-zinc-200 transition-all group"
      >
        <span className="text-[10px] font-black uppercase text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
          Editar
        </span>
        <span className="text-xl font-black text-black">{Number(inputValue).toFixed(1)}</span>
      </button>
    </div>
  );
};

export default SafeGradeInput;
