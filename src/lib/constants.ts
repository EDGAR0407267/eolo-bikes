export const SITE_URL = 'https://eolobikes.com';
export const SITE_NAME = 'EOLO Bikes';
export const LOGO_PATH = '/images/eolo-logo.svg';
export const OG_IMAGE_PATH = '/images/eolo-og.jpg';

export const INSTAGRAM_URL = 'https://www.instagram.com/eolobikes/';
export const WHATSAPP_URL = 'https://wa.me/34621277840';
export const PHONE_NUMBER = '621 27 78 40';
export const PHONE_NUMBER_E164 = '+34621277840';
export const ADDRESS = 'Av. Barcelona 111, Miami Platja';
export const MAPS_URL =
  'https://www.google.com/maps?q=Av.+Barcelona+111,+Miami+Platja';

export const BUSINESS_HOURS = [
  {
    dayOfWeek: 'Monday',
    label: 'Lunes',
    ranges: [
      ['09:00', '13:30'],
      ['16:30', '20:00'],
    ],
  },
  {
    dayOfWeek: 'Tuesday',
    label: 'Martes',
    ranges: [
      ['09:00', '13:30'],
      ['16:30', '20:00'],
    ],
  },
  {
    dayOfWeek: 'Wednesday',
    label: 'Miércoles',
    ranges: [
      ['09:00', '13:30'],
      ['16:30', '20:00'],
    ],
  },
  {
    dayOfWeek: 'Thursday',
    label: 'Jueves',
    ranges: [
      ['09:00', '13:30'],
      ['16:30', '20:00'],
    ],
  },
  {
    dayOfWeek: 'Friday',
    label: 'Viernes',
    ranges: [
      ['09:00', '13:30'],
      ['16:30', '20:00'],
    ],
  },
  {
    dayOfWeek: 'Saturday',
    label: 'Sábado',
    ranges: [['09:00', '13:30']],
  },
  {
    dayOfWeek: 'Sunday',
    label: 'Domingo',
    ranges: [],
  },
] as const;

export const OPENING_HOURS_SPECIFICATION = BUSINESS_HOURS.flatMap(
  ({ dayOfWeek, ranges }) =>
    ranges.map(([opens, closes]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [dayOfWeek],
      opens,
      closes,
    })),
);

export const MAIN_ROUTES = [
  { label: 'Inicio', href: '/' },
  { label: 'Venta', href: '/venta-bicicletas-miami-platja/' },
  { label: 'Taller', href: '/taller-bicicletas-miami-platja/' },
  { label: 'Alquiler', href: '/alquiler-bicicletas-miami-platja/' },
  { label: 'Contacto', href: '/contacto/' },
] as const;

export const AREA_SERVED = [
  'Miami Platja',
  'Costa Dorada',
  'Tarragona',
  'Mont-roig del Camp',
  "Hospitalet de l'Infant",
  'Cambrils',
] as const;

export const NAV_LINKS = [
  { label: 'Inicio', href: '/#inicio' },
  { label: 'Venta', href: '/venta-bicicletas-miami-platja' },
  { label: 'Taller', href: '/taller-bicicletas-miami-platja' },
  { label: 'Alquiler', href: '/alquiler-bicicletas-miami-platja' },
  { label: 'Contacto', href: '/contacto' },
] as const;

export const SERVICES = [
  {
    id: 'venta',
    title: 'Venta de bicicletas',
    description:
      'Te ayudamos a elegir la bicicleta adecuada según tu uso, nivel y presupuesto. Asesoramiento sin presión.',
    href: '/venta-bicicletas-miami-platja',
    cta: 'Ver opciones',
  },
  {
    id: 'taller',
    title: 'Taller y mantenimiento',
    description:
      'Ajustes, revisiones y reparaciones precisas para que tu bici vuelva a rodar como debe.',
    href: '/taller-bicicletas-miami-platja',
    cta: 'Reservar taller',
  },
  {
    id: 'alquiler',
    title: 'Alquiler de bicicletas',
    description:
      'Alquila tu bici en Miami Platja y descubre la costa, las calas y las rutas cercanas a tu ritmo.',
    href: '/alquiler-bicicletas-miami-platja',
    cta: 'Consultar alquiler',
  },
] as const;

export const WORKSHOP_ITEMS = [
  'Revisión general',
  'Ajuste de cambios',
  'Ajuste de frenos',
  'Cambio de cámaras y cubiertas',
  'Mantenimiento de transmisión',
  'Puesta a punto completa',
  'Montaje de componentes',
] as const;

export const RENTAL_ITEMS = [
  { label: 'Alquiler por día', icon: 'Clock' },
  { label: 'Alquiler varios días', icon: 'Compass' },
  { label: 'Rutas familiares', icon: 'Route' },
  { label: 'Cascos y accesorios', icon: 'ShieldCheck' },
  { label: 'Recomendaciones locales', icon: 'Map' },
] as const;

export const ROUTES = [
  {
    title: 'Ruta Naranja: Miami Platja → Cambrils → Mont-roig',
    description: 'Circuito costero e interior por carretera que enlaza Miami Platja con Cambrils y regresa por Mont-roig del Camp. Terreno llano, ideal para todos los niveles y para estrenar piernas.',
    distance: '33 km',
    elevation: '180 m',
    difficulty: 'Fácil',
    type: 'Carretera',
    url: 'https://www.catalunya.com/ruta-de-cicloturismo-de-carretera-naranja-miami-platja-cambrils-mont-roig-del-camp-24-1-446150?language=es',
  },
  {
    title: 'Serra de Llaveria: Miami Platja → Pratdip → Hospitalet',
    description: 'La ruta más espectacular de la zona. Sube por la Serra de Llaveria atravesando Pratdip y baja hasta Hospitalet de l\'Infant con vistas al mar. Ideal para gravel o MTB.',
    distance: '34 km',
    elevation: '590 m',
    difficulty: 'Media-Alta',
    type: 'Gravel / MTB',
    url: 'https://www.wikiloc.com/mountain-biking-trails/miami-platja-senders-i-trialeres-de-montroig-i-pratdip-hospitalet-infant-miami-platja-146036044',
  },
  {
    title: 'Costa Sud: Miami Platja → L\'Ametlla de Mar',
    description: 'Ruta costera hacia el sur bordeando el litoral de la Costa Daurada. Paisaje mediterráneo, poco tráfico y calas escondidas. Perfecta para un alquiler de medio día.',
    distance: '28 km',
    elevation: '120 m',
    difficulty: 'Fácil',
    type: 'Carretera',
    url: 'https://www.wikiloc.com/trails/cycling/spain/catalonia/miami-platja',
  },
  {
    title: 'Ruta Verde: Miami Platja → Falset → Colldejou → Mont-roig',
    description: 'Vuelta larga por el interior de la Terra Alta pasando por Falset, el Coll de Fatxes y Colldejou. Paisajes de viña y algarrobo, puertos de montaña y el regreso por Mont-roig.',
    distance: '81 km',
    elevation: '1.050 m',
    difficulty: 'Avanzada',
    type: 'Carretera',
    url: 'https://www.catalunya.com/ruta-de-cicloturismo-de-carretera-verde-miami-platja-falset-colldejou-mont-roig-del-camp-miami-platja-24-1-446151?language=es',
  },
] as const;
