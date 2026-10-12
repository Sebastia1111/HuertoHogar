import { useState } from 'react';
import { FormField } from '../molecules/FormField';
import { Button } from '../atoms/Button';

export const LoginForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    correo: '',
    clave: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validar Correo
    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es obligatorio.';
    } else if (
      !formData.correo.endsWith('@gmail.com') &&
      !formData.correo.endsWith('@duocuc.cl') &&
      !formData.correo.endsWith('@huertohogar.cl')
    ) {
      newErrors.correo = 'El correo debe ser @gmail.com, @duocuc.cl o @huertohogar.cl';
    }

    // Validar Contraseña
    if (!formData.clave) {
      newErrors.clave = 'La contraseña es obligatoria.';
    } else if (formData.clave.length < 4 || formData.clave.length > 10) {
      newErrors.clave = 'La contraseña debe tener entre 4 y 10 caracteres.';
    }

    // Verificar si la cuenta existe en localStorage
    if (Object.keys(newErrors).length === 0) {
      const usuarios = JSON.parse(localStorage.getItem('hh_usuarios') || '[]');
      const usuarioEncontrado = usuarios.find(
        (u) => u.correo.toLowerCase() === formData.correo.trim().toLowerCase() && u.clave === formData.clave
      );

      if (!usuarioEncontrado) {
        newErrors.correo = 'Correo o contraseña incorrectos, o la cuenta no existe.';
      } else {
        if (onSuccess) onSuccess(usuarioEncontrado);
        return;
      }
    }

    setErrors(newErrors);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="p-4 border rounded shadow-sm bg-white" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div className="text-center mb-3 fs-1">🥑</div>
      <h2 className="text-center mb-1 fw-bold">Ingresa a tu cuenta</h2>
      <p className="text-center text-muted mb-4 small">Bienvenido de vuelta a HuertoHogar.</p>

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
        placeholder="••••••"
        pista="entre 4 y 10 caracteres"
        error={errors.clave}
      />

      <Button type="submit" variant="success" className="w-100 mt-2 fw-bold">
        Iniciar Sesión
      </Button>

      <p className="text-center mt-3 mb-0 small">
        ¿No tienes cuenta? <a href="#/registro" className="text-success fw-bold text-decoration-none">regístrate aquí</a>
      </p>
    </form>
  );
};