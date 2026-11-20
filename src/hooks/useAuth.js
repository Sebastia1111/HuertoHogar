// src/hooks/useAuth.js
// Estado global de autenticación del frontend.
//
// - Restaura la sesión desde localStorage al recargar la página.
// - Valida el access token contra /api/auth/me.
// - Renueva el token periódicamente antes de que expire.
// - Expone el rol para restringir interfaces y acciones.

import { useCallback, useEffect, useState } from 'react';
import {
  cerrarSesion as cerrarSesionApi,
  iniciarSesion as iniciarSesionApi,
  obtenerPerfil,
  registrarUsuario
} from '../services/authApi';
import {
  actualizarUsuarioAuth,
  guardarAuth,
  leerAuth,
  limpiarAuth,
  obtenerAccessToken
} from '../services/session';

const usuarioDesdeAuth = (auth) => {
  if (!auth?.usuario) return null;
  return {
    ...auth.usuario,
    tipo:
      auth.usuario.tipo ||
      (auth.usuario.rol === 'ADMIN'
        ? 'Administrador'
        : auth.usuario.rol === 'VENDEDOR'
          ? 'Vendedor'
          : 'Cliente')
  };
};

export function useAuth() {
  const [sesion, setSesion] = useState(() => usuarioDesdeAuth(leerAuth()));
  const [verificandoSesion, setVerificandoSesion] = useState(true);

  useEffect(() => {
    let activo = true;

    const restaurar = async () => {
      const auth = leerAuth();
      if (!auth) {
        if (activo) {
          setSesion(null);
          setVerificandoSesion(false);
        }
        return;
      }

      // Se muestra de inmediato el usuario guardado y luego se revalida.
      if (activo) setSesion(usuarioDesdeAuth(auth));

      const token = await obtenerAccessToken();
      if (!activo) return;

      if (!token) {
        setSesion(null);
        setVerificandoSesion(false);
        return;
      }

      try {
        const usuario = await obtenerPerfil(token);
        if (!activo) return;
        actualizarUsuarioAuth(usuario);
        setSesion(usuarioDesdeAuth({ usuario }));
      } catch (error) {
        // Si el token fue rechazado, la sesión ya no sirve. Si fue un fallo
        // de red, se conserva la sesión guardada para no expulsar al usuario.
        if (error?.status === 401 || error?.status === 403) {
          limpiarAuth();
          setSesion(null);
        }
      } finally {
        if (activo) setVerificandoSesion(false);
      }
    };

    restaurar();

    const alExpirar = () => setSesion(null);
    window.addEventListener('hh:sesion-expirada', alExpirar);

    return () => {
      activo = false;
      window.removeEventListener('hh:sesion-expirada', alExpirar);
    };
  }, []);

  // Revisa cada minuto si el access token necesita renovación.
  useEffect(() => {
    if (!sesion) return undefined;

    const intervalo = window.setInterval(() => {
      obtenerAccessToken();
    }, 60_000);

    return () => window.clearInterval(intervalo);
  }, [sesion]);

  const iniciarSesion = useCallback(async (correo, clave) => {
    const respuesta = await iniciarSesionApi(correo, clave);
    guardarAuth(respuesta);
    const usuario = usuarioDesdeAuth(respuesta);
    setSesion(usuario);
    return usuario;
  }, []);

  const registrar = useCallback(async (datos) => {
    const respuesta = await registrarUsuario(datos);
    guardarAuth(respuesta);
    const usuario = usuarioDesdeAuth(respuesta);
    setSesion(usuario);
    return usuario;
  }, []);

  const cerrarSesion = useCallback(async () => {
    const auth = leerAuth();
    limpiarAuth();
    setSesion(null);

    if (auth?.accessToken) {
      try {
        await cerrarSesionApi(auth.accessToken);
      } catch {
        // Aunque el backend no responda, la sesión local ya fue eliminada.
      }
    }
  }, []);

  /** Refresca los datos del usuario guardados en la sesión (ej: después de editar el perfil). */
  const actualizarUsuario = useCallback((usuario) => {
    if (!usuario) return;
    actualizarUsuarioAuth(usuario);
    setSesion(usuarioDesdeAuth({ usuario }));
  }, []);

  return {
    sesion,
    verificandoSesion,
    iniciarSesion,
    registrar,
    cerrarSesion,
    actualizarUsuario,
    puedeAdministrar: sesion?.rol === 'ADMIN'
  };
}
