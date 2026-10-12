// src/components/organisms/ProductGrid.jsx
import { ProductCard } from '../molecules/ProductCard';
import { Heading, Text } from '../atoms/Typography';

export const ProductGrid = ({ productos, onAddToCart }) => {
  if (productos.length === 0) {
    return (
      <div className="text-center py-5 border rounded bg-white w-100">
        <span className="display-4">🔍</span>
        <Heading level={4} className="mt-2 text-muted">No se encontraron productos</Heading>
        <Text className="text-muted small">Prueba cambiando los filtros de búsqueda.</Text>
      </div>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
      {productos.map((prod) => (
        <div key={prod.id} className="col">
          <ProductCard producto={prod} onAddToCart={onAddToCart} />
        </div>
      ))}
    </div>
  );
};