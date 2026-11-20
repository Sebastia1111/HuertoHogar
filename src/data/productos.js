// src/data/productos.js
// Catálogo de respaldo (fallback) cuando el microservicio de inventario no está disponible.
// Los datos coinciden con la migración V2 del servicio de inventario.
export const PRODUCTOS = [
  {
    codigo: 'FR001',
    nombre: 'Manzanas Fuji',
    precio: 1200,
    stock: 150,
    stockMinimo: 20,
    unidad: 'kilo',
    categoria: 'frutas',
    emoji: '🍎',
    origen: 'Valle del Maule',
    descripcion: 'Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule.',
    practicasSostenibles: 'Cultivo de temporada con manejo integrado de plagas y cosecha manual.'
  },
  {
    codigo: 'FR002',
    nombre: 'Naranjas Valencia',
    precio: 1000,
    stock: 200,
    stockMinimo: 20,
    unidad: 'kilo',
    categoria: 'frutas',
    emoji: '🍊',
    origen: 'Coquimbo',
    descripcion: 'Jugosas y ricas en vitamina C, ideales para zumos frescos.',
    practicasSostenibles: 'Riego por goteo y recolección en el punto óptimo de madurez.'
  },
  {
    codigo: 'FR003',
    nombre: 'Plátanos Cavendish',
    precio: 800,
    stock: 250,
    stockMinimo: 25,
    unidad: 'kilo',
    categoria: 'frutas',
    emoji: '🍌',
    origen: 'Ecuador',
    descripcion: 'Plátanos maduros y dulces, ricos en potasio y energía.',
    practicasSostenibles: 'Proveedores con certificación de comercio justo.'
  },
  {
    codigo: 'VR001',
    nombre: 'Zanahorias Orgánicas',
    precio: 900,
    stock: 100,
    stockMinimo: 15,
    unidad: 'kilo',
    categoria: 'verduras',
    emoji: '🥕',
    origen: "Región de O'Higgins",
    descripcion: 'Zanahorias crujientes cultivadas sin pesticidas.',
    practicasSostenibles: 'Producción orgánica certificada, sin pesticidas ni fertilizantes sintéticos.'
  },
  {
    codigo: 'VR002',
    nombre: 'Espinacas Frescas',
    precio: 700,
    stock: 80,
    stockMinimo: 15,
    unidad: 'bolsa de 500g',
    categoria: 'verduras',
    emoji: '🥬',
    origen: 'Santiago',
    descripcion: 'Espinacas frescas y nutritivas para ensaladas.',
    practicasSostenibles: 'Cultivo hidropónico con uso reducido de agua.'
  },
  {
    codigo: 'VR003',
    nombre: 'Pimientos Tricolores',
    precio: 1500,
    stock: 120,
    stockMinimo: 15,
    unidad: 'kilo',
    categoria: 'verduras',
    emoji: '🫑',
    origen: 'Valle Central',
    descripcion: 'Pimientos rojos, amarillos y verdes, ricos en antioxidantes y vitaminas.',
    practicasSostenibles: 'Manejo integrado de plagas y envases reutilizables.'
  },
  {
    codigo: 'PO001',
    nombre: 'Miel Orgánica',
    precio: 5000,
    stock: 50,
    stockMinimo: 10,
    unidad: 'frasco de 500g',
    categoria: 'organicos',
    emoji: '🍯',
    origen: 'Apicultores locales',
    descripcion: 'Miel pura producida por apicultores locales.',
    practicasSostenibles: 'Apicultura regenerativa que protege la polinización local.'
  },
  {
    codigo: 'PO003',
    nombre: 'Quinua Orgánica',
    precio: 4500,
    stock: 40,
    stockMinimo: 10,
    unidad: 'bolsa de 500g',
    categoria: 'organicos',
    emoji: '🌾',
    origen: 'Altiplano chileno',
    descripcion: 'Grano ancestral con alto contenido proteico, ideal para ensaladas y guisos.',
    practicasSostenibles: 'Cultivo rotativo de pequeños agricultores, sin pesticidas.'
  },
  {
    codigo: 'PL001',
    nombre: 'Leche Entera',
    precio: 950,
    stock: 120,
    stockMinimo: 20,
    unidad: 'litro',
    categoria: 'lacteos',
    emoji: '🥛',
    origen: 'Granjas locales',
    descripcion: 'Leche entera fresca rica en calcio y nutrientes.',
    practicasSostenibles: 'Ganadería de pastoreo con bienestar animal y trazabilidad por lote.'
  }
];

export const INFO_SECCIONES = [
  { id: 'historia', icono: '🌱', titulo: 'Nuestra historia', bajada: 'más de 6 años del campo a tu mesa', detalle: 'Partimos despachando cajas de verduras dentro de Santiago y hoy llegamos a las principales ciudades de Chile.' },
  { id: 'impacto', icono: '🌍', titulo: 'Nuestro impacto', bajada: 'comercio justo y agricultura local', detalle: 'Compramos directo a agricultores locales, fomentando la producción sostenible y justa.' },
  { id: 'despacho', icono: '🚚', titulo: 'Despacho a domicilio', bajada: 'frescura en 24 a 48 horas', detalle: 'Cosechamos y preparamos tu pedido el mismo día con despacho refrigerado.' }
];
