// src/pages/AdminPage.jsx
import { PRODUCTOS } from '../data/productos';
import { Button } from '../components/atoms/Button';
import { Heading, Text } from '../components/atoms/Typography';

export const AdminPage = ({ sesion, stocks, onUpdateStock }) => {
  if (!sesion || sesion.tipo !== 'Administrador') {
    return (
      <div className="container my-5 text-center py-5 bg-white border rounded">
        <span className="display-4">🔒</span>
        <Heading level={3} className="mt-3 text-muted">Acceso Restringido</Heading>
        <Text className="text-muted">Sección exclusiva para administradores de HuertoHogar.</Text>
        <a href="#/ingreso"><Button variant="success" className="mt-3">Iniciar Sesión</Button></a>
      </div>
    );
  }

  const handleStockChange = (codigo, valor) => {
    const num = Math.max(0, Number(valor));
    onUpdateStock(codigo, num);
  };

  return (
    <div className="container my-5">
      <Heading level={1} className="fw-bold text-success mb-1">Gestión de Stock</Heading>
      <Text className="text-muted mb-4">Administra el inventario disponible en tiempo real.</Text>

      <div className="bg-white border rounded shadow-sm p-4">
        {PRODUCTOS.map((prod) => {
          const valorActual = stocks[prod.codigo] !== undefined ? stocks[prod.codigo] : prod.stock;

          return (
            <div key={prod.codigo} className="d-flex justify-content-between align-items-center py-3 border-bottom">
              <div className="d-flex align-items-center gap-3">
                <span className="fs-3">{prod.emoji}</span>
                <div>
                  <Heading level={6} className="mb-0 fw-bold">{prod.nombre}</Heading>
                  <Text className="text-muted extra-small mb-0">Código: {prod.codigo}</Text>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <input
                  type="number"
                  min="0"
                  className="form-control text-center"
                  style={{ width: '90px' }}
                  value={valorActual}
                  onChange={(e) => handleStockChange(prod.codigo, e.target.value)}
                />
                <span className="text-muted small">unidades</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};