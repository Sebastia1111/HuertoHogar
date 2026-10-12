// src/components/organisms/ContactForm.jsx
import { useState } from 'react';
import { FormField } from '../molecules/FormField';
import { TextareaField } from '../molecules/TextareaField';
import { Button } from '../atoms/Button';
import { validarCorreo, validarTextoRequerido } from '../../utils/validators';

export const ContactForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    comentario: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      nombre: validarTextoRequerido(formData.nombre, 'nombre', 2, 100),
      correo: validarCorreo(formData.correo, true), // Opcional pero valida formato si ingresa algo
      comentario: validarTextoRequerido(formData.comentario, 'comentario', 10, 500)
    };

    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    alert('¡Mensaje enviado con éxito!');
    if (onSuccess) onSuccess(formData);
    setFormData({ nombre: '', correo: '', comentario: '' });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="p-4 border rounded shadow-sm bg-white" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2 className="mb-1 fw-bold">Escríbenos</h2>
      <p className="text-muted mb-4 small">Cuéntanos qué necesitas y te respondemos a la brevedad.</p>

      <FormField
        label="Nombre"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        error={errors.nombre}
      />

      <FormField
        label="Correo (Opcional)"
        name="correo"
        type="email"
        value={formData.correo}
        onChange={handleChange}
        placeholder="tucorreo@gmail.com"
        pista="@gmail.com, duocuc.cl"
        error={errors.correo}
      />

      <TextareaField
        label="Comentario"
        name="comentario"
        value={formData.comentario}
        onChange={handleChange}
        placeholder="escribe tu mensaje aquí..."
        maxLength={500}
        error={errors.comentario}
      />

      <Button type="submit" variant="success" className="w-100 mt-2 fw-bold">
        Enviar Mensaje
      </Button>
    </form>
  );
};