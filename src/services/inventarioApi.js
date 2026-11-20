// src/services/inventarioApi.js
// Cliente HTTP de la API de inventario (vive dentro del microservicio tienda, puerto 8083).
// El panel de administración la usa para fijar el stock de un producto.

import { encabezadoAutorizacion } from './session';

const BASE_URL = (import.meta.env?.VITE_API_URL || '').replace(/\/$/, '');
const PREFIX = '/api/inventario';
const TIMEOUT_MS = Number(import.meta.env?.VITE_API_TIMEOUT || 4000);

export class ApiError extends Error {
  constructor(message, status = 0, detalles = null) {
    super(message);
    this.name = 'ApiError';
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
      const mensaje = (datos && datos.message) || `La API respondió con estado ${respuesta.status}`;
      throw new ApiError(mensaje, respuesta.status, datos?.detalles || null);
    }

    return datos;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error?.name === 'AbortError') {
      throw new ApiError('La API de inventario no respondió a tiempo');
    }
    throw new ApiError('No se pudo conectar con la API de inventario');
  } finally {
    clearTimeout(timer);
  }
}

export const actualizarStock = (id, stock, motivo = 'Ajuste desde administración') =>
  request(`/productos/${id}/stock`, { method: 'PATCH', body: { stock, motivo } });
