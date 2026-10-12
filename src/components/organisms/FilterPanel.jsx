// src/components/organisms/FilterPanel.jsx
import { FormField } from '../molecules/FormField';
import { SelectField } from '../molecules/SelectField';
import { Button } from '../atoms/Button';
import { Heading, Text } from '../atoms/Typography';

export const FilterPanel = ({
  texto,
  categoria,
  orden,
  onTextoChange,
  onCategoriaChange,
  onOrdenChange,
  onLimpiar,
  totalResultados
}) => {
  return (
    <aside className="p-3 bg-light border rounded shadow-sm">
      <Heading level={4} className="fs-5 fw-bold mb-3 text-success">
        Búsqueda especial
      </Heading>

      {/* Reutiliza la Molécula FormField */}
      <FormField
        label="Buscar"
        name="filtroTexto"
        value={texto}
        onChange={(e) => onTextoChange(e.target.value)}
        placeholder="Nombre o código..."
      />

      {/* Reutiliza la Molécula SelectField */}
      <SelectField
        label="Categoría"
        name="filtroCategoria"
        value={categoria}
        onChange={(e) => onCategoriaChange(e.target.value)}
        options={[
          { value: 'todas', label: 'Todas las categorías' },
          { value: 'frutas', label: 'Frutas frescas' },
          { value: 'verduras', label: 'Verduras orgánicas' },
          { value: 'organicos', label: 'Productos orgánicos' },
          { value: 'lacteos', label: 'Productos lácteos' }
        ]}
      />

      {/* Reutiliza la Molécula SelectField */}
      <SelectField
        label="Ordenar por"
        name="filtroOrden"
        value={orden}
        onChange={(e) => onOrdenChange(e.target.value)}
        options={[
          { value: 'relevancia', label: 'Relevancia' },
          { value: 'precio-asc', label: 'Precio: menor a mayor' },
          { value: 'precio-desc', label: 'Precio: mayor a menor' },
          { value: 'nombre', label: 'Nombre (A-Z)' }
        ]}
      />

      <Text className="fw-semibold text-muted small my-2">
        Resultados encontrados: <span className="text-success">{totalResultados}</span>
      </Text>

      {/* Reutiliza el Átomo Button */}
      <Button variant="outline-secondary" className="w-100 fw-semibold" onClick={onLimpiar}>
        Limpiar filtros
      </Button>
    </aside>
  );
};