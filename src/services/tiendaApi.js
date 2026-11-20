// src/services/tiendaApi.js
// Cliente HTTP del microservicio tienda (puerto 8083, incluye el inventario):
// catalogo, checkout (crea la boleta y descuenta stock) y pedidos.

import { encabezadoAutorizacion, leerAuth } from './session';

const BASE_URL = (import.meta.env?.VITE_API_URL || '').replace(/\/$/, '');
const PREFIX = '/api/tienda';
const TIMEOUT_MS = Number(import.meta.env?.VITE_API_TIMEOUT || 5000);

export class TiendaApiError extends Error {
  constructor(message, status = 0, detalles = null) {
    super(message);
    this.name = 'TiendaApiError';
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
      const mensaje = (datos && datos.message) || `La tienda respondio con estado ${respuesta.status}`;
      throw new TiendaApiError(mensaje, respuesta.status, datos?.detalles || null);
    }

    return datos;
  } catch (error) {
    if (error instanceof TiendaApiError) throw error;
    if (error?.name === 'AbortError') {
      throw new TiendaApiError('La tienda no respondio a tiempo');
    }
    throw new TiendaApiError('No se pudo conectar con el servicio de tienda');
  } finally {
    clearTimeout(timer);
  }
}

const query = (filtros = {}) => {
  const params = new URLSearchParams();
  if (filtros.q) params.set('q', filtros.q);
  if (filtros.categoria) params.set('categoria', filtros.categoria);
  if (filtros.soloDisponibles) params.set('soloDisponibles', 'true');
  const texto = params.toString();
  return texto ? `?${texto}` : '';
};

export const listarCatalogo = (filtros) => request(`/catalogo${query(filtros)}`);

// El carrito vive en el navegador (utils/storage.js). Al comprar, sus líneas se envían
// a /carrito/checkout, que crea la boleta y descuenta el stock en una sola operación.

// ----------------------------- Pedidos -----------------------------

/** Historial de compras del usuario logueado (el backend lo identifica por el token). */
export const obtenerPedidos = () => request('/pedidos');

/** El cliente puede cancelar mientras el pedido está PENDIENTE (devuelve el stock). */
export const cancelarPedido = (numero) =>
  request(`/pedidos/${encodeURIComponent(numero)}/cancelar`, { method: 'POST' });

/** ADMIN / VENDEDOR: todos los pedidos, con filtro opcional por estado. */
export const listarTodosPedidos = (estado) =>
  request(estado ? `/pedidos/todos?estado=${encodeURIComponent(estado)}` : '/pedidos/todos');

/** ADMIN / VENDEDOR: PENDIENTE -> EN_PREPARACION -> EN_CAMINO -> ENTREGADO (o CANCELADO). */
export const cambiarEstadoPedido = (numero, estado, comentario) =>
  request(`/pedidos/${encodeURIComponent(numero)}/estado`, {
    method: 'PATCH',
    body: { estado, comentario }
  });

/**
 * Checkout: crea la boleta y descuenta el stock en una sola transacción.
 * opciones.fechaEntrega (YYYY-MM-DD) es la fecha de entrega preferida.
 */
export const finalizarCompra = async (items, referencia, opciones = {}) => {
  const auth = leerAuth();
  const correo = auth?.usuario?.correo;
  if (!correo) {
    throw new TiendaApiError('Inicia sesion para finalizar tu compra', 401);
  }
  return request('/carrito/checkout', {
    method: 'POST',
    body: { correo, items, referencia, fechaEntrega: opciones.fechaEntrega || null },
    timeout: 8000
  });
};
