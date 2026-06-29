export const argentinianProvinces = [
  { value: 'BA', label: 'Buenos Aires' },
  { value: 'CABA', label: 'CABA' },
  { value: 'CATAMARCA', label: 'Catamarca' },
  { value: 'CHACO', label: 'Chaco' },
  { value: 'CHUBUT', label: 'Chubut' },
  { value: 'CORDOBA', label: 'Córdoba' },
  { value: 'CORRIENTES', label: 'Corrientes' },
  { value: 'ENTRE_RIOS', label: 'Entre Ríos' },
  { value: 'FORMOSA', label: 'Formosa' },
  { value: 'JUJUY', label: 'Jujuy' },
  { value: 'LA_PAMPA', label: 'La Pampa' },
  { value: 'LA_RIOJA', label: 'La Rioja' },
  { value: 'MENDOZA', label: 'Mendoza' },
  { value: 'MISIONES', label: 'Misiones' },
  { value: 'NEUQUEN', label: 'Neuquén' },
  { value: 'RIO_NEGRO', label: 'Río Negro' },
  { value: 'SALTA', label: 'Salta' },
  { value: 'SAN_JUAN', label: 'San Juan' },
  { value: 'SAN_LUIS', label: 'San Luis' },
  { value: 'SANTA_CRUZ', label: 'Santa Cruz' },
  { value: 'SANTA_FE', label: 'Santa Fe' },
  { value: 'SANTIAGO_DEL_ESTERO', label: 'Santiago del Estero' },
  { value: 'TIERRA_DEL_FUEGO', label: 'Tierra del Fuego' },
  { value: 'TUCUMAN', label: 'Tucumán' },
];

export const localitiesByProvince: Record<string, { value: string; label: string }[]> = {
  BA: [
    { value: 'CABA', label: 'CABA' },
    { value: 'LA_MATANZA', label: 'La Matanza' },
    { value: 'CASEROS', label: 'Caseros' },
    { value: 'SAN_ISIDRO', label: 'San Isidro' },
    { value: 'LOMAS_DE_ZAMORA', label: 'Lomas de Zamora' },
    { value: 'LA_PLATA', label: 'La Plata' },
    { value: 'QUILMES', label: 'Quilmes' },
    { value: 'AVELLANEDA', label: 'Avellaneda' },
    { value: 'BERAZATEGUI', label: 'Berazategui' },
    { value: 'FLORES', label: 'Flores' },
    { value: 'ITUZAINGO', label: 'Ituzaingó' },
    { value: 'MORENO', label: 'Moreno' },
    { value: 'MORÓN', label: 'Morón' },
    { value: 'LANÚS', label: 'Lanús' },
    { value: 'GLEW', label: 'Glew' },
    { value: 'GONZALEZ_CATAN', label: 'González Catán' },
    { value: 'HURLINGHAM', label: 'Hurlingham' },
    { value: 'RAFAEL_CALZADA', label: 'Rafael Calzada' },
    { value: 'RAMOS_MEJIA', label: 'Ramos Mejía' },
    { value: 'SAN_MARTIN', label: 'San Martín' },
  ],
  CABA: [
    { value: 'CENTRO', label: 'Centro' },
    { value: 'NORTE', label: 'Zona Norte (Belgrano, Colegiales)' },
    { value: 'OESTE', label: 'Zona Oeste (Caballito, Villa Devoto)' },
    { value: 'SUR', label: 'Zona Sur (San Telmo, La Boca)' },
  ],
  CORDOBA: [
    { value: 'CORDOBA_CAPITAL', label: 'Córdoba (Capital)' },
    { value: 'RIO_CUARTO', label: 'Río Cuarto' },
    { value: 'VILLA_MARIA', label: 'Villa María' },
  ],
  SANTA_FE: [
    { value: 'ROSARIO', label: 'Rosario' },
    { value: 'SANTA_FE_CAPITAL', label: 'Santa Fe (Capital)' },
    { value: 'VENADO_TUERTO', label: 'Venado Tuerto' },
  ],
  MENDOZA: [
    { value: 'MENDOZA_CAPITAL', label: 'Mendoza (Capital)' },
    { value: 'SAN_RAFAEL', label: 'San Rafael' },
    { value: 'GODOY_CRUZ', label: 'Godoy Cruz' },
  ],
};

export const personalTraitOptions = [
  'Atenta/o',
  'Simpática/o',
  'Paciente',
  'Confiable',
  'Prolija/o',
  'Puntual',
  'Organizada/o',
  'Responsable',
  'Honesta/o',
  'Creativa/o',
  'Flexible',
  'Comunicativa/o',
];

export const languageOptions = [
  { value: 'ES', label: 'Español' },
  { value: 'EN', label: 'Inglés' },
];

export const nannyAgeGroups = [
  { value: '0-3', label: 'Bebés (0-3 años)' },
  { value: '3-6', label: 'Preescolares (3-6 años)' },
  { value: '6-12', label: 'Primaria (6-12 años)' },
  { value: '12+', label: 'Adolescentes (12+ años)' },
];
