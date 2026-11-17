// src/pages/AdminPage.jsx
import { useState, useEffect } from 'react';
import { Button } from '../components/atoms/Button';
import { Heading, Text } from '../components/atoms/Typography';

export const AdminPage = () => {
  const [productos, setProductos] = useState([]);
  const [accesoDenegado, setAccesoDenegado] = useState(false);

  useEffect(() => {
    // 1. Restricción de acceso: Verificar token y rol
    const token = localStorage.getItem('jwt_token');
    const role = localStorage.getItem('user_role');

    // Dependiendo de cómo envíe el backend tu rol, puede ser 'ADMIN' o 'Administrador'
    if (!token || (role !== 'ADMIN' && role !== 'Administrador')) {
      setAccesoDenegado(true);
      return;
    }

    // 2. Si tiene permisos, cargar los datos reales del backend
    cargarInventario();
  }, []);

  const cargarInventario = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch('http://localhost:8080/api/inventario', {
        headers: {
          'Authorization': `Bearer ${token}` // Envío del token JWT para autenticar la petición
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProductos(data);
      }
    } catch (error) {
      console.error("Error al cargar inventario:", error);
    }
  };

  const handleStockChange = (id, nuevoValor) => {
    // Actualiza el estado localmente mientras el usuario escribe
    const num = Math.max(0, Number(nuevoValor));
    setProductos(productos.map(p => p.id === id ? { ...p, stock: num } : p));
  };

  const guardarStock = async (producto) => {
    // 3. Conexión del frontend con el endpoint de actualización en Spring Boot
    try {
      const token = localStorage.getItem('jwt_token');
      // Asegúrate de que la ruta corresponda a tu controlador (ej. PUT /api/inventario o /api/inventario/{id})
      const response = await fetch('http://localhost:8080/api/inventario', {
        method: 'PUT', // o POST/PATCH según hayas definido en ProductoController
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(producto)
      });

      if (response.ok) {
        alert(`Stock de ${producto.nombre} actualizado con éxito.`);
      } else {
        alert('Error al actualizar el stock en el servidor.');
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  if (accesoDenegado) {
    return (
      <div className="container my-5 text-center py-5 bg-white border rounded">
        <span className="display-4">🔒</span>
        <Heading level={3} className="mt-3 text-muted">Acceso Restringido</Heading>
        <Text className="text-muted">Sección exclusiva para administradores de HuertoHogar.</Text>
        <a href="#/ingreso"><Button variant="success" className="mt-3">Iniciar Sesión</Button></a>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <Heading level={1} className="fw-bold text-success mb-1">Gestión de Stock</Heading>
      <Text className="text-muted mb-4">Administra el inventario disponible en tiempo real.</Text>

      <div className="bg-white border rounded shadow-sm p-4">
        {productos.length === 0 ? <Text className="text-center text-muted">Cargando inventario...</Text> : null}
        
        {productos.map((prod) => (
          <div key={prod.id} className="d-flex justify-content-between align-items-center py-3 border-bottom">
            <div className="d-flex align-items-center gap-3">
              <span className="fs-3">🌱</span> {/* Emoji por defecto ya que la BD probablemente no lo almacena */}
              <div>
                <Heading level={6} className="mb-0 fw-bold">{prod.nombre}</Heading>
                <Text className="text-muted extra-small mb-0">ID: {prod.id}</Text>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <input
                type="number"
                min="0"
                className="form-control text-center"
                style={{ width: '90px' }}
                value={prod.stock}
                onChange={(e) => handleStockChange(prod.id, e.target.value)}
              />
              <span className="text-muted small me-3">unidades</span>
              
              {/* Nuevo botón para confirmar el envío de datos a la API */}
              <Button variant="outline-success" size="sm" onClick={() => guardarStock(prod)}>
                Guardar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};