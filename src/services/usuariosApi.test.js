import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { actualizarMiPerfil, cambiarMiClave, listarUsuarios, obtenerMiPerfil } from './usuariosApi';
import { guardarAuth, limpiarAuth } from './session';

const respuestaJson = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  text: async () => (body === undefined ? '' : JSON.stringify(body))
});

describe('usuariosApi', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
    guardarAuth({ accessToken: 'tok', refreshToken: 'r', expiresIn: 900, usuario: { correo: 'a@gmail.com', rol: 'CLIENTE' } });
  });

  afterEach(() => {
    limpiarAuth();
    vi.restoreAllMocks();
  });

  it('obtiene el perfil propio con el token', async () => {
    fetch.mockResolvedValue(respuestaJson(200, { correo: 'a@gmail.com' }));
    await obtenerMiPerfil();
    const [url, opciones] = fetch.mock.calls[0];
    expect(url).toBe('/api/usuarios/me');
    expect(opciones.headers.Authorization).toBe('Bearer tok');
  });

  it('actualiza el perfil con PUT', async () => {
    fetch.mockResolvedValue(respuestaJson(200, { direccion: 'Nueva 123' }));
    await actualizarMiPerfil({ nombre: 'Ana', direccion: 'Nueva 123' });
    const [url, opciones] = fetch.mock.calls[0];
    expect(url).toBe('/api/usuarios/me');
    expect(opciones.method).toBe('PUT');
  });

  it('cambia la clave y entrega los errores por campo', async () => {
    fetch.mockResolvedValue(
      respuestaJson(400, { message: 'La contrasena actual no es correcta', detalles: { claveActual: 'Incorrecta' } })
    );
    const error = await cambiarMiClave('mala', 'nueva1').catch((e) => e);
    expect(fetch.mock.calls[0][0]).toBe('/api/usuarios/me/password');
    expect(error.status).toBe(400);
    expect(error.detalles.claveActual).toBe('Incorrecta');
  });

  it('lista usuarios (ADMIN) con filtro de rol', async () => {
    fetch.mockResolvedValue(respuestaJson(200, []));
    await listarUsuarios('CLIENTE');
    expect(fetch.mock.calls[0][0]).toBe('/api/usuarios?rol=CLIENTE');
  });
});
