
import React from 'react';
import { CITIES } from '../constants';

interface CampusSelectorProps {
  onSelect: (slug: string) => void;
}

const CampusSelector: React.FC<CampusSelectorProps> = ({ onSelect }) => {
  // Mock generation of stats for visualization
  const getMockStats = (slug: string) => {
     // Deterministic pseudo-random based on slug length to keep stats consistent per refresh
     const seed = slug.length;
     const students = (seed * 15) + 40;
     const revenue = students * 2500;
     return { students, revenue };
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-20">
       <div className="flex flex-col gap-2">
         <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Vista Global</p>
         <h2 className="text-4xl font-black italic uppercase tracking-tighter text-black">Selecciona una Sede<span className="text-next-green">.</span></h2>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {CITIES.map((city) => {
            const stats = getMockStats(city.slug);
            return (
              <button 
                key={city.slug}
                onClick={() => onSelect(city.slug)}
                className="group bg-white border border-zinc-200 hover:border-black p-6 rounded-[32px] text-left transition-all hover:shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                   <span className="text-6xl grayscale">🏢</span>
                </div>
                
                <h3 className="text-lg font-black uppercase tracking-tight mb-1 group-hover:text-next-green transition-colors">{city.name}</h3>
                <p className="text-[10px] font-bold text-zinc-400 uppercase mb-8">{city.slug}</p>
                
                <div className="space-y-3 relative z-10">
                   <div className="flex justify-between items-end border-b border-zinc-100 pb-2">
                      <span className="text-[9px] font-black uppercase text-zinc-500">Alumnos</span>
                      <span className="text-xl font-black">{stats.students}</span>
                   </div>
                   <div className="flex justify-between items-end">
                      <span className="text-[9px] font-black uppercase text-zinc-500">Ingreso Mensual</span>
                      <span className="text-sm font-mono font-bold text-green-700">${stats.revenue.toLocaleString()}</span>
                   </div>
                </div>
              </button>
            );
          })}
       </div>
    </div>
  );
};

export default CampusSelector;
