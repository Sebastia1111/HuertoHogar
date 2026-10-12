// src/components/molecules/ProductCard.jsx
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { Heading, Text } from '../atoms/Typography';

export const ProductCard = ({ producto, onAddToCart }) => {
  return (
    <div className="card h-100 shadow-sm border-0 text-center p-3">
      <div className="display-1 mb-2">{producto.icono}</div>
      <div className="mb-2">
        <Badge variant="success">{producto.etiqueta || 'Fresco'}</Badge>
      </div>
      <Heading level={5} className="card-title text-dark fs-6 fw-bold">
        {producto.nombre}
      </Heading>
      <Text className="text-muted extra-small mb-1">Código: {producto.id}</Text>
      <Text className="fs-5 fw-bold text-success mb-3">
        ${producto.precio.toLocaleString('es-CL')}
      </Text>
      
      {/* Reutiliza el Átomo Button */}
      <Button
        variant="success"
        className="w-100 mt-auto fw-bold"
        onClick={() => onAddToCart(producto)}
      >
        🧺 Agregar al Carrito
      </Button>
    </div>
  );
};