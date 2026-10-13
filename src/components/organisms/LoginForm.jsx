// En src/components/organisms/LoginForm.jsx
import { useState } from 'react';
import { FormField } from '../molecules/FormField';
import { Button } from '../atoms/Button';
import { validarCorreo, validarClave } from '../../utils/validators';
import { leerStorage } from '../../utils/storage'; // 👈 Importamos leerStorage

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

    const errorCorreo = validarCorreo(formData.correo);
    const errorClave = validarClave(formData.clave);

    const newErrors = {};
    if (errorCorreo) newErrors.correo = errorCorreo;
    if (errorClave) newErrors.clave = errorClave;

    if (Object.keys(newErrors).length === 0) {
      // 🟢 Lectura limpia y segura sin errores de linter:
      const usuarios = leerStorage('hh_usuarios', []);

      const correoIngresado = formData.correo.trim().toLowerCase();
      const claveIngresada = formData.clave.trim();

      const usuarioEncontrado = usuarios.find(
        (u) =>
          u &&
          u.correo &&
          u.correo.trim().toLowerCase() === correoIngresado &&
          u.clave &&
          u.clave.trim() === claveIngresada
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