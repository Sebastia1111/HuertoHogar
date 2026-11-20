// src/services/session.js
// Persistencia y renovación de la sesión JWT en el navegador.
//
// El access token se guarda junto al refresh token para sobrevivir recargas
// de página. Cuando el access token está por expirar se renueva de forma
// transparente con /api/auth/refresh. Si el refresh falla, se limpia la
// sesión y se avisa a la aplicación con el evento "hh:sesion-expirada".

import { refrescarSesion } from './authApi';

export const CLAVE_AUTH = 'hh_auth';
const MARGEN_RENOVACION_MS = 30_000;

let refrescoEnCurso = null;

const hayStorage = () => typeof window !== 'undefined' && !!window.localStorage;

export const leerAuth = () => {
  if (!hayStorage()) return null;
  try {
    const crudo = window.localStorage.getItem(CLAVE_AUTH);
    if (!crudo) return null;
    const auth = JSON.parse(crudo);
    if (!auth?.accessToken || !auth?.usuario) return null;
    return auth;
  } catch {
    return null;
  }
};

export const guardarAuth = (respuesta) => {
  if (!hayStorage() || !respuesta?.accessToken) return null;

  const auth = {
    accessToken: respuesta.accessToken,
    refreshToken: respuesta.refreshToken || null,
    tokenType: respuesta.tokenType || 'Bearer',
    expiresIn: Number(respuesta.expiresIn || 0),
    expiresAt: Date.now() + Number(respuesta.expiresIn || 0) * 1000,
    usuario: respuesta.usuario
  };

  window.localStorage.setItem(CLAVE_AUTH, JSON.stringify(auth));
  window.localStorage.removeItem('hh_sesion');
  return auth;
};

export const actualizarUsuarioAuth = (usuario) => {
  if (!hayStorage() || !usuario) return;
  const auth = leerAuth();
  if (!auth) return;
  window.localStorage.setItem(CLAVE_AUTH, JSON.stringify({ ...auth, usuario }));
};

export const limpiarAuth = () => {
  if (!hayStorage()) return;
  window.localStorage.removeItem(CLAVE_AUTH);
  window.localStorage.removeItem('hh_sesion');
};

const notificarExpiracion = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('hh:sesion-expirada'));
  }
};

const tokenVigente = (auth) => {
  if (!auth?.accessToken) return false;
  if (!auth.expiresAt) return true;
  return auth.expiresAt - MARGEN_RENOVACION_MS > Date.now();
};

/**
 * Devuelve un access token utilizable. Si expiró, intenta renovarlo con el
 * refresh token. Varias llamadas simultáneas comparten la misma promesa.
 */
export const obtenerAccessToken = async () => {
  const auth = leerAuth();
  if (!auth) return null;
  if (tokenVigente(auth)) return auth.accessToken;

  if (!auth.refreshToken) {
    limpiarAuth();
    notificarExpiracion();
    return null;
  }

  if (!refrescoEnCurso) {
    refrescoEnCurso = refrescarSesion(auth.refreshToken)
      .then((nueva) => {
        const guardada = guardarAuth(nueva);
        return guardada?.accessToken || null;
      })
      .catch(() => {
        limpiarAuth();
        notificarExpiracion();
        return null;
      })
      .finally(() => {
        refrescoEnCurso = null;
      });
  }

  return refrescoEnCurso;
};

export const encabezadoAutorizacion = async () => {
  const token = await obtenerAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
