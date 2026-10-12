// src/data/productos.js
// src/data/productos.js
export const PRODUCTOS = [
  { codigo: 'FR001', nombre: 'Manzanas Fuji', precio: 1200, stock: 150, unidad: 'kilo', categoria: 'frutas', emoji: '🍎', origen: 'Valle del Maule', descripcion: 'Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule.' },
  { codigo: 'FR002', nombre: 'Naranjas Valencia', precio: 1000, stock: 200, unidad: 'kilo', categoria: 'frutas', emoji: '🍊', origen: 'Coquimbo', descripcion: 'Jugosas y ricas en vitamina C, ideales para zumos frescos.' },
  { codigo: 'FR003', nombre: 'Plátanos Cavendish', precio: 800, stock: 250, unidad: 'kilo', categoria: 'frutas', emoji: '🍌', origen: 'Ecuador', descripcion: 'Plátanos maduros y dulces, ricos en potasio y energía.' },
  { codigo: 'VR001', nombre: 'Zanahorias Orgánicas', precio: 900, stock: 100, unidad: 'kilo', categoria: 'verduras', emoji: '🥕', origen: "Región de O'Higgins", descripcion: 'Zanahorias crujientes cultivadas sin pesticidas.' },
  { codigo: 'VR002', nombre: 'Espinacas Frescas', precio: 700, stock: 80, unidad: 'bolsa de 500g', categoria: 'verduras', emoji: '🥬', origen: 'Santiago', descripcion: 'Espinacas frescas y nutritivas para ensaladas.' },
  { codigo: 'PO001', nombre: 'Miel Orgánica', precio: 5000, stock: 50, unidad: 'frasco de 500g', categoria: 'organicos', emoji: '🍯', origen: 'Apicultores locales', descripcion: 'Miel pura producida por apicultores locales.' },
  { codigo: 'PL001', nombre: 'Leche Entera', precio: 950, stock: 120, unidad: 'litro', categoria: 'lacteos', emoji: '🥛', origen: 'Granjas locales', descripcion: 'Leche entera fresca rica en calcio y nutrientes.' }
];

export const INFO_SECCIONES = [
  { id: 'historia', icono: '🌱', titulo: 'Nuestra historia', bajada: 'más de 6 años del campo a tu mesa', detalle: 'Partimos despachando cajas de verduras dentro de Santiago y hoy llegamos a las principales ciudades de Chile.' },
  { id: 'impacto', icono: '🌍', titulo: 'Nuestro impacto', bajada: 'comercio justo y agricultura local', detalle: 'Compramos directo a agricultores locales, fomentando la producción sostenible y justa.' },
  { id: 'despacho', icono: '🚚', titulo: 'Despacho a domicilio', bajada: 'frescura en 24 a 48 horas', detalle: 'Cosechamos y preparamos tu pedido el mismo día con despacho refrigerado.' }
];