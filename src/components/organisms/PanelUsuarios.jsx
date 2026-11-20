// src/components/organisms/PanelUsuarios.jsx
// Solo ADMIN: ver las cuentas, cambiar el rol y activar/desactivar usuarios.
import { useCallback, useEffect, useState } from 'react';
import { Button } from '../atoms/Button';
import { Heading, Text } from '../atoms/Typography';
import { actualizarUsuario, listarUsuarios } from '../../services/usuariosApi';
import { ROLES } from '../../utils/permisos';

// El backend pide los datos completos en el PUT; la clave vacía no se modifica
const aPeticion = (usuario, cambios) => ({
  run: usuario.run,
  nombre: usuario.nombre,
  apellidos: usuario.apellidos,
  correo: usuario.correo,
  clave: '',
  fechaNacimiento: usuario.fechaNacimiento,
  region: usuario.region,
  comuna: usuario.comuna,
  direccion: usuario.direccion,
  telefono: usuario.telefono || '',
  rol: usuario.rol,
  activo: usuario.activo,
  ...cambios
});

export const PanelUsuarios = ({ sesion, onMostrarAviso }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const datos = await listarUsuarios();
      setUsuarios(Array.isArray(datos) ? datos : []);
    } catch (e) {
      setError(e.message || 'No se pudieron cargar los usuarios');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    // Carga inicial de usuarios desde la API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar();
  }, [cargar]);

  const guardar = async (usuario, cambios, mensaje) => {
    setGuardando(usuario.id);
    try {
      const actualizado = await actualizarUsuario(usuario.id, aPeticion(usuario, cambios));
      setUsuarios((prev) => prev.map((u) => (u.id === usuario.id ? actualizado : u)));
      onMostrarAviso?.(mensaje);
    } catch (e) {
      onMostrarAviso?.(e.message || 'No se pudo actualizar el usuario');
    } finally {
      setGuardando(null);
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-3">
        <div>
          <Heading level={2} className="fw-bold text-success mb-1">Usuarios</Heading>
          <Text className="text-muted mb-0">Asigna roles y activa o desactiva cuentas.</Text>
        </div>
        <Button variant="outline-success" className="btn-sm" onClick={cargar} disabled={cargando}>↻ Actualizar</Button>
      </div>

      {error && <div className="alert alert-warning">{error}</div>}

      <div className="table-responsive bg-white border rounded shadow-sm">
        <table className="table align-middle mb-0">
          <thead className="small text-muted">
            <tr>
              <th>Usuario</th>
              <th>RUN</th>
              <th>Rol</th>
              <th className="text-center">Estado</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => {
              const esYo = u.correo === sesion?.correo;
              return (
                <tr key={u.id}>
                  <td>
                    <div className="fw-semibold">{[u.nombre, u.apellidos].filter(Boolean).join(' ')}</div>
                    <small className="text-muted">{u.correo}</small>
                  </td>
                  <td className="small">{u.run}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={u.rol}
                      disabled={esYo || guardando === u.id}
                      onChange={(e) => guardar(u, { rol: e.target.value }, `Rol de ${u.correo} actualizado`)}
                      aria-label={`Rol de ${u.correo}`}
                    >
                      {Object.values(ROLES).map((rol) => <option key={rol} value={rol}>{rol}</option>)}
                    </select>
                  </td>
                  <td className="text-center">
                    <Button
                      variant={u.activo ? 'outline-secondary' : 'outline-success'}
                      className="btn-sm"
                      disabled={esYo || guardando === u.id}
                      onClick={() =>
                        guardar(u, { activo: !u.activo }, `${u.correo} ${u.activo ? 'desactivado' : 'activado'}`)
                      }
                    >
                      {u.activo ? 'Desactivar' : 'Activar'}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Text className="text-muted small mt-2">No puedes cambiar tu propio rol ni desactivar tu cuenta.</Text>
    </div>
  );
};
