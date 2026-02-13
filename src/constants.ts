
import { City } from './types';

export const CITIES: City[] = [
  { name: 'Aguascalientes', slug: 'aguascalientes' },
  { name: 'Baja California', slug: 'baja-california' },
  { name: 'Baja California Sur', slug: 'baja-california-sur' },
  { name: 'Campeche', slug: 'campeche' },
  { name: 'Chiapas', slug: 'chiapas' },
  { name: 'Chihuahua', slug: 'chihuahua' },
  { name: 'Ciudad de México', slug: 'ciudad-de-mexico' },
  { name: 'Coahuila', slug: 'coahuila' },
  { name: 'Colima', slug: 'colima' },
  { name: 'Durango', slug: 'durango' },
  { name: 'Estado de México', slug: 'estado-de-mexico' },
  { name: 'Guanajuato', slug: 'guanajuato' },
  { name: 'Guerrero', slug: 'guerrero' },
  { name: 'Hidalgo', slug: 'hidalgo' },
  { name: 'Jalisco', slug: 'jalisco' },
  { name: 'Michoacán', slug: 'michoacan' },
  { name: 'Morelos', slug: 'morelos' },
  { name: 'Nayarit', slug: 'nayarit' },
  { name: 'Nuevo León', slug: 'nuevo-leon' },
  { name: 'Oaxaca', slug: 'oaxaca' },
  { name: 'Puebla', slug: 'puebla' },
  { name: 'Querétaro', slug: 'queretaro' },
  { name: 'Quintana Roo', slug: 'quintana-roo' },
  { name: 'San Luis Potosí', slug: 'san-luis-potosi' },
  { name: 'Sinaloa', slug: 'sinaloa' },
  { name: 'Sonora', slug: 'sonora' },
  { name: 'Tabasco', slug: 'tabasco' },
  { name: 'Tamaulipas', slug: 'tamaulipas' },
  { name: 'Tlaxcala', slug: 'tlaxcala' },
  { name: 'Veracruz', slug: 'veracruz' },
  { name: 'Yucatán', slug: 'yucatan' },
  { name: 'Zacatecas', slug: 'zacatecas' }
].sort((a, b) => a.name.localeCompare(b.name));

// Configuración de llaves de acceso por ciudad
// Si no hay llave definida, el acceso es libre.
export const CITY_KEYS: Record<string, string> = {
  "ciudad-de-mexico": "CDMX-NEXT",
  "guadalajara": "GDL-NEXT",
  "monterrey": "MTY-NEXT"
};
