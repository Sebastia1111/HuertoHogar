// src/utils/permisos.js
// Reglas de acceso del frontend según el rol de la sesión.
// El backend aplica las mismas reglas (y responde 403 si alguien se las salta).

export const ROLES = {
  ADMIN: 'ADMIN',
  VENDEDOR: 'VENDEDOR',
  CLIENTE: 'CLIENTE'
};

export const esAdmin = (sesion) => sesion?.rol === ROLES.ADMIN;

/** ADMIN y VENDEDOR pueden entrar al panel de gestión (stock y pedidos). */
export const puedeGestionar = (sesion) =>
  sesion?.rol === ROLES.ADMIN || sesion?.rol === ROLES.VENDEDOR;

/** Solo ADMIN administra cuentas de usuario. */
export const puedeGestionarUsuarios = (sesion) => esAdmin(sesion);

export const ESTADOS_PEDIDO = {
  PENDIENTE: { texto: 'Pedido recibido', color: 'secondary', icono: '🧾' },
  EN_PREPARACION: { texto: 'En preparación', color: 'warning', icono: '🧺' },
  EN_CAMINO: { texto: 'En camino', color: 'info', icono: '🚚' },
  ENTREGADO: { texto: 'Entregado', color: 'success', icono: '✅' },
  CANCELADO: { texto: 'Cancelado', color: 'danger', icono: '✖️' }
};

/** Siguiente estado permitido (el mismo flujo que valida el backend). */
export const SIGUIENTE_ESTADO = {
  PENDIENTE: 'EN_PREPARACION',
  EN_PREPARACION: 'EN_CAMINO',
  EN_CAMINO: 'ENTREGADO'
};

export const puedeCancelarPedido = (pedido, sesion) =>
  pedido?.estado === 'PENDIENTE' ||
  (puedeGestionar(sesion) && pedido?.estado === 'EN_PREPARACION');
