// src/components/organisms/PanelPedidos.jsx
// ADMIN y VENDEDOR: ver todos los pedidos y avanzar su estado hasta la entrega.
import { useCallback, useEffect, useState } from 'react';
import { Button } from '../atoms/Button';
import { Heading, Text } from '../atoms/Typography';
import { BoletaPedido } from './BoletaPedido';
import { cambiarEstadoPedido, listarTodosPedidos } from '../../services/tiendaApi';
import { ESTADOS_PEDIDO, SIGUIENTE_ESTADO, puedeCancelarPedido } from '../../utils/permisos';

export const PanelPedidos = ({ sesion, onMostrarAviso, onStockCambiado }) => {
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [procesando, setProcesando] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const datos = await listarTodosPedidos(filtro || undefined);
      setPedidos(Array.isArray(datos) ? datos : []);
    } catch (e) {
      setError(e.message || 'No se pudieron cargar los pedidos');
    } finally {
      setCargando(false);
    }
  }, [filtro]);

  useEffect(() => {
    // Carga de pedidos desde la API cada vez que cambia el filtro.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar();
  }, [cargar]);

  const cambiar = async (pedido, estado) => {
    if (estado === 'CANCELADO' && !window.confirm(`¿Cancelar el pedido ${pedido.numero}? Se devolverá el stock.`)) {
      return;
    }
    setProcesando(pedido.numero);
    try {
      const actualizado = await cambiarEstadoPedido(pedido.numero, estado);
      setPedidos((prev) => prev.map((p) => (p.numero === pedido.numero ? actualizado : p)));
      onMostrarAviso?.(`Pedido ${pedido.numero}: ${ESTADOS_PEDIDO[estado]?.texto || estado}`);
      if (estado === 'CANCELADO') onStockCambiado?.();
    } catch (e) {
      onMostrarAviso?.(e.message || 'No se pudo cambiar el estado');
    } finally {
      setProcesando(null);
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-3">
        <div>
          <Heading level={2} className="fw-bold text-success mb-1">Pedidos</Heading>
          <Text className="text-muted mb-0">Avanza cada pedido desde la preparación hasta la entrega.</Text>
        </div>
        <div className="d-flex gap-2">
          <select
            className="form-select form-select-sm"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            aria-label="Filtrar por estado"
          >
            <option value="">Todos los estados</option>
            {Object.entries(ESTADOS_PEDIDO).map(([clave, info]) => (
              <option key={clave} value={clave}>{info.texto}</option>
            ))}
          </select>
          <Button variant="outline-success" className="btn-sm text-nowrap" onClick={cargar} disabled={cargando}>
            ↻ Actualizar
          </Button>
        </div>
      </div>

      {error && <div className="alert alert-warning">{error}</div>}
      {cargando && pedidos.length === 0 && (
        <div className="text-center py-4"><div className="spinner-border text-success" role="status"></div></div>
      )}
      {!cargando && !error && pedidos.length === 0 && (
        <Text className="text-muted text-center py-4">No hay pedidos {filtro ? 'en este estado' : 'todavía'}.</Text>
      )}

      {pedidos.map((pedido) => {
        const siguiente = SIGUIENTE_ESTADO[pedido.estado];
        return (
          <BoletaPedido key={pedido.numero} pedido={pedido} mostrarCliente>
            {siguiente && (
              <Button
                variant="success"
                className="btn-sm"
                onClick={() => cambiar(pedido, siguiente)}
                disabled={procesando === pedido.numero}
              >
                Marcar como: {ESTADOS_PEDIDO[siguiente].texto}
              </Button>
            )}
            {puedeCancelarPedido(pedido, sesion) && (
              <Button
                variant="outline-danger"
                className="btn-sm"
                onClick={() => cambiar(pedido, 'CANCELADO')}
                disabled={procesando === pedido.numero}
              >
                Cancelar pedido
              </Button>
            )}
          </BoletaPedido>
        );
      })}
    </div>
  );
};
