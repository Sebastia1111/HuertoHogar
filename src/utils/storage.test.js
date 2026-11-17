

//Este prueba si el calculo del 20% de descuento se aplica a usuarios Duoc UC

// src/utils/storage.test.js
import { describe, it, expect } from 'vitest';
import { tieneDescuentoDuoc, calcularPrecioReal } from './storage';

describe('Pruebas unitarias de storage.js (Descuentos y Precios)', () => {
  it('debe detectar correctamente el descuento para usuarios con correo @duocuc.cl', () => {
    const sesionDuoc = { correo: 'alumno@duocuc.cl' };
    const sesionNormal = { correo: 'cliente@gmail.com' };

    expect(tieneDescuentoDuoc(sesionDuoc)).toBe(true);
    expect(tieneDescuentoDuoc(sesionNormal)).toBe(false);
    expect(tieneDescuentoDuoc(null)).toBe(false);
  });

  it('debe aplicar un 20% de descuento al precio original para alumnos Duoc', () => {
    const sesionDuoc = { correo: 'alumno@duocuc.cl' };
    const precioBase = 1000;

    const precioFinal = calcularPrecioReal(precioBase, sesionDuoc);
    expect(precioFinal).toBe(800); // 1000 - 20% = 800
  });

  it('debe mantener el precio normal para otros usuarios', () => {
    const sesionNormal = { correo: 'cliente@gmail.com' };
    const precioBase = 1000;

    const precioFinal = calcularPrecioReal(precioBase, sesionNormal);
    expect(precioFinal).toBe(1000);
  });
});
