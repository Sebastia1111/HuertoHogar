// src/pages/PedidosPage.jsx
// Historial de compras del cliente: boletas, seguimiento de estado y cancelación.
import { useCallback, useEffect, useState } from 'react';
import { Button } from '../components/atoms/Button';
import { Heading, Text } from '../components/atoms/Typography';
import { AccesoRestringido } from '../components/molecules/AccesoRestringido';
import { BoletaPedido } from '../components/organisms/BoletaPedido';
import { cancelarPedido, obtenerPedidos } from '../services/tiendaApi';
import { puedeCancelarPedido } from '../utils/permisos';

export const PedidosPage = ({ sesion, verificandoSesion = false, onMostrarAviso, onPedidoCancelado }) => {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [cancelando, setCancelando] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const datos = await obtenerPedidos();
      setPedidos(Array.isArray(datos) ? datos : []);
    } catch (e) {
      setError(e.message || 'No se pudieron cargar tus pedidos');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (!sesion) return;
    // Carga inicial de los pedidos desde la API (operación asíncrona).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar();
  }, [sesion, cargar]);

  if (verificandoSesion) return <AccesoRestringido tipo="verificando" />;
  if (!sesion) return <AccesoRestringido mensaje="Inicia sesión para ver tus pedidos y boletas." />;

  const handleCancelar = async (numero) => {
    if (!window.confirm(`¿Cancelar el pedido ${numero}? El stock se devolverá a la tienda.`)) return;
    setCancelando(numero);
    try {
      const actualizado = await cancelarPedido(numero);
      setPedidos((prev) => prev.map((p) => (p.numero === numero ? actualizado : p)));
      onMostrarAviso?.(`Pedido ${numero} cancelado`);
      onPedidoCancelado?.();
    } catch (e) {
      onMostrarAviso?.(e.message || 'No se pudo cancelar el pedido');
    } finally {
      setCancelando(null);
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: '860px' }}>
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <Heading level={1} className="fw-bold text-success mb-1">Mis pedidos</Heading>
          <Text className="text-muted mb-0">Revisa tus boletas y el estado de cada entrega.</Text>
        </div>
        <Button variant="outline-success" className="btn-sm" onClick={cargar} disabled={cargando}>
          {cargando ? 'Actualizando…' : '↻ Actualizar'}
        </Button>
      </div>

      {error && (
        <div className="alert alert-warning d-flex justify-content-between align-items-center" role="alert">
          <span>{error}</span>
          <Button variant="outline-dark" className="btn-sm" onClick={cargar}>Reintentar</Button>
        </div>
      )}

      {cargando && pedidos.length === 0 && (
        <div className="text-center py-5"><div className="spinner-border text-success" role="status"></div></div>
      )}

      {!cargando && !error && pedidos.length === 0 && (
        <div className="text-center py-5 bg-white border rounded">
          <span className="display-4 d-block mb-2">🧺</span>
          <Text className="text-muted">Aún no tienes pedidos.</Text>
          <a href="#/inicio"><Button variant="success">Ir al catálogo</Button></a>
        </div>
      )}

      {pedidos.map((pedido) => (
        <BoletaPedido key={pedido.numero} pedido={pedido}>
          {puedeCancelarPedido(pedido, sesion) && (
            <Button
              variant="outline-danger"
              className="btn-sm"
              onClick={() => handleCancelar(pedido.numero)}
              disabled={cancelando === pedido.numero}
            >
              {cancelando === pedido.numero ? 'Cancelando…' : 'Cancelar pedido'}
            </Button>
          )}
          <Button variant="outline-secondary" className="btn-sm" onClick={() => window.print()}>
            🖨️ Imprimir
          </Button>
        </BoletaPedido>
      ))}
    </div>
  );
};
