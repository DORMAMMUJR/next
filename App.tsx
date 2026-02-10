
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CITIES, CITY_KEYS } from './constants';
import { Alumno, Matricula, Pago, CityData, City, ExpedienteAlumno, DocumentoPDF } from './types';
import AIAssistant from './components/AIAssistant';

// --- SEED DATA PARA AGUASCALIENTES ---
const SEED_AGUASCALIENTES: CityData = (() => {
  const alumnos: Alumno[] = [];
  const matriculas: Matricula[] = [];
  const pagos: Pago[] = [];
  const expedientes: ExpedienteAlumno[] = [];

  const rawData = [
    { name: "Carlos Alberto Ramírez López", mat: "NX-001023", grupo: "A1", programa: "Bachillerato Ejecutivo", estatus: "Activo" as const, pagos: [
      { c: "Inscripción", m: 2500, s: "Pagado", f: "2026-01-10" },
      { c: "Mensualidad Enero", m: 1800, s: "Pagado", f: "2026-01-15" },
      { c: "Mensualidad Febrero", m: 1800, s: "Pendiente", f: "2026-02-15" }
    ]},
    { name: "Mariana Fernanda Torres Cruz", mat: "NX-001024", grupo: "A2", programa: "Bachillerato Ejecutivo", estatus: "Activo" as const, pagos: [
      { c: "Inscripción", m: 2500, s: "Pagado", f: "2026-01-12" },
      { c: "Mensualidad Enero", m: 1800, s: "Pagado", f: "2026-01-17" }
    ]},
    { name: "José Luis Hernández Vega", mat: "NX-001025", grupo: "B1", programa: "Bachillerato General", estatus: "Pausa" as const, pagos: [
      { c: "Inscripción", m: 2500, s: "Pagado", f: "2026-01-05" },
      { c: "Mensualidad Enero", m: 1800, s: "Vencido", f: "2026-01-20" }
    ]},
    { name: "Andrea Sofía Mendoza Ruiz", mat: "NX-001026", grupo: "A1", programa: "Bachillerato Ejecutivo", estatus: "Activo" as const, pagos: [
      { c: "Inscripción", m: 2500, s: "Pagado", f: "2026-01-11" },
      { c: "Mensualidad Enero", m: 1800, s: "Pagado", f: "2026-01-25" },
      { c: "Mensualidad Febrero", m: 1800, s: "Pagado", f: "2026-02-11" }
    ]},
    { name: "Luis Fernando Castillo Ortiz", mat: "NX-001027", grupo: "C1", programa: "Bachillerato en Línea", estatus: "Baja" as const, pagos: [
      { c: "Inscripción", m: 2500, s: "Pagado", f: "2026-01-08" },
      { c: "Mensualidad Enero", m: 1800, s: "Pagado", f: "2026-01-20" }
    ]},
    { name: "Valeria Gómez Paredes", mat: "NX-001028", grupo: "B2", programa: "Bachillerato Ejecutivo", estatus: "Activo" as const, pagos: [
      { c: "Inscripción", m: 2500, s: "Pagado", f: "2026-01-09" },
      { c: "Mensualidad Enero", m: 1800, s: "Pagado", f: "2026-01-28" },
      { c: "Mensualidad Febrero", m: 1800, s: "Pendiente", f: "2026-02-09" }
    ]},
    { name: "Miguel Ángel Navarro Salinas", mat: "NX-001029", grupo: "A3", programa: "Bachillerato General", estatus: "Activo" as const, pagos: [
      { c: "Inscripción", m: 2500, s: "Pagado", f: "2026-01-14" },
      { c: "Mensualidad Enero", m: 1800, s: "Pagado", f: "2026-01-30" }
    ]},
    { name: "Daniela Rodríguez Morales", mat: "NX-001030", grupo: "C2", programa: "Bachillerato en Línea", estatus: "Activo" as const, pagos: [
      { c: "Inscripción", m: 2500, s: "Pagado", f: "2026-01-10" },
      { c: "Mensualidad Enero", m: 1800, s: "Pagado", f: "2026-01-25" },
      { c: "Mensualidad Febrero", m: 1800, s: "Vencido", f: "2026-02-10" }
    ]},
    { name: "Ricardo Iván Flores Bautista", mat: "NX-001031", grupo: "B1", programa: "Bachillerato Ejecutivo", estatus: "Activo" as const, pagos: [
      { c: "Inscripción", m: 2500, s: "Pagado", f: "2026-01-13" },
      { c: "Mensualidad Enero", m: 1800, s: "Pagado", f: "2026-01-27" }
    ]},
    { name: "Paola Estefanía Cortés Aguilar", mat: "NX-001032", grupo: "A2", programa: "Bachillerato General", estatus: "Activo" as const, pagos: [
      { c: "Inscripción", m: 2500, s: "Pagado", f: "2026-01-06" },
      { c: "Mensualidad Enero", m: 1800, s: "Pagado", f: "2026-01-15" },
      { c: "Mensualidad Febrero", m: 1800, s: "Pendiente", f: "2026-02-06" }
    ]}
  ];

  rawData.forEach(item => {
    const id = Math.random().toString(36).substr(2, 9);
    alumnos.push({
      id,
      nombre_completo: item.name,
      telefono: "4491234567",
      email: `${item.name.toLowerCase().replace(/ /g, '.')}@next.edu.mx`,
      generacion: "2026",
      grupo: item.grupo,
      estatus: item.estatus,
      created_at: new Date().toISOString()
    });

    matriculas.push({
      id: Math.random().toString(36).substr(2, 9),
      alumno_id: id,
      matricula: item.mat,
      fecha_inscripcion: "2026-01-01",
      programa: item.programa,
      turno: "Matutino",
      modalidad: "En línea",
      expediente_folio: `FOL-${item.mat}`
    });

    item.pagos.forEach(p => {
      pagos.push({
        id: Math.random().toString(36).substr(2, 5),
        alumno_id: id,
        concepto: p.c as any,
        monto: p.m,
        fecha_pago: p.f,
        metodo: "Transferencia",
        estatus: p.s as any
      });
    });

    // Expediente vacío inicial
    expedientes.push({
      alumno_id: id,
      docs: {},
      updated_at: new Date().toISOString()
    });
  });

  return { alumnos, matriculas, pagos, expedientes };
})();

const App: React.FC = () => {
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'alumnos' | 'matriculas' | 'pagos' | 'reportes' | 'expedientes'>('alumnos');
  const [data, setData] = useState<CityData>({ alumnos: [], matriculas: [], pagos: [], expedientes: [] });
  const [selectedAlumnoId, setSelectedAlumnoId] = useState<string | null>(null);
  
  const urlParams = new URLSearchParams(window.location.search);
  const urlKey = urlParams.get('k');

  useEffect(() => {
    if (currentSlug) {
      const storageKey = `NEXT_DATA_${currentSlug}`;
      const saved = localStorage.getItem(storageKey);
      
      if (saved) {
        const parsed = JSON.parse(saved);
        // Migración: Asegurar que existe campo expedientes
        if (!parsed.expedientes) parsed.expedientes = [];
        
        if (currentSlug === 'aguascalientes' && parsed.alumnos.length === 0) {
          saveData(SEED_AGUASCALIENTES);
          printSummary(SEED_AGUASCALIENTES);
        } else {
          setData(parsed);
          if (currentSlug === 'aguascalientes') printSummary(parsed);
        }
      } else {
        const initial = currentSlug === 'aguascalientes' ? SEED_AGUASCALIENTES : { alumnos: [], matriculas: [], pagos: [], expedientes: [] };
        setData(initial);
        localStorage.setItem(storageKey, JSON.stringify(initial));
        if (currentSlug === 'aguascalientes') printSummary(initial);
      }
    }
  }, [currentSlug]);

  const printSummary = (cityData: CityData) => {
    const totalPagado = cityData.pagos.filter(p => p.estatus === 'Pagado').reduce((acc, p) => acc + p.monto, 0);
    const totalPendiente = cityData.pagos.filter(p => p.estatus === 'Pendiente').reduce((acc, p) => acc + p.monto, 0);
    const totalVencido = cityData.pagos.filter(p => p.estatus === 'Vencido').reduce((acc, p) => acc + p.monto, 0);

    console.group(`%c NEXT SUMMARY - AGUASCALIENTES `, 'background: #22c55e; color: #fff; font-weight: bold; padding: 4px;');
    console.log(`Total de alumnos creados: ${cityData.alumnos.length}`);
    console.log(`Expedientes registrados: ${cityData.expedientes?.length || 0}`);
    console.log(`Total Pagado: $${totalPagado.toLocaleString()} MXN`);
    console.groupEnd();
  };

  const saveData = (newData: CityData) => {
    setData(newData);
    localStorage.setItem(`NEXT_DATA_${currentSlug}`, JSON.stringify(newData));
  };

  const filteredCities = CITIES.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCity = CITIES.find(c => c.slug === currentSlug);
  const isAuthorized = useMemo(() => {
    if (!currentSlug) return true;
    const requiredKey = CITY_KEYS[currentSlug];
    return !requiredKey || requiredKey === urlKey;
  }, [currentSlug, urlKey]);

  if (currentSlug && !isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-next-green text-6xl font-black italic mb-4 uppercase">ACCESO RESTRINGIDO</h2>
        <p className="text-white/50 font-bold uppercase tracking-widest text-xs">Esta ciudad requiere una llave de acceso válida.</p>
        <button onClick={() => setCurrentSlug(null)} className="mt-12 bg-white text-black px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-widest">Volver a Ciudades</button>
      </div>
    );
  }

  // --- COMPONENTES DE VISTA ---

  const ExpedienteManager = ({ alumnoId }: { alumnoId: string }) => {
    const alumno = data.alumnos.find(a => a.id === alumnoId);
    const expediente = data.expedientes.find(e => e.alumno_id === alumnoId) || { alumno_id: alumnoId, docs: {}, updated_at: '' };
    const [error, setError] = useState('');

    const docTypes = [
      { key: 'acta_nacimiento', label: 'Acta de nacimiento' },
      { key: 'identificacion', label: 'Identificación' },
      { key: 'curp', label: 'CURP' },
      { key: 'certificacion', label: 'Certificación' },
    ];

    const countLoaded = docTypes.filter(d => !!(expediente.docs as any)[d.key]).length;

    const handleFileUpload = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.type !== 'application/pdf') {
        setError('Error: Solo se permiten archivos PDF.');
        return;
      }
      setError('');

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const newDoc: DocumentoPDF = {
          file_name: file.name,
          mime_type: file.type,
          size_bytes: file.size,
          uploaded_at: new Date().toISOString(),
          base64_data: base64
        };

        const existingIdx = data.expedientes.findIndex(exp => exp.alumno_id === alumnoId);
        let updatedExpedientes = [...data.expedientes];

        if (existingIdx > -1) {
          updatedExpedientes[existingIdx] = {
            ...updatedExpedientes[existingIdx],
            docs: { ...updatedExpedientes[existingIdx].docs, [key]: newDoc },
            updated_at: new Date().toISOString()
          };
        } else {
          updatedExpedientes.push({
            alumno_id: alumnoId,
            docs: { [key]: newDoc },
            updated_at: new Date().toISOString()
          });
        }

        saveData({ ...data, expedientes: updatedExpedientes });
      };
      reader.readAsDataURL(file);
    };

    const viewDoc = (base64: string) => {
      const win = window.open();
      if (win) {
        win.document.write(`<iframe src="${base64}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
      }
    };

    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex justify-between items-end">
          <div>
            <button onClick={() => setSelectedAlumnoId(null)} className="text-zinc-400 font-black text-[9px] uppercase tracking-widest mb-4 hover:text-black transition-colors">← Volver al Listado</button>
            <h3 className="text-4xl font-black italic uppercase tracking-tighter">Expediente: {alumno?.nombre_completo}<span className="text-next-green">.</span></h3>
            <p className="text-zinc-500 font-bold text-[11px] uppercase tracking-widest mt-2">
              Estado: <span className={countLoaded === 4 ? 'text-next-green' : 'text-orange-500'}>{countLoaded}/4 Documentos cargados</span>
            </p>
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">{error}</div>}

        <div className="grid md:grid-cols-2 gap-6">
          {docTypes.map(doc => {
            const file = (expediente.docs as any)[doc.key] as DocumentoPDF | undefined;
            return (
              <div key={doc.key} className={`p-8 rounded-[40px] border-2 transition-all ${file ? 'bg-white border-zinc-100 shadow-sm' : 'bg-zinc-50 border-dashed border-zinc-200 opacity-80'}`}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-widest text-black mb-1">{doc.label}</h4>
                    <p className={`text-[9px] font-black uppercase tracking-widest ${file ? 'text-next-green' : 'text-zinc-400'}`}>
                      {file ? '● Cargado' : '○ No cargado'}
                    </p>
                  </div>
                  <span className="text-3xl">{file ? '📄' : '📁'}</span>
                </div>

                {file ? (
                  <div className="space-y-4">
                    <div className="bg-zinc-50 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-zinc-600 truncate">{file.file_name}</p>
                      <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mt-1">
                        Subido: {new Date(file.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => viewDoc(file.base64_data)}
                        className="flex-1 bg-black text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-next-green transition-all"
                      >
                        Ver Documento
                      </button>
                      <label className="flex-1 text-center bg-zinc-100 text-zinc-600 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-zinc-200 transition-all cursor-pointer">
                        Reemplazar
                        <input type="file" className="hidden" accept="application/pdf" onChange={(e) => handleFileUpload(doc.key, e)} />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="block w-full text-center py-10 rounded-[32px] border-2 border-dashed border-zinc-200 text-zinc-400 hover:border-next-green hover:text-next-green transition-all cursor-pointer group">
                    <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">+</span>
                    <span className="font-black text-[9px] uppercase tracking-widest">Subir PDF</span>
                    <input type="file" className="hidden" accept="application/pdf" onChange={(e) => handleFileUpload(doc.key, e)} />
                  </label>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const AlumnosView = () => {
    const [isAdding, setIsAdding] = useState(false);
    const [form, setForm] = useState<Partial<Alumno>>({ estatus: 'Activo' });

    const handleAdd = () => {
      const newId = Math.random().toString(36).substr(2, 9);
      const newAlumno: Alumno = {
        id: newId,
        nombre_completo: form.nombre_completo || '',
        telefono: form.telefono || '',
        email: form.email || '',
        generacion: form.generacion || '2026',
        grupo: form.grupo || 'A',
        estatus: form.estatus as any,
        created_at: new Date().toISOString()
      };
      
      const newExpediente: ExpedienteAlumno = {
        alumno_id: newId,
        docs: {},
        updated_at: new Date().toISOString()
      };

      saveData({ 
        ...data, 
        alumnos: [...data.alumnos, newAlumno],
        expedientes: [...(data.expedientes || []), newExpediente]
      });
      setIsAdding(false);
      setForm({ estatus: 'Activo' });
    };

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex justify-between items-center">
          <h3 className="text-3xl font-black italic uppercase tracking-tighter">Padrón de Alumnos<span className="text-next-green">.</span></h3>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-black text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-next-green transition-all"
          >
            + Nuevo Alumno
          </button>
        </div>

        {isAdding && (
          <div className="bg-zinc-50 p-10 rounded-[40px] border border-zinc-100 grid md:grid-cols-2 gap-6 animate-in zoom-in-95">
            <input type="text" placeholder="Nombre Completo" className="bg-white border-none rounded-2xl px-6 py-4 font-bold text-sm text-black" onChange={e => setForm({...form, nombre_completo: e.target.value})} />
            <input type="text" placeholder="Teléfono" className="bg-white border-none rounded-2xl px-6 py-4 font-bold text-sm text-black" onChange={e => setForm({...form, telefono: e.target.value})} />
            <input type="email" placeholder="Email" className="bg-white border-none rounded-2xl px-6 py-4 font-bold text-sm text-black" onChange={e => setForm({...form, email: e.target.value})} />
            <select className="bg-white border-none rounded-2xl px-6 py-4 font-bold text-sm text-black" onChange={e => setForm({...form, estatus: e.target.value as any})}>
              <option value="Activo">Activo</option>
              <option value="Baja">Baja</option>
              <option value="Pausa">Pausa</option>
            </select>
            <div className="md:col-span-2 flex gap-4">
              <button onClick={handleAdd} className="bg-next-green text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest">Guardar</button>
              <button onClick={() => setIsAdding(false)} className="bg-zinc-200 text-zinc-600 px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest">Cancelar</button>
            </div>
          </div>
        )}

        <div className="bg-white border border-zinc-100 rounded-[48px] overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 text-[9px] font-black uppercase tracking-widest text-zinc-400">
              <tr>
                <th className="px-10 py-6">Alumno</th>
                <th className="px-6 py-6">Matrícula</th>
                <th className="px-6 py-6">Expediente</th>
                <th className="px-6 py-6">Estatus</th>
                <th className="px-10 py-6 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {data.alumnos.map(a => {
                const matricula = data.matriculas.find(m => m.alumno_id === a.id);
                const expediente = data.expedientes?.find(e => e.alumno_id === a.id);
                const loadedCount = expediente ? Object.keys(expediente.docs).length : 0;
                return (
                  <tr key={a.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-10 py-6">
                      <p className="font-black text-sm uppercase italic text-black">{a.nombre_completo}</p>
                      <p className="text-[10px] font-bold text-zinc-400">Grupo: {a.grupo}</p>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-[11px] font-black tracking-widest text-zinc-400 uppercase">{matricula?.matricula || 'SIN MATRÍCULA'}</p>
                    </td>
                    <td className="px-6 py-6">
                      <button 
                        onClick={() => { setSelectedAlumnoId(a.id); setActiveTab('expedientes'); }}
                        className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-2 group transition-colors ${loadedCount === 4 ? 'text-next-green' : 'text-orange-500'}`}
                      >
                         <span className="bg-current/10 px-2 py-1 rounded-md group-hover:bg-current group-hover:text-white transition-all">{loadedCount}/4 Doc</span>
                         {loadedCount === 4 ? '✅' : '⏳'}
                      </button>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        a.estatus === 'Activo' ? 'bg-green-100 text-green-700' : 
                        a.estatus === 'Baja' ? 'bg-red-100 text-red-700' : 'bg-zinc-100 text-zinc-500'
                      }`}>
                        {a.estatus}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right space-x-4">
                      <button 
                        onClick={() => { setSelectedAlumnoId(a.id); setActiveTab('expedientes'); }}
                        className="text-black font-black text-[9px] uppercase tracking-widest hover:text-next-green"
                      >
                        Expediente
                      </button>
                      <button 
                        onClick={() => { setSelectedAlumnoId(a.id); setActiveTab('reportes'); }}
                        className="text-next-green font-black text-[9px] uppercase tracking-widest hover:underline"
                      >
                        Detalle →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const PagosView = () => {
    const [isAdding, setIsAdding] = useState(false);
    const [form, setForm] = useState<Partial<Pago>>({ estatus: 'Pagado', concepto: 'Mensualidad' });

    const handleAdd = () => {
      const newPago: Pago = {
        id: Math.random().toString(36).substr(2, 5),
        alumno_id: form.alumno_id || '',
        concepto: form.concepto as any,
        monto: Number(form.monto) || 0,
        fecha_pago: new Date().toISOString().split('T')[0],
        metodo: 'Transferencia',
        estatus: form.estatus as any
      };
      saveData({ ...data, pagos: [...data.pagos, newPago] });
      setIsAdding(false);
    };

    const totalIngresos = data.pagos.filter(p => p.estatus === 'Pagado').reduce((acc, curr) => acc + curr.monto, 0);

    return (
      <div className="space-y-8 animate-in fade-in">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-black p-10 rounded-[48px] text-white shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Total Recaudado</p>
            <p className="text-4xl font-black italic">${totalIngresos.toLocaleString()}</p>
          </div>
          <div className="bg-zinc-50 p-10 rounded-[48px] border border-zinc-100 col-span-2 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Control Financiero</p>
              <h3 className="text-2xl font-black italic uppercase">Gestión de Cobranza</h3>
            </div>
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-next-green text-white px-10 py-4 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-next-green/20"
            >
              Registrar Pago
            </button>
          </div>
        </div>

        {isAdding && (
          <div className="bg-zinc-50 p-10 rounded-[40px] border border-zinc-100 grid md:grid-cols-3 gap-6">
            <select className="bg-white border-none rounded-2xl px-6 py-4 font-bold text-sm text-black" onChange={e => setForm({...form, alumno_id: e.target.value})}>
              <option value="">Seleccionar Alumno</option>
              {data.alumnos.map(a => <option key={a.id} value={a.id}>{a.nombre_completo}</option>)}
            </select>
            <input type="number" placeholder="Monto $" className="bg-white border-none rounded-2xl px-6 py-4 font-bold text-sm text-black" onChange={e => setForm({...form, monto: Number(e.target.value)})} />
            <select className="bg-white border-none rounded-2xl px-6 py-4 font-bold text-sm text-black" onChange={e => setForm({...form, concepto: e.target.value as any})}>
              <option value="Inscripción">Inscripción</option>
              <option value="Mensualidad">Mensualidad</option>
              <option value="Examen">Examen</option>
            </select>
            <button onClick={handleAdd} className="bg-black text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest">Confirmar</button>
            <button onClick={() => setIsAdding(false)} className="bg-zinc-200 text-zinc-600 px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest">Cancelar</button>
          </div>
        )}

        <div className="bg-white border border-zinc-100 rounded-[48px] overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 text-[9px] font-black uppercase tracking-widest text-zinc-400">
              <tr>
                <th className="px-10 py-6">Folio</th>
                <th className="px-6 py-6">Alumno</th>
                <th className="px-6 py-6">Monto</th>
                <th className="px-6 py-6">Estatus</th>
                <th className="px-10 py-6 text-right">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {data.pagos.sort((a,b) => b.fecha_pago.localeCompare(a.fecha_pago)).map(p => {
                const alumno = data.alumnos.find(a => a.id === p.alumno_id);
                return (
                  <tr key={p.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-10 py-6 font-black text-xs text-zinc-400 uppercase tracking-widest">#{p.id}</td>
                    <td className="px-6 py-6">
                      <p className="font-bold text-black uppercase text-[11px]">{alumno?.nombre_completo || 'Desconocido'}</p>
                      <p className="text-[10px] text-zinc-400 font-medium">{p.concepto}</p>
                    </td>
                    <td className="px-6 py-6 font-black text-black text-sm">${p.monto.toLocaleString()}</td>
                    <td className="px-6 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        p.estatus === 'Pagado' ? 'bg-green-100 text-green-700' : 
                        p.estatus === 'Vencido' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {p.estatus}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right font-medium text-zinc-400 text-xs">{p.fecha_pago}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const ExpedientesGeneralView = () => {
    if (selectedAlumnoId) return <ExpedienteManager alumnoId={selectedAlumnoId} />;

    return (
      <div className="space-y-8 animate-in fade-in">
        <header>
          <h3 className="text-4xl font-black italic uppercase tracking-tighter">Control de Expedientes<span className="text-next-green">.</span></h3>
          <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest mt-2">Carga y administración de documentación oficial</p>
        </header>

        <div className="bg-white border border-zinc-100 rounded-[48px] overflow-hidden">
          <table className="w-full text-left">
             <thead className="bg-zinc-50 text-[9px] font-black uppercase tracking-widest text-zinc-400">
               <tr>
                 <th className="px-10 py-6">Alumno</th>
                 <th className="px-6 py-6">Progreso</th>
                 <th className="px-10 py-6 text-right">Administrar</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-zinc-50">
               {data.alumnos.map(a => {
                 const expediente = data.expedientes?.find(e => e.alumno_id === a.id);
                 const count = expediente ? Object.keys(expediente.docs).length : 0;
                 return (
                   <tr key={a.id} className="hover:bg-zinc-50/50 transition-colors">
                     <td className="px-10 py-6 font-black text-sm uppercase italic text-black">{a.nombre_completo}</td>
                     <td className="px-6 py-6">
                       <div className="w-full max-w-[200px] h-2 bg-zinc-100 rounded-full overflow-hidden">
                         <div className={`h-full transition-all duration-700 ${count === 4 ? 'bg-next-green' : 'bg-orange-400'}`} style={{ width: `${(count / 4) * 100}%` }}></div>
                       </div>
                       <p className="text-[9px] font-black uppercase tracking-widest mt-2 text-zinc-400">{count}/4 Cargados</p>
                     </td>
                     <td className="px-10 py-6 text-right">
                       <button 
                         onClick={() => setSelectedAlumnoId(a.id)}
                         className="bg-zinc-900 text-white px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-next-green transition-all"
                       >
                         Ver Expediente
                       </button>
                     </td>
                   </tr>
                 );
               })}
             </tbody>
          </table>
        </div>
      </div>
    );
  };

  // --- MAIN RENDER ---

  if (!currentSlug) {
    return (
      <div className="min-h-screen bg-white p-6 md:p-20 overflow-x-hidden">
        <header className="max-w-7xl mx-auto mb-20 text-center">
          <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter italic uppercase leading-none">
            NEXT<span className="text-next-green">.</span>
          </h1>
          <p className="text-zinc-400 font-bold uppercase tracking-[0.5em] text-xs mt-8">Panel Administrativo Multisede</p>
          <div className="mt-12 max-w-xl mx-auto">
            <input 
              type="text" 
              placeholder="BUSCAR CIUDAD..." 
              className="w-full bg-zinc-50 border-none rounded-[32px] px-10 py-6 text-center font-black text-sm uppercase tracking-widest focus:ring-2 focus:ring-next-green outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-700">
          {filteredCities.map(city => (
            <button 
              key={city.slug}
              onClick={() => setCurrentSlug(city.slug)}
              className="group bg-zinc-50 border border-zinc-100 p-10 rounded-[48px] text-left hover:bg-black hover:scale-105 transition-all duration-500 shadow-sm"
            >
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 group-hover:text-next-green transition-colors">REGIÓN MÉXICO</p>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter group-hover:text-white transition-colors">{city.name}</h3>
              <div className="mt-8 flex justify-end">
                <span className="text-3xl opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      <aside className="w-full md:w-80 bg-zinc-50 border-r border-zinc-100 p-10 flex flex-col fixed md:sticky top-0 h-screen">
        <button onClick={() => { setCurrentSlug(null); setSelectedAlumnoId(null); }} className="text-2xl font-black italic uppercase tracking-tighter mb-12 hover:opacity-50 transition-opacity">
          NEXT<span className="text-next-green">.</span>
        </button>
        
        <div className="mb-12">
          <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-2">Sede Seleccionada</p>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">{activeCity?.name}</h2>
        </div>

        <nav className="space-y-3 flex-1 overflow-y-auto">
          {[
            { id: 'alumnos', label: 'Alumnos', icon: '👥' },
            { id: 'expedientes', label: 'Expediente', icon: '📁' },
            { id: 'matriculas', label: 'Matrículas', icon: '📋' },
            { id: 'pagos', label: 'Pagos', icon: '💳' },
            { id: 'reportes', label: 'Reportes', icon: '📊' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id as any); if (item.id !== 'expedientes') setSelectedAlumnoId(null); }}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === item.id ? 'bg-black text-white shadow-xl shadow-black/20' : 'text-zinc-500 hover:bg-zinc-100'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button onClick={() => { setCurrentSlug(null); setSelectedAlumnoId(null); }} className="mt-auto pt-10 text-[9px] font-black text-zinc-400 uppercase tracking-widest hover:text-red-500 transition-colors">
          ← Cambiar de Ciudad
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-16 max-w-[1400px]">
        {activeTab === 'alumnos' && <AlumnosView />}
        {activeTab === 'pagos' && <PagosView />}
        {activeTab === 'expedientes' && <ExpedientesGeneralView />}
        {activeTab === 'matriculas' && (
          <div className="py-20 text-center space-y-4">
             <h2 className="text-5xl font-black italic uppercase opacity-10">Módulo en Desarrollo</h2>
             <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Gestión de Expedientes Digitales RVOE</p>
          </div>
        )}
        {activeTab === 'reportes' && (
          <div className="py-20 text-center space-y-4">
             <h2 className="text-5xl font-black italic uppercase opacity-10">Reportes Ejecutivos</h2>
             <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Análisis de KPIs y Exportación CSV</p>
          </div>
        )}
      </main>

      <AIAssistant />
    </div>
  );
};

export default App;
