// src/utils/validators.js

// Validar Correo (@gmail.com o @duocuc.cl)
export const validarCorreo = (correo, esOpcional = false) => {
  if (esOpcional && !correo) return '';
  if (!correo || !correo.trim()) return 'El correo es obligatorio.';
  
  const mail = correo.toLowerCase().trim();
  if (!mail.endsWith('@gmail.com') && !mail.endsWith('@duocuc.cl')) {
    return 'El correo debe ser @gmail.com o @duocuc.cl';
  }
  return '';
};

// Validar Contraseña (4 a 10 caracteres)
export const validarClave = (clave) => {
  if (!clave) return 'La contraseña es obligatoria.';
  if (clave.length < 4 || clave.length > 10) {
    return 'La contraseña debe tener entre 4 y 10 caracteres.';
  }
  return '';
};

// Validar RUN (sin puntos ni guion, 7 a 9 caracteres)
export const validarRun = (run) => {
  if (!run || !run.trim()) return 'El RUN es obligatorio.';
  const limpio = run.trim().replace(/[.-]/g, '');
  if (limpio.length < 7 || limpio.length > 9) {
    return 'El RUN debe tener entre 7 y 9 caracteres (sin puntos ni guion).';
  }
  return '';
};

// Validar Texto Generico (Nombre, Apellidos, Dirección, Comentario)
export const validarTextoRequerido = (valor, campoNombre, min = 2, max = 300) => {
  if (!valor || !valor.trim()) return `El campo ${campoNombre} es obligatorio.`;
  if (valor.trim().length < min) return `${campoNombre} debe tener al menos ${min} caracteres.`;
  if (valor.trim().length > max) return `${campoNombre} no puede superar los ${max} caracteres.`;
  return '';
};

// Validar Selección Desplegable (Región / Comuna)
export const validarSeleccion = (valor, campoNombre) => {
  if (!valor) return `Debes seleccionar una ${campoNombre}.`;
  return '';
};