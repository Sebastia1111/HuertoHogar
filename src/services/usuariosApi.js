// src/services/usuariosApi.js
// Cliente HTTP del microservicio de usuarios (perfil propio y gestión de cuentas).
// En desarrollo, Vite hace proxy de /api/usuarios hacia http://localhost:8082.

import { encabezadoAutorizacion } from './session';

const BASE_URL = (import.meta.env?.VITE_API_URL || '').replace(/\/$/, '');
const PREFIX = '/api/usuarios';
const TIMEOUT_MS = Number(import.meta.env?.VITE_API_TIMEOUT || 5000);

export class UsuariosApiError extends Error {
  constructor(message, status = 0, detalles = null) {
    super(message);
    this.name = 'UsuariosApiError';
    this.status = status;
    this.detalles = detalles;
  }
}

async function request(path, { method = 'GET', body, timeout = TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const headers = await encabezadoAutorizacion();
    if (body) headers['Content-Type'] = 'application/json';

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
      const mensaje = (datos && datos.message) || `El servicio de usuarios respondió con estado ${respuesta.status}`;
      throw new UsuariosApiError(mensaje, respuesta.status, datos?.detalles || null);
    }

    return datos;
  } catch (error) {
    if (error instanceof UsuariosApiError) throw error;
    if (error?.name === 'AbortError') {
      throw new UsuariosApiError('El servicio de usuarios no respondió a tiempo');
    }
    throw new UsuariosApiError('No se pudo conectar con el servicio de usuarios');
  } finally {
    clearTimeout(timer);
  }
}

// ------------------------- Perfil propio -------------------------

export const obtenerMiPerfil = () => request('/me');

export const actualizarMiPerfil = (datos) => request('/me', { method: 'PUT', body: datos });

export const cambiarMiClave = (claveActual, claveNueva) =>
  request('/me/password', { method: 'PUT', body: { claveActual, claveNueva } });

// ------------------------- Gestión (ADMIN) -------------------------

export const listarUsuarios = (rol) =>
  request(rol ? `?rol=${encodeURIComponent(rol)}` : '');

export const actualizarUsuario = (id, datos) => request(`/${id}`, { method: 'PUT', body: datos });
