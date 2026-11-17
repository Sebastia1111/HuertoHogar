// src/components/molecules/ProductCard.jsx
import { Button } from '../atoms/Button';
import { calcularPrecioReal, tieneDescuentoDuoc } from '../../utils/storage';

export const ProductCard = ({ producto, sesion, stocks = {}, onAddToCart }) => {
  const codigo = producto.codigo || producto.id;
  const emoji = producto.emoji || producto.icono || '🧺';
  const precioBase = producto.precio || 0;

  const stockDisponible = stocks[codigo] !== undefined ? stocks[codigo] : (producto.stock || 0);

  const precioFinal = calcularPrecioReal(precioBase, sesion);
  const aplicaDcto = tieneDescuentoDuoc(sesion);

  const handleCardClick = () => {
    window.location.hash = `#/producto/${codigo}`;
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    if (stockDisponible > 0) {
      onAddToCart({ ...producto, precio: precioFinal });
    }
  };

  return (
    <div
      className="card h-100 border-0 rounded-4 shadow-sm overflow-hidden tarjeta-producto"
      onClick={handleCardClick}
      style={{ cursor: 'pointer', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
    >
      <div
        className={`cat-${producto.categoria || 'frutas'} d-flex align-items-center justify-content-center py-4`}
        style={{ minHeight: '160px' }}
      >
        <span className="display-2">{emoji}</span>
      </div>

      <div className="card-body text-start p-3 d-flex flex-column justify-content-between">
        <div>
          <small className="text-muted d-block extra-small fw-semibold mb-1">
            {codigo}
          </small>

          <h6 className="card-title fw-bold text-dark fs-6 mb-2">
            {producto.nombre}
          </h6>

          <div className="d-flex align-items-baseline gap-1 mb-1">
            <span className="fs-5 fw-bold text-success">
              ${precioFinal.toLocaleString('es-CL')}
            </span>
            <span className="text-muted small">/ {producto.unidad || 'kilo'}</span>
            {aplicaDcto && (
              <s className="text-muted extra-small ms-1">${precioBase.toLocaleString('es-CL')}</s>
            )}
          </div>

          <p className="text-muted extra-small mb-3">
            {stockDisponible > 0 ? `${stockDisponible} en stock` : <span className="text-danger fw-bold">Sin stock</span>}
          </p>
        </div>

        <Button
          variant={stockDisponible > 0 ? "success" : "secondary"}
          className="w-100 fw-bold rounded-3 py-2 btn-añadir"
          onClick={handleAddToCartClick}
          disabled={stockDisponible <= 0}
        >
          {stockDisponible > 0 ? 'añadir' : 'Agotado'}
        </Button>
      </div>
    </div>
  );
};