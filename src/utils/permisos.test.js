import { describe, expect, it } from 'vitest';
import { esAdmin, puedeCancelarPedido, puedeGestionar, puedeGestionarUsuarios } from './permisos';
import { dinero, fechaSimple } from './formato';

describe('permisos por rol', () => {
  const admin = { rol: 'ADMIN' };
  const vendedor = { rol: 'VENDEDOR' };
  const cliente = { rol: 'CLIENTE' };

  it('solo ADMIN y VENDEDOR entran al panel de gestión', () => {
    expect(puedeGestionar(admin)).toBe(true);
    expect(puedeGestionar(vendedor)).toBe(true);
    expect(puedeGestionar(cliente)).toBe(false);
    expect(puedeGestionar(null)).toBe(false);
  });

  it('solo ADMIN gestiona usuarios', () => {
    expect(esAdmin(admin)).toBe(true);
    expect(puedeGestionarUsuarios(vendedor)).toBe(false);
  });

  it('el cliente cancela solo pedidos pendientes; el personal también en preparación', () => {
    expect(puedeCancelarPedido({ estado: 'PENDIENTE' }, cliente)).toBe(true);
    expect(puedeCancelarPedido({ estado: 'EN_PREPARACION' }, cliente)).toBe(false);
    expect(puedeCancelarPedido({ estado: 'EN_PREPARACION' }, vendedor)).toBe(true);
    expect(puedeCancelarPedido({ estado: 'EN_CAMINO' }, admin)).toBe(false);
  });
});

describe('formatos', () => {
  it('formatea pesos chilenos y fechas sin correr el día', () => {
    expect(dinero(3200)).toBe('$3.200');
    expect(fechaSimple('2026-11-21')).toBe('21-11-2026');
  });
});
