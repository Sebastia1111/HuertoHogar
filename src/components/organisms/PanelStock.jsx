// src/components/organisms/PanelStock.jsx
// Gestión de stock en tiempo real (antes era todo el contenido de AdminPage).
import { useState } from 'react';
import { PRODUCTOS } from '../../data/productos';
import { Button } from '../atoms/Button';
import { Heading, Text } from '../atoms/Typography';

export const PanelStock = ({
  productos,
  stocks,
  onUpdateStock,
  modoApi = false,
  cargando = false,
  errorApi = '',
  onReintentar
}) => {
  const [borradores, setBorradores] = useState({});
  const [guardando, setGuardando] = useState(null);

  const lista = productos || PRODUCTOS;
  const stockDe = (producto) => stocks?.[producto.codigo] ?? producto.stock;

  const totalUnidades = lista.reduce((suma, producto) => suma + stockDe(producto), 0);
  const productosStockBajo = lista.filter(
    (producto) => stockDe(producto) <= Number(producto.stockMinimo ?? 0)
  ).length;

  const valorDe = (producto) => borradores[producto.codigo] ?? stockDe(producto);

  const handleChange = (codigo, valor) => {
    setBorradores((prev) => ({ ...prev, [codigo]: valor }));
  };

  const handleGuardar = async (producto) => {
    const valor = Math.max(0, Number(valorDe(producto)) || 0);
    setGuardando(producto.codigo);
    const guardado = await onUpdateStock(producto.codigo, valor);
    setGuardando(null);

    if (guardado !== false) {
      setBorradores((prev) => {
        const siguientes = { ...prev };
        delete siguientes[producto.codigo];
        return siguientes;
      });
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <Heading level={2} className="fw-bold text-success mb-1">Gestión de Stock</Heading>
          <Text className="text-muted mb-0">Administra el inventario disponible en tiempo real.</Text>
        </div>
        <span className={`badge ${modoApi ? 'bg-success' : 'bg-warning text-dark'} px-3 py-2`}>
          {cargando ? 'Conectando…' : modoApi ? 'API MySQL conectada' : 'Modo local (sin API)'}
        </span>
      </div>

      {!modoApi && (
        <div className="alert alert-warning d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <strong>No se pudo conectar con el microservicio de inventario.</strong>
            <div className="small">
              La página sigue funcionando con datos locales. {errorApi && <>Detalle: {errorApi}</>}
            </div>
          </div>
          {onReintentar && (
            <Button variant="outline-dark" className="btn-sm" onClick={onReintentar} disabled={cargando}>
              Reintentar conexión
            </Button>
          )}
        </div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4">
          <div className="bg-white border rounded shadow-sm p-3 h-100">
            <div className="text-muted small text-uppercase fw-bold">Productos</div>
            <div className="fs-3 fw-bold text-success">{lista.length}</div>
          </div>
        </div>
        <div className="col-6 col-md-4">
          <div className="bg-white border rounded shadow-sm p-3 h-100">
            <div className="text-muted small text-uppercase fw-bold">Unidades en stock</div>
            <div className="fs-3 fw-bold text-success">{totalUnidades.toLocaleString('es-CL')}</div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="bg-white border rounded shadow-sm p-3 h-100">
            <div className="text-muted small text-uppercase fw-bold">Alertas de stock bajo</div>
            <div className={`fs-3 fw-bold ${productosStockBajo > 0 ? 'text-danger' : 'text-success'}`}>
              {productosStockBajo}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded shadow-sm p-4">
        {lista.map((producto) => {
          const valorActual = stockDe(producto);
          const stockMinimo = Number(producto.stockMinimo ?? 0);
          const cambiado = borradores[producto.codigo] !== undefined;
          const salvando = guardando === producto.codigo;

          return (
            <div
              key={producto.codigo}
              className="d-flex flex-wrap justify-content-between align-items-center gap-3 py-3 border-bottom"
            >
              <div className="d-flex align-items-center gap-3">
                <span className="fs-3">{producto.emoji}</span>
                <div>
                  <Heading level={6} className="mb-0 fw-bold">{producto.nombre}</Heading>
                  <Text className="text-muted extra-small mb-0">
                    Código: {producto.codigo} · {producto.origen || 'Origen no informado'}
                  </Text>
                  {valorActual <= stockMinimo && (
                    <span className="badge bg-danger-subtle text-danger mt-1">
                      Stock bajo (mínimo {stockMinimo})
                    </span>
                  )}
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <input
                  type="number"
                  min="0"
                  className="form-control text-center"
                  style={{ width: '100px' }}
                  value={valorDe(producto)}
                  onChange={(e) => handleChange(producto.codigo, e.target.value)}
                  onBlur={() => cambiado && !salvando && handleGuardar(producto)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleGuardar(producto);
                    }
                  }}
                  disabled={salvando}
                />
                <span className="text-muted small">unidades</span>
                <Button
                  variant={cambiado ? 'success' : 'outline-secondary'}
                  className="btn-sm"
                  onClick={() => handleGuardar(producto)}
                  disabled={!cambiado || salvando}
                  title={modoApi ? 'Guardar stock en MySQL' : 'Guardar stock en modo local'}
                >
                  {salvando ? '…' : 'Guardar'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
