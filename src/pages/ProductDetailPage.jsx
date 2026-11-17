// src/pages/ProductDetailPage.jsx
import { useState } from 'react';
import { PRODUCTOS } from '../data/productos';
import { CATEGORIAS } from '../data/categorias';
import { calcularPrecioReal, tieneDescuentoDuoc, leerStorage } from '../utils/storage';

export const ProductDetailPage = ({ codigo, sesion, onAddToCart }) => {
  const [cantidad, setCantidad] = useState(1);
  const [errorCantidad, setErrorCantidad] = useState('');

  const producto = PRODUCTOS.find((x) => x.codigo === codigo) || PRODUCTOS[0];
  const cat = CATEGORIAS.find((c) => c.id === producto.categoria) || { nombre: 'Producto Fresco' };

  // Consultar stock actualizado desde localStorage
  const stocks = leerStorage('hh_stocks', {});
  const stockDisponible = stocks[producto.codigo] !== undefined ? stocks[producto.codigo] : producto.stock;

  const precioFinal = calcularPrecioReal(producto.precio, sesion);
  const aplicaDcto = tieneDescuentoDuoc(sesion);

  const handleRestar = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
      setErrorCantidad('');
    }
  };

  const handleSumar = () => {
    if (cantidad >= stockDisponible) {
      setErrorCantidad('No hay más stock disponible');
      return;
    }
    setCantidad(cantidad + 1);
    setErrorCantidad('');
  };

  const handleAgregar = () => {
    if (cantidad < 1) {
      setErrorCantidad('Ingresa una cantidad válida');
      return;
    }
    if (cantidad > stockDisponible) {
      setErrorCantidad(`Solo hay ${stockDisponible} unidades disponibles`);
      return;
    }
    onAddToCart(producto, cantidad);
    setErrorCantidad('');
  };

  return (
    <div className="container my-4 vista-animada" style={{ maxWidth: '980px' }}>
      <a
        href="#/inicio"
        className="d-inline-flex align-items-center gap-1 text-muted fw-semibold text-decoration-none mb-3 small"
      >
        ‹ volver al catálogo
      </a>

      <div className="bg-white border rounded-4 p-4 p-md-5 shadow-sm">
        <div className="row g-4 align-items-center">
          {/* Columna Izquierda: Imagen / Emoji con Fondo de Categoría */}
          <div className="col-12 col-md-5">
            <div
              className={`cat-${producto.categoria} rounded-4 d-flex align-items-center justify-content-center`}
              style={{ minHeight: '320px', fontSize: '110px' }}
            >
              {producto.emoji}
            </div>
          </div>

          {/* Columna Derecha: Información del Producto */}
          <div className="col-12 col-md-7">
            <span className="badge bg-success-subtle text-success text-uppercase fw-bold px-3 py-2 rounded-pill small mb-2">
              {cat.nombre}
            </span>

            <h1 className="fw-bold text-dark mb-1">{producto.nombre}</h1>
            <p className="text-muted small mb-3">código {producto.codigo}</p>

            <div className="d-flex align-items-baseline gap-2 mb-2">
              <span className="fs-2 fw-bold text-success">
                ${precioFinal.toLocaleString('es-CL')}
              </span>
              <span className="text-muted small">por {producto.unidad || 'kilo'}</span>
              {aplicaDcto && (
                <s className="text-muted small ms-2">${producto.precio.toLocaleString('es-CL')}</s>
              )}
            </div>

            {aplicaDcto && (
              <div className="mb-3">
                <span className="badge bg-warning-subtle text-dark border border-warning px-2 py-1 small">
                  🎓 20% dcto. Duoc activo
                </span>
              </div>
            )}

            <p className="text-secondary lh-base mb-3">{producto.descripcion}</p>

            {producto.origen && (
              <p className="small text-muted mb-1">
                <strong>origen:</strong> {producto.origen}
              </p>
            )}

            <p className="small text-muted mb-4">
              stock disponible: <strong>{stockDisponible}</strong>
            </p>

            {/* Fila de Compra y Controles */}
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-secondary fw-bold rounded-3"
                  style={{ width: '40px', height: '40px' }}
                  onClick={handleRestar}
                  disabled={stockDisponible === 0}
                >
                  −
                </button>

                <input
                  type="number"
                  className="form-control text-center fw-bold rounded-3"
                  style={{ width: '60px', height: '40px' }}
                  value={cantidad}
                  readOnly
                />

                <button
                  className="btn btn-outline-secondary fw-bold rounded-3"
                  style={{ width: '40px', height: '40px' }}
                  onClick={handleSumar}
                  disabled={stockDisponible === 0}
                >
                  +
                </button>
              </div>

              <button
                className="btn btn-success fw-bold px-4 py-2 rounded-3"
                onClick={handleAgregar}
                disabled={stockDisponible === 0}
              >
                {stockDisponible === 0 ? 'Sin stock' : 'añadir al carrito'}
              </button>
            </div>

            {errorCantidad && (
              <p className="text-danger small mt-2 mb-0 fw-semibold">{errorCantidad}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};