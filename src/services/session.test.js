import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { refrescarSesion } from './authApi';
import {
  CLAVE_AUTH,
  guardarAuth,
  leerAuth,
  limpiarAuth,
  obtenerAccessToken
} from './session';

vi.mock('./authApi', () => ({
  refrescarSesion: vi.fn()
}));

const authValida = () => ({
  accessToken: 'access-vigente',
  refreshToken: 'refresh-1',
  expiresIn: 900,
  usuario: { correo: 'cliente@huertohogar.cl', rol: 'CLIENTE' }
});

describe('session', () => {
  beforeEach(() => {
    localStorage.clear();
    refrescarSesion.mockReset();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('guarda y recupera la sesión desde localStorage', () => {
    guardarAuth(authValida());

    const auth = leerAuth();
    expect(auth.accessToken).toBe('access-vigente');
    expect(auth.usuario.rol).toBe('CLIENTE');
    expect(auth.expiresAt).toBeGreaterThan(Date.now());
  });

  it('elimina la sesión guardada', () => {
    guardarAuth(authValida());
    limpiarAuth();

    expect(localStorage.getItem(CLAVE_AUTH)).toBeNull();
    expect(leerAuth()).toBeNull();
  });

  it('devuelve el access token cuando aún está vigente', async () => {
    guardarAuth(authValida());

    await expect(obtenerAccessToken()).resolves.toBe('access-vigente');
    expect(refrescarSesion).not.toHaveBeenCalled();
  });

  it('renueva el token cuando ya expiró', async () => {
    guardarAuth({ ...authValida(), expiresIn: -10 });
    refrescarSesion.mockResolvedValue({
      accessToken: 'access-renovado',
      refreshToken: 'refresh-2',
      expiresIn: 900,
      usuario: { correo: 'cliente@huertohogar.cl', rol: 'CLIENTE' }
    });

    await expect(obtenerAccessToken()).resolves.toBe('access-renovado');
    expect(refrescarSesion).toHaveBeenCalledWith('refresh-1');
    expect(leerAuth().accessToken).toBe('access-renovado');
  });

  it('limpia la sesión y avisa cuando el refresh falla', async () => {
    guardarAuth({ ...authValida(), expiresIn: -10 });
    refrescarSesion.mockRejectedValue(new Error('refresh inválido'));
    const alExpirar = vi.fn();
    window.addEventListener('hh:sesion-expirada', alExpirar);

    await expect(obtenerAccessToken()).resolves.toBeNull();

    expect(leerAuth()).toBeNull();
    expect(alExpirar).toHaveBeenCalled();
    window.removeEventListener('hh:sesion-expirada', alExpirar);
  });
});
