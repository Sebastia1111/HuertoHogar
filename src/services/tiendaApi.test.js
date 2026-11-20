import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  cambiarEstadoPedido,
  cancelarPedido,
  finalizarCompra,
  listarCatalogo,
  listarTodosPedidos,
  obtenerPedidos
} from './tiendaApi';
import { guardarAuth, limpiarAuth } from './session';

const respuestaJson = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  text: async () => (body === undefined ? '' : JSON.stringify(body))
});

describe('tiendaApi', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
    guardarAuth({
      accessToken: 'token-cliente',
      refreshToken: 'r',
      expiresIn: 900,
      usuario: { correo: 'ana@duocuc.cl', rol: 'CLIENTE' }
    });
  });

  afterEach(() => {
    limpiarAuth();
    vi.restoreAllMocks();
  });

  it('lista el catálogo con filtros', async () => {
    fetch.mockResolvedValue(respuestaJson(200, []));
    await listarCatalogo({ categoria: 'frutas', soloDisponibles: true });
    const url = fetch.mock.calls[0][0];
    expect(url).toContain('/api/tienda/catalogo?');
    expect(url).toContain('categoria=frutas');
  });

  it('envía el checkout con correo, items, referencia, fecha de entrega y token', async () => {
    fetch.mockResolvedValue(respuestaJson(201, { numero: 'HH-1001', total: 3200, productos: [] }));

    const respuesta = await finalizarCompra([{ codigo: 'FR003', cantidad: 5 }], 'WEB-1', {
      fechaEntrega: '2030-01-15'
    });

    const [url, opciones] = fetch.mock.calls[0];
    expect(url).toBe('/api/tienda/carrito/checkout');
    expect(opciones.method).toBe('POST');
    expect(opciones.headers.Authorization).toBe('Bearer token-cliente');
    expect(JSON.parse(opciones.body)).toEqual({
      correo: 'ana@duocuc.cl',
      items: [{ codigo: 'FR003', cantidad: 5 }],
      referencia: 'WEB-1',
      fechaEntrega: '2030-01-15'
    });
    expect(respuesta.numero).toBe('HH-1001');
  });

  it('no permite finalizar la compra sin sesión', async () => {
    limpiarAuth();
    await expect(finalizarCompra([], 'x')).rejects.toMatchObject({ status: 401 });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('consulta y cancela pedidos', async () => {
    fetch.mockResolvedValue(respuestaJson(200, []));
    await obtenerPedidos();
    expect(fetch.mock.calls[0][0]).toBe('/api/tienda/pedidos');

    fetch.mockResolvedValue(respuestaJson(200, { numero: 'HH-1001', estado: 'CANCELADO' }));
    await cancelarPedido('HH-1001');
    expect(fetch.mock.calls[1][0]).toBe('/api/tienda/pedidos/HH-1001/cancelar');
    expect(fetch.mock.calls[1][1].method).toBe('POST');
  });

  it('el personal filtra pedidos y cambia su estado', async () => {
    fetch.mockResolvedValue(respuestaJson(200, []));
    await listarTodosPedidos('PENDIENTE');
    expect(fetch.mock.calls[0][0]).toBe('/api/tienda/pedidos/todos?estado=PENDIENTE');

    fetch.mockResolvedValue(respuestaJson(200, { numero: 'HH-1001', estado: 'EN_PREPARACION' }));
    await cambiarEstadoPedido('HH-1001', 'EN_PREPARACION');
    const [url, opciones] = fetch.mock.calls[1];
    expect(url).toBe('/api/tienda/pedidos/HH-1001/estado');
    expect(opciones.method).toBe('PATCH');
    expect(JSON.parse(opciones.body).estado).toBe('EN_PREPARACION');
  });

  it('expone message y detalles cuando falta stock (409)', async () => {
    fetch.mockResolvedValue(
      respuestaJson(409, { message: 'Stock insuficiente', detalles: { PO001: 'Solo hay 50 unidades' } })
    );
    const error = await finalizarCompra([{ codigo: 'PO001', cantidad: 999 }], 'x').catch((e) => e);
    expect(error.status).toBe(409);
    expect(error.message).toBe('Stock insuficiente');
    expect(error.detalles.PO001).toContain('50');
  });
});
