// En src/components/organisms/LoginForm.jsx
import { useState } from 'react';
import { FormField } from '../molecules/FormField';
import { Button } from '../atoms/Button';
import { validarCorreo, validarClave } from '../../utils/validators';

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

  // Convertimos la función a async para usar await con la petición fetch
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorCorreo = validarCorreo(formData.correo);
    const errorClave = validarClave(formData.clave);

    const newErrors = {};
    if (errorCorreo) newErrors.correo = errorCorreo;
    if (errorClave) newErrors.clave = errorClave;

    if (Object.keys(newErrors).length === 0) {
      try {
        // Petición POST al backend (Asegúrate de que la URL y puerto coincidan con tu Spring Boot)
        const response = await fetch('http://localhost:8080/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            correo: formData.correo.trim().toLowerCase(),
            clave: formData.clave.trim()
          })
        });

        if (response.ok) {
          const data = await response.json(); // Retorna el token y rol desde el backend

          // 1. Guardar el Token JWT para autenticar futuras peticiones al inventario
          localStorage.setItem('jwt_token', data.token);
          
          // 2. Guardar el rol para restringir vistas (ej. AdminPage)
          localStorage.setItem('user_role', data.role);

          // 3. Notificar éxito al componente padre
          if (onSuccess) onSuccess(data);
          
        } else {
          // Si el backend devuelve 401 o 403 (No autorizado)
          setErrors({ correo: 'Correo o contraseña incorrectos, o la cuenta no existe.' });
        }
      } catch (error) {
        console.error("Error al conectar con el servidor", error);
        setErrors({ correo: 'Error de conexión con el servidor. Intenta más tarde.' });
      }
    } else {
      setErrors(newErrors);
    }
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