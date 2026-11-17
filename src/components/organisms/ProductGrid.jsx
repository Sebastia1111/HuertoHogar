
import { useState, useEffect } from 'react';
import { Heading, Text } from '../atoms/Typography';
import { Button } from '../atoms/Button';

export const ProductGrid = () => {
  // 1. Estados para manejar los datos, la carga y posibles errores
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // 2. useEffect para llamar a la API automáticamente al cargar la página
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        // Petición GET al backend (suele ser público, por lo que no requiere token)
        const response = await fetch('http://localhost:8080/api/inventario');
        
        if (!response.ok) {
          throw new Error('No se pudo conectar con la base de datos.');
        }
        
        const data = await response.json();
        setProductos(data); // Guardamos el array de la base de datos en el estado
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerProductos();
  }, []);

  // 3. Renderizado condicional mientras se cargan los datos
  if (cargando) {
    return <div className="text-center my-5"><Text>Cargando productos de HuertoHogar...</Text></div>;
  }

  if (error) {
    return <div className="text-center my-5 text-danger"><Text>{error}</Text></div>;
  }

  // 4. Mapeo de los productos reales en la interfaz
  return (
    <div className="container my-5">
      <Heading level={2} className="text-center mb-4 text-success">Nuestro Catálogo</Heading>
      
      <div className="row g-4">
        {productos.map((prod) => (
          <div key={prod.id} className="col-12 col-md-4 col-lg-3">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center d-flex flex-column">
                <span className="display-4 mb-3">🌱</span> {/* Puedes cambiarlo si guardas imágenes */}
                <Heading level={5} className="card-title fw-bold">{prod.nombre}</Heading>
                <Text className="text-muted small mb-3 flex-grow-1">{prod.descripcion}</Text>
                
                <div className="mt-auto">
                  <Heading level={6} className="text-success fw-bold mb-2">
                    ${prod.precio?.toLocaleString('es-CL')}
                  </Heading>
                  <Text className="small text-muted mb-3">Stock: {prod.stock} unidades</Text>
                  
                  <Button 
                    variant="success" 
                    className="w-100"
                    disabled={prod.stock <= 0}
                  >
                    {prod.stock > 0 ? 'Agregar al carrito' : 'Sin Stock'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};