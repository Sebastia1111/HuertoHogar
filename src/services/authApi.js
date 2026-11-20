// src/services/authApi.js
// Cliente HTTP de autenticación del microservicio de usuarios (puerto 8082).
// El backend emite un access token de corta duración y un refresh token.

const BASE_URL = (import.meta.env?.VITE_API_URL || '').replace(/\/$/, '');
const PREFIX = '/api/auth';
const TIMEOUT_MS = Number(import.meta.env?.VITE_API_TIMEOUT || 8000);

export class AuthError extends Error {
  constructor(message, status = 0, detalles = null) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
    this.detalles = detalles;
  }
}

async function request(path, { method = 'GET', body, token, timeout = TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const respuesta = await fetch(`${BASE_URL}${PREFIX}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    });

    if (respuesta.status === 204) return null;

    const texto = await respuesta.text();
    let datos = null;
    try {
      datos = texto ? JSON.parse(texto) : null;
    } catch {
      datos = texto;
    }

    if (!respuesta.ok) {
      const mensaje =
        (datos && datos.message) ||
        (respuesta.status === 401
          ? 'Correo o contraseña incorrectos'
          : `El servicio de autenticación respondió con estado ${respuesta.status}`);
      throw new AuthError(mensaje, respuesta.status, datos?.detalles || null);
    }

    return datos;
  } catch (error) {
    if (error instanceof AuthError) throw error;
    if (error?.name === 'AbortError') {
      throw new AuthError('El servicio de autenticación no respondió a tiempo');
    }
    throw new AuthError('No se pudo conectar con el servicio de autenticación');
  } finally {
    clearTimeout(timer);
  }
}

export const iniciarSesion = (correo, clave) =>
  request('/login', { method: 'POST', body: { correo, clave } });

export const registrarUsuario = (datos) =>
  request('/registro', { method: 'POST', body: datos });

export const refrescarSesion = (refreshToken) =>
  request('/refresh', { method: 'POST', body: { refreshToken } });

export const obtenerPerfil = (token) => request('/me', { token });

export const cerrarSesion = (token) => request('/logout', { method: 'POST', token });
