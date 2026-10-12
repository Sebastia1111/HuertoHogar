// src/components/molecules/ProductCard.jsx
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { Heading, Text } from '../atoms/Typography';
import { calcularPrecioReal, tieneDescuentoDuoc } from '../../utils/storage';

export const ProductCard = ({ producto, sesion, onAddToCart }) => {
  const codigo = producto.codigo || producto.id;
  const emoji = producto.emoji || producto.icono || '🧺';
  const precioBase = producto.precio || 0;

  const precioFinal = calcularPrecioReal(precioBase, sesion);
  const aplicaDcto = tieneDescuentoDuoc(sesion);

  return (
    <div className="card h-100 shadow-sm border-0 text-center p-3 rounded-4">
      <div className={`display-1 mb-2 p-3 rounded-3 cat-${producto.categoria}`}>{emoji}</div>
      <div className="mb-2">
        <Badge variant="success">{producto.categoria || 'Fresco'}</Badge>
      </div>
      <Heading level={5} className="card-title text-dark fs-6 fw-bold">
        {producto.nombre}
      </Heading>
      <Text className="text-muted extra-small mb-1">Código: {codigo}</Text>

      <div className="mb-3">
        <span className="fs-5 fw-bold text-success">${precioFinal.toLocaleString('es-CL')}</span>
        {aplicaDcto && (
          <s className="text-muted small ms-2">${precioBase.toLocaleString('es-CL')}</s>
        )}
      </div>

      <Button
        variant="success"
        className="w-100 mt-auto fw-bold"
        onClick={() => onAddToCart({ ...producto, precio: precioFinal })}
      >
        🧺 Agregar al Carrito
      </Button>
    </div>
  );
};