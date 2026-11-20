import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as authApi from '../services/authApi';
import { CLAVE_AUTH } from '../services/session';
import { useAuth } from './useAuth';

vi.mock('../services/authApi', () => ({
  iniciarSesion: vi.fn(),
  registrarUsuario: vi.fn(),
  refrescarSesion: vi.fn(),
  obtenerPerfil: vi.fn(),
  cerrarSesion: vi.fn()
}));

const usuario = {
  id: 2,
  run: '22222222K',
  nombre: 'Cliente',
  apellidos: 'Demo',
  correo: 'cliente@huertohogar.cl',
  rol: 'CLIENTE',
  tipo: 'Cliente'
};

const respuestaAuth = {
  accessToken: 'access-1',
  refreshToken: 'refresh-1',
  tokenType: 'Bearer',
  expiresIn: 900,
  usuario
};

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('inicia sesión, guarda el JWT y expone el rol', async () => {
    authApi.iniciarSesion.mockResolvedValue(respuestaAuth);
    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.verificandoSesion).toBe(false));

    await act(async () => {
      await result.current.iniciarSesion('cliente@huertohogar.cl', '12345');
    });

    expect(result.current.sesion).toMatchObject({
      correo: 'cliente@huertohogar.cl',
      rol: 'CLIENTE',
      tipo: 'Cliente'
    });
    expect(result.current.puedeAdministrar).toBe(false);
    expect(JSON.parse(localStorage.getItem(CLAVE_AUTH)).accessToken).toBe('access-1');
  });

  it('restaura la sesión guardada y la revalida con /me', async () => {
    localStorage.setItem(
      CLAVE_AUTH,
      JSON.stringify({
        ...respuestaAuth,
        expiresAt: Date.now() + 600_000
      })
    );
    authApi.obtenerPerfil.mockResolvedValue({ ...usuario, rol: 'ADMIN', tipo: 'Administrador' });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.verificandoSesion).toBe(false));

    expect(authApi.obtenerPerfil).toHaveBeenCalledWith('access-1');
    expect(result.current.sesion.rol).toBe('ADMIN');
    expect(result.current.puedeAdministrar).toBe(true);
  });

  it('cierra la sesión y elimina el token local', async () => {
    localStorage.setItem(
      CLAVE_AUTH,
      JSON.stringify({ ...respuestaAuth, expiresAt: Date.now() + 600_000 })
    );
    authApi.obtenerPerfil.mockResolvedValue(usuario);
    authApi.cerrarSesion.mockResolvedValue(null);

    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.verificandoSesion).toBe(false));

    await act(async () => {
      await result.current.cerrarSesion();
    });

    expect(result.current.sesion).toBeNull();
    expect(localStorage.getItem(CLAVE_AUTH)).toBeNull();
    expect(authApi.cerrarSesion).toHaveBeenCalledWith('access-1');
  });

  it('registra un usuario y deja la sesión iniciada', async () => {
    authApi.registrarUsuario.mockResolvedValue(respuestaAuth);
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.verificandoSesion).toBe(false));

    await act(async () => {
      await result.current.registrar({ correo: 'cliente@huertohogar.cl', clave: '12345' });
    });

    expect(result.current.sesion.correo).toBe('cliente@huertohogar.cl');
    expect(authApi.registrarUsuario).toHaveBeenCalled();
  });
});
