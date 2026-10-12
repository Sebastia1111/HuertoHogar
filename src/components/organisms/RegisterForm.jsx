// src/components/organisms/RegisterForm.jsx
import { useState } from 'react';
import { FormField } from '../molecules/FormField';
import { SelectField } from '../molecules/SelectField';
import { Button } from '../atoms/Button';
import { regionesYComunas } from '../../data/regiones';
import {
  validarRun,
  validarTextoRequerido,
  validarCorreo,
  validarClave,
  validarSeleccion
} from '../../utils/validators';

export const RegisterForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    run: '',
    nombre: '',
    apellidos: '',
    correo: '',
    clave: '',
    fechaNacimiento: '',
    region: '',
    comuna: '',
    direccion: ''
  });

  const [errors, setErrors] = useState({});

  // Filtrar comunas según la región seleccionada
  const regionSeleccionada = regionesYComunas.find(r => r.region === formData.region);
  const opcionesComunas = regionSeleccionada ? regionSeleccionada.comunas : [];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si cambia la región, reiniciamos la comuna
    if (name === 'region') {
      setFormData(prev => ({ ...prev, region: value, comuna: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      run: validarRun(formData.run),
      nombre: validarTextoRequerido(formData.nombre, 'nombre', 2, 50),
      apellidos: validarTextoRequerido(formData.apellidos, 'apellidos', 2, 100),
      correo: validarCorreo(formData.correo),
      clave: validarClave(formData.clave),
      region: validarSeleccion(formData.region, 'región'),
      comuna: validarSeleccion(formData.comuna, 'comuna'),
      direccion: validarTextoRequerido(formData.direccion, 'dirección', 5, 300)
    };

    // Limpiar campos sin error
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    alert('¡Cuenta creada con éxito!');
    if (onSuccess) onSuccess(formData);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="p-4 border rounded shadow-sm bg-white" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="text-center mb-1 fw-bold">Crea tu cuenta</h2>
      <p className="text-center text-muted mb-4 small">Únete y recibe lo mejor del campo en tu puerta.</p>

      <FormField
        label="RUN"
        name="run"
        value={formData.run}
        onChange={handleChange}
        placeholder="ej: 19011022K"
        pista="sin puntos ni guion, entre 7 y 9 caracteres"
        error={errors.run}
      />

      <div className="row">
        <div className="col-md-6">
          <FormField
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            error={errors.nombre}
          />
        </div>
        <div className="col-md-6">
          <FormField
            label="Apellidos"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            error={errors.apellidos}
          />
        </div>
      </div>

      <FormField
        label="Correo"
        name="correo"
        type="email"
        value={formData.correo}
        onChange={handleChange}
        placeholder="tucorreo@gmail.com"
        pista="@gmail.com, duocuc.cl"
        error={errors.correo}
      />

      <FormField
        label="Contraseña"
        name="clave"
        type="password"
        value={formData.clave}
        onChange={handleChange}
        pista="entre 4 y 10 caracteres"
        error={errors.clave}
      />

      <FormField
        label="Fecha de Nacimiento (Opcional)"
        name="fechaNacimiento"
        type="date"
        value={formData.fechaNacimiento}
        onChange={handleChange}
      />

      <div className="row">
        <div className="col-md-6">
          <SelectField
            label="Región"
            name="region"
            value={formData.region}
            onChange={handleChange}
            options={regionesYComunas.map(r => r.region)}
            error={errors.region}
          />
        </div>
        <div className="col-md-6">
          <SelectField
            label="Comuna"
            name="comuna"
            value={formData.comuna}
            onChange={handleChange}
            options={opcionesComunas}
            disabled={!formData.region}
            placeholder={formData.region ? 'Selecciona comuna' : 'Selecciona región primero'}
            error={errors.comuna}
          />
        </div>
      </div>

      <FormField
        label="Dirección"
        name="direccion"
        value={formData.direccion}
        onChange={handleChange}
        placeholder="calle, número, departamento..."
        error={errors.direccion}
      />

      <Button type="submit" variant="success" className="w-100 mt-2 fw-bold">
        Crear Cuenta
      </Button>

      <p className="text-center mt-3 mb-0 small">
        ¿Ya tienes cuenta? <a href="#/ingreso" className="text-success fw-bold text-decoration-none">inicia sesión</a>
      </p>
    </form>
  );
};