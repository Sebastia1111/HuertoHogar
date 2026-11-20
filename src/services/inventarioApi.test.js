import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, actualizarStock } from './inventarioApi';

const respuestaJson = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  text: async () => JSON.stringify(body)
});

describe('inventarioApi', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('envía el PATCH de stock con el motivo', async () => {
    fetch.mockResolvedValue(respuestaJson(200, { codigo: 'FR001', stock: 10 }));

    await actualizarStock(7, 10, 'Conteo físico');

    expect(fetch).toHaveBeenCalledWith(
      '/api/inventario/productos/7/stock',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ stock: 10, motivo: 'Conteo físico' })
      })
    );
  });

  it('propaga el mensaje de error del backend', async () => {
    fetch.mockResolvedValue(
      respuestaJson(403, { message: 'Tu rol no tiene permiso para este recurso' })
    );

    await expect(actualizarStock(7, 10)).rejects.toMatchObject({
      name: 'ApiError',
      status: 403,
      message: expect.stringContaining('permiso')
    });
  });

  it('convierte un fallo de red en ApiError', async () => {
    fetch.mockRejectedValue(new TypeError('Failed to fetch'));

    const error = await actualizarStock(7, 10).catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toContain('No se pudo conectar');
  });
});
