// src/utils/validators.js

const DOMINIOS_PERMITIDOS = ['@huertohogar.cl', '@gmail.com', '@duocuc.cl'];

// Validar Correo (@gmail.com, @duocuc.cl, @huertohogar.cl)
export const validarCorreo = (correo, esOpcional = false) => {
  if (esOpcional && !correo) return '';
  if (!correo || !correo.trim()) return 'El correo es obligatorio.';
  const mail = correo.toLowerCase().trim();
  if (!DOMINIOS_PERMITIDOS.some((d) => mail.endsWith(d))) {
    return 'Solo aceptamos correos @gmail.com, @duocuc.cl o @huertohogar.cl';
  }
  return '';
};

// Validar Contraseña (4 a 10 caracteres)
export const validarClave = (clave) => {
  if (!clave || !clave.trim()) {
    return 'La contraseña es obligatoria.';
  }

  if (clave.includes(' ')){
    return 'La contraseña no debe poseer espacios en blanco'

  }
  const claveLimpia = clave.trim();
  if (claveLimpia.length < 4 || claveLimpia.length > 10) {
    return 'La contraseña debe tener entre 4 y 10 caracteres.';
  }
  return '';
};

// Validar RUN Chileno (Módulo 11)
export const validarRun = (run) => {
  const v = (run || '').trim().toUpperCase().replace(/[.-]/g, '');
  if (!v) return 'El RUN es obligatorio.';
  if (!/^[0-9K]+$/.test(v)) return 'Usa solo números y K, sin puntos ni guion.';
  if (v.length < 7 || v.length > 9) return 'Debe tener entre 7 y 9 caracteres.';

  const cuerpo = v.slice(0, -1);
  const dv = v.slice(-1);
  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = 11 - (suma % 11);
  const dvEsperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);

  return dv === dvEsperado ? '' : 'El RUN ingresado no es válido.';
};

// Validar Texto Requerido
export const validarTextoRequerido = (valor, campoNombre, min = 2, max = 300) => {
  if (!valor || !valor.trim()) return `El campo ${campoNombre} es obligatorio.`;
  if (valor.trim().length < min) return `${campoNombre} debe tener al menos ${min} caracteres.`;
  if (valor.trim().length > max) return `${campoNombre} no puede superar los ${max} caracteres.`;
  return '';
};

// Validar Selección Desplegable
export const validarSeleccion = (valor, campoNombre) => {
  if (!valor) return `Debes seleccionar una ${campoNombre}.`;
  return '';
};