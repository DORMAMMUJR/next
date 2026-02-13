
import { City } from './types';

export const CITIES: City[] = [
  { name: 'Ciudad de México', slug: 'ciudad-de-mexico' },
  { name: 'Guadalajara', slug: 'guadalajara' },
  { name: 'Monterrey', slug: 'monterrey' },
  { name: 'Puebla', slug: 'puebla' },
  { name: 'Tijuana', slug: 'tijuana' },
  { name: 'León', slug: 'leon' },
  { name: 'Ciudad Juárez', slug: 'ciudad-juarez' },
  { name: 'Torreón', slug: 'torreon' },
  { name: 'Querétaro', slug: 'queretaro' },
  { name: 'Mérida', slug: 'merida' },
  { name: 'Cancún', slug: 'cancun' },
  { name: 'Veracruz', slug: 'veracruz' },
  { name: 'Hermosillo', slug: 'hermosillo' },
  { name: 'Culiacán', slug: 'culiacan' },
  { name: 'Mazatlán', slug: 'mazatlan' },
  { name: 'Aguascalientes', slug: 'aguascalientes' },
  { name: 'San Luis Potosí', slug: 'san-luis-potosi' },
  { name: 'Toluca', slug: 'toluca' },
  { name: 'Morelia', slug: 'morelia' },
  { name: 'Oaxaca de Juárez', slug: 'oaxaca-de-juarez' },
  { name: 'Tuxtla Gutiérrez', slug: 'tuxtla-gutierrez' },
  { name: 'Villahermosa', slug: 'villahermosa' }
].sort((a, b) => a.name.localeCompare(b.name));

// Configuración de llaves de acceso por ciudad
// Si no hay llave definida, el acceso es libre.
export const CITY_KEYS: Record<string, string> = {
  "ciudad-de-mexico": "CDMX-NEXT",
  "guadalajara": "GDL-NEXT",
  "monterrey": "MTY-NEXT"
};
