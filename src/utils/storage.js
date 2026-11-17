// src/utils/storage.js

export const leerStorage = (clave, porDefecto) => {
  try {
    const item = localStorage.getItem(clave);
    return item ? JSON.parse(item) : porDefecto;
  } catch {
    return porDefecto;
  }
};

export const guardarStorage = (clave, valor) => {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch (error) {
    console.error('Error al guardar en localStorage', error);
  }
};

// Verifica si la sesión actual tiene correo institucional @duocuc.cl
export const tieneDescuentoDuoc = (sesion) => {
  return !!sesion && !!sesion.correo && sesion.correo.toLowerCase().endsWith('@duocuc.cl');
};

// Aplica 20% de descuento si corresponde
export const calcularPrecioReal = (precioOriginal, sesion) => {
  if (tieneDescuentoDuoc(sesion)) {
    return Math.round(precioOriginal * 0.8);
  }
  return precioOriginal;
};