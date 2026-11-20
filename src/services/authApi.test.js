import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AuthError,
  cerrarSesion,
  iniciarSesion,
  obtenerPerfil,
  registrarUsuario
} from './authApi';

const respuestaJson = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  text: async () => (body === undefined ? '' : JSON.stringify(body))
});

describe('authApi', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('envía las credenciales al endpoint de login', async () => {
    fetch.mockResolvedValue(
      respuestaJson(200, {
        accessToken: 'access-1',
        refreshToken: 'refresh-1',
        expiresIn: 900,
        usuario: { correo: 'cliente@huertohogar.cl', rol: 'CLIENTE' }
      })
    );

    const respuesta = await iniciarSesion('cliente@huertohogar.cl', '12345');

    expect(fetch).toHaveBeenCalledWith(
      '/api/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          correo: 'cliente@huertohogar.cl',
          clave: '12345'
        })
      })
    );
    expect(respuesta.accessToken).toBe('access-1');
  });

  it('registra un usuario con sus datos personales', async () => {
    fetch.mockResolvedValue(respuestaJson(201, { accessToken: 'a', usuario: {} }));

    await registrarUsuario({
      run: '19011022K',
      nombre: 'Ana',
      apellidos: 'Pérez',
      correo: 'ana@duocuc.cl',
      clave: '12345'
    });

    const [url, opciones] = fetch.mock.calls[0];
    expect(url).toBe('/api/auth/registro');
    expect(JSON.parse(opciones.body).correo).toBe('ana@duocuc.cl');
  });

  it('envía el access token al consultar el perfil', async () => {
    fetch.mockResolvedValue(respuestaJson(200, { correo: 'admin@huertohogar.cl' }));

    await obtenerPerfil('token-123');

    expect(fetch).toHaveBeenCalledWith(
      '/api/auth/me',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer token-123' })
      })
    );
  });

  it('expone el estado 401 cuando las credenciales son incorrectas', async () => {
    fetch.mockResolvedValue(
      respuestaJson(401, { message: 'Correo o contraseña incorrectos' })
    );

    await expect(iniciarSesion('x@y.cl', 'mala')).rejects.toMatchObject({
      name: 'AuthError',
      status: 401
    });
  });

  it('convierte un fallo de red en AuthError', async () => {
    fetch.mockRejectedValue(new TypeError('Failed to fetch'));

    const error = await obtenerPerfil('token').catch((e) => e);

    expect(error).toBeInstanceOf(AuthError);
    expect(error.message).toContain('No se pudo conectar');
  });

  it('no intenta leer cuerpo en un logout 204', async () => {
    fetch.mockResolvedValue(respuestaJson(204));

    await expect(cerrarSesion('token-123')).resolves.toBeNull();
  });
});
