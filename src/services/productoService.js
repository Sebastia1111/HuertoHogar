// src/services/productoService.js
import { fetchConToken } from './api';

export const obtenerProductos = () => {
    return fetchConToken('/inventario');
};

export const crearProducto = (producto) => {
    return fetchConToken('/inventario', {
        method: 'POST',
        body: JSON.stringify(producto),
    });
};

export const eliminarProducto = (id) => {
    return fetchConToken(`/inventario/${id}`, {
        method: 'DELETE',
    });
};