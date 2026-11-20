// src/services/productoMapper.js
// Traduce entre el DTO del microservicio y la forma que usan los componentes.

export const aProductoFrontend = (dto) => {
  const stock = Number(dto?.stock ?? 0);
  const stockMinimo = Number(dto?.stockMinimo ?? 0);

  return {
    id: dto?.id,
    codigo: dto?.codigo,
    nombre: dto?.nombre,
    descripcion: dto?.descripcion,
    precio: Number(dto?.precio ?? 0),
    stock,
    stockMinimo,
    unidad: dto?.unidad,
    categoria: dto?.categoria,
    origen: dto?.origen,
    emoji: dto?.emoji,
    practicasSostenibles: dto?.practicasSostenibles,
    imagenUrl: dto?.imagenUrl,
    activo: dto?.activo ?? true,
    disponible: dto?.disponible ?? stock > 0,
    stockBajo: dto?.stockBajo ?? stock <= stockMinimo
  };
};

export const stocksDesdeProductos = (productos) =>
  Object.fromEntries((productos || []).map((producto) => [producto.codigo, producto.stock]));
