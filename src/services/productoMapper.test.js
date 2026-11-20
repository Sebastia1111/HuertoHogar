import { describe, expect, it } from 'vitest';
import { aProductoFrontend, stocksDesdeProductos } from './productoMapper';

describe('productoMapper', () => {
  it('convierte el DTO del backend al formato del frontend', () => {
    const producto = aProductoFrontend({
      id: 1,
      codigo: 'FR001',
      nombre: 'Manzanas Fuji',
      descripcion: 'Ricas manzanas',
      precio: '1200.00',
      stock: 150,
      stockMinimo: 20,
      unidad: 'kilo',
      categoria: 'frutas',
      origen: 'Valle del Maule',
      emoji: '🍎',
      activo: true,
      disponible: true,
      stockBajo: false
    });

    expect(producto.precio).toBe(1200);
    expect(producto.stock).toBe(150);
    expect(producto.disponible).toBe(true);
    expect(producto.stockBajo).toBe(false);
  });

  it('marca stock bajo cuando el stock no supera el mínimo', () => {
    const producto = aProductoFrontend({
      codigo: 'FR001',
      precio: 1200,
      stock: 5,
      stockMinimo: 10,
      categoria: 'frutas'
    });

    expect(producto.stockBajo).toBe(true);
    expect(producto.disponible).toBe(true);
  });

  it('construye el mapa de stocks por código', () => {
    const stocks = stocksDesdeProductos([
      { codigo: 'FR001', stock: 150 },
      { codigo: 'VR001', stock: 100 }
    ]);

    expect(stocks).toEqual({ FR001: 150, VR001: 100 });
  });
});
