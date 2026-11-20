// src/pages/PerfilPage.jsx
// Gestión del perfil: datos personales, dirección de entrega, teléfono y contraseña.
import { useEffect, useState } from 'react';
import { Button } from '../components/atoms/Button';
import { Heading, Text } from '../components/atoms/Typography';
import { AccesoRestringido } from '../components/molecules/AccesoRestringido';
import { FormField } from '../components/molecules/FormField';
import { SelectField } from '../components/molecules/SelectField';
import { regionesYComunas } from '../data/regiones';
import { actualizarMiPerfil, cambiarMiClave, obtenerMiPerfil } from '../services/usuariosApi';
import { validarClave, validarSeleccion, validarTextoRequerido } from '../utils/validators';

const VACIO = {
  nombre: '',
  apellidos: '',
  fechaNacimiento: '',
  region: '',
  comuna: '',
  direccion: '',
  telefono: ''
};

const validarTelefono = (telefono) =>
  !telefono || /^(\+?56)?9\d{8}$/.test(telefono.replace(/\s/g, ''))
    ? ''
    : 'Teléfono inválido, ej: +56912345678';

export const PerfilPage = ({ sesion, verificandoSesion = false, onMostrarAviso, onPerfilActualizado, onSesionCerrada }) => {
  const [perfil, setPerfil] = useState(null);
  const [form, setForm] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [errorCarga, setErrorCarga] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [claves, setClaves] = useState({ claveActual: '', claveNueva: '' });
  const [erroresClave, setErroresClave] = useState({});
  const [cambiandoClave, setCambiandoClave] = useState(false);

  useEffect(() => {
    if (!sesion) return undefined;
    let activo = true;
    obtenerMiPerfil()
      .then((datos) => {
        if (!activo) return;
        setPerfil(datos);
        setForm({
          nombre: datos.nombre || '',
          apellidos: datos.apellidos || '',
          fechaNacimiento: datos.fechaNacimiento || '',
          region: datos.region || '',
          comuna: datos.comuna || '',
          direccion: datos.direccion || '',
          telefono: datos.telefono || ''
        });
      })
      .catch((e) => activo && setErrorCarga(e.message || 'No se pudo cargar tu perfil'));
    return () => {
      activo = false;
    };
  }, [sesion]);

  if (verificandoSesion) return <AccesoRestringido tipo="verificando" />;
  if (!sesion) return <AccesoRestringido mensaje="Inicia sesión para ver y editar tu perfil." />;

  const comunas = regionesYComunas.find((r) => r.region === form.region)?.comunas || [];
  const opcionesRegion = regionesYComunas.map((r) => r.region);
  // Si la región guardada no está en la lista, se mantiene como opción
  if (form.region && !opcionesRegion.includes(form.region)) opcionesRegion.push(form.region);
  const opcionesComuna = form.comuna && !comunas.includes(form.comuna) ? [...comunas, form.comuna] : comunas;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => (name === 'region' ? { ...prev, region: value, comuna: '' } : { ...prev, [name]: value }));
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: '' }));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    const nuevos = {
      nombre: validarTextoRequerido(form.nombre, 'nombre', 2, 50),
      apellidos: form.apellidos ? validarTextoRequerido(form.apellidos, 'apellidos', 2, 100) : '',
      region: validarSeleccion(form.region, 'región'),
      comuna: validarSeleccion(form.comuna, 'comuna'),
      direccion: validarTextoRequerido(form.direccion, 'dirección', 5, 300),
      telefono: validarTelefono(form.telefono)
    };
    Object.keys(nuevos).forEach((k) => !nuevos[k] && delete nuevos[k]);
    if (Object.keys(nuevos).length > 0) {
      setErrores(nuevos);
      return;
    }

    setGuardando(true);
    try {
      const actualizado = await actualizarMiPerfil({
        nombre: form.nombre.trim(),
        apellidos: form.apellidos.trim() || null,
        fechaNacimiento: form.fechaNacimiento || null,
        region: form.region,
        comuna: form.comuna,
        direccion: form.direccion.trim(),
        telefono: form.telefono.replace(/\s/g, '')
      });
      setPerfil(actualizado);
      onPerfilActualizado?.(actualizado);
      onMostrarAviso?.('Perfil actualizado');
    } catch (error) {
      if (error?.detalles && typeof error.detalles === 'object') setErrores(error.detalles);
      onMostrarAviso?.(error.message || 'No se pudo guardar el perfil');
    } finally {
      setGuardando(false);
    }
  };

  const handleCambiarClave = async (e) => {
    e.preventDefault();
    const nuevos = {};
    if (!claves.claveActual) nuevos.claveActual = 'Ingresa tu contraseña actual.';
    const errNueva = validarClave(claves.claveNueva);
    if (errNueva) nuevos.claveNueva = errNueva;
    if (Object.keys(nuevos).length > 0) {
      setErroresClave(nuevos);
      return;
    }

    setCambiandoClave(true);
    try {
      await cambiarMiClave(claves.claveActual, claves.claveNueva);
      onMostrarAviso?.('Contraseña actualizada. Inicia sesión con tu nueva contraseña.');
      // El backend cierra todas las sesiones al cambiar la clave
      await onSesionCerrada?.();
      window.location.hash = '#/ingreso';
    } catch (error) {
      if (error?.detalles && typeof error.detalles === 'object') {
        setErroresClave(error.detalles);
      } else {
        onMostrarAviso?.(error.message || 'No se pudo cambiar la contraseña');
      }
    } finally {
      setCambiandoClave(false);
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: '760px' }}>
      <Heading level={1} className="fw-bold text-success mb-1">Mi perfil</Heading>
      <Text className="text-muted mb-4">Mantén al día tu dirección de entrega y datos de contacto.</Text>

      {errorCarga && <div className="alert alert-warning">{errorCarga}</div>}

      {perfil && (
        <div className="bg-light border rounded p-3 mb-4 small d-flex flex-wrap gap-4">
          <div><strong>Correo:</strong> {perfil.correo}</div>
          <div><strong>RUN:</strong> {perfil.run}</div>
          <div><strong>Tipo de cuenta:</strong> {perfil.tipo || perfil.rol}</div>
        </div>
      )}

      <form onSubmit={handleGuardar} noValidate className="p-4 border rounded shadow-sm bg-white mb-4">
        <h5 className="fw-bold mb-3">Datos personales y entrega</h5>
        <div className="row">
          <div className="col-md-6">
            <FormField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} error={errores.nombre} />
          </div>
          <div className="col-md-6">
            <FormField label="Apellidos" name="apellidos" value={form.apellidos} onChange={handleChange} error={errores.apellidos} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <FormField label="Fecha de nacimiento" name="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={handleChange} error={errores.fechaNacimiento} />
          </div>
          <div className="col-md-6">
            <FormField label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} placeholder="+56912345678" error={errores.telefono} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <SelectField label="Región" name="region" value={form.region} onChange={handleChange} options={opcionesRegion} placeholder="Selecciona una región" error={errores.region} />
          </div>
          <div className="col-md-6">
            <SelectField label="Comuna" name="comuna" value={form.comuna} onChange={handleChange} options={opcionesComuna} disabled={!form.region} placeholder={form.region ? 'Selecciona comuna' : 'Selecciona región primero'} error={errores.comuna} />
          </div>
        </div>
        <FormField label="Dirección de entrega" name="direccion" value={form.direccion} onChange={handleChange} placeholder="calle, número, departamento..." error={errores.direccion} />
        <Button type="submit" variant="success" className="fw-bold" disabled={guardando || !perfil}>
          {guardando ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </form>

      <form onSubmit={handleCambiarClave} noValidate className="p-4 border rounded shadow-sm bg-white">
        <h5 className="fw-bold mb-3">Cambiar contraseña</h5>
        <div className="row">
          <div className="col-md-6">
            <FormField label="Contraseña actual" name="claveActual" type="password" value={claves.claveActual}
              onChange={(e) => setClaves((p) => ({ ...p, claveActual: e.target.value }))} error={erroresClave.claveActual} />
          </div>
          <div className="col-md-6">
            <FormField label="Nueva contraseña" name="claveNueva" type="password" value={claves.claveNueva}
              onChange={(e) => setClaves((p) => ({ ...p, claveNueva: e.target.value }))} pista="entre 4 y 10 caracteres" error={erroresClave.claveNueva} />
          </div>
        </div>
        <Button type="submit" variant="outline-success" className="fw-bold" disabled={cambiandoClave}>
          {cambiandoClave ? 'Cambiando…' : 'Cambiar contraseña'}
        </Button>
        <Text className="text-muted small mt-2 mb-0">Por seguridad, se cerrarán todas tus sesiones abiertas.</Text>
      </form>
    </div>
  );
};
