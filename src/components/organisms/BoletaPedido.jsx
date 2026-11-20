// src/components/organisms/BoletaPedido.jsx
// Muestra un pedido con formato de boleta: detalle, totales y seguimiento de estados.
import { useState } from 'react';
import { ESTADOS_PEDIDO } from '../../utils/permisos';
import { dinero, fechaHora, fechaSimple } from '../../utils/formato';

export const EstadoBadge = ({ estado }) => {
  const info = ESTADOS_PEDIDO[estado] || { texto: estado, color: 'secondary', icono: '' };
  return (
    <span className={`badge bg-${info.color} ${info.color === 'warning' || info.color === 'info' ? 'text-dark' : ''}`}>
      {info.icono} {info.texto}
    </span>
  );
};

export const BoletaPedido = ({ pedido, mostrarCliente = false, children }) => {
  const [abierto, setAbierto] = useState(false);
  const cantidad = (pedido.items || []).reduce((suma, item) => suma + item.cantidad, 0);

  return (
    <div className="bg-white border rounded shadow-sm mb-3" data-testid={`pedido-${pedido.numero}`}>
      <button
        type="button"
        className="btn w-100 text-start p-3 d-flex flex-wrap justify-content-between align-items-center gap-2"
        onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto}
      >
        <div>
          <div className="fw-bold">Boleta {pedido.numero}</div>
          <small className="text-muted">
            {fechaHora(pedido.fecha)} · {cantidad} {cantidad === 1 ? 'producto' : 'productos'}
            {mostrarCliente && <> · {pedido.nombreCliente || pedido.correoCliente}</>}
          </small>
        </div>
        <div className="d-flex align-items-center gap-3">
          <EstadoBadge estado={pedido.estado} />
          <strong className="text-success">{dinero(pedido.total)}</strong>
          <span className="text-muted">{abierto ? '▲' : '▼'}</span>
        </div>
      </button>

      {abierto && (
        <div className="px-3 pb-3 border-top">
          <div className="table-responsive mt-3">
            <table className="table table-sm align-middle mb-2">
              <thead>
                <tr className="small text-muted">
                  <th>Producto</th>
                  <th className="text-center">Cant.</th>
                  <th className="text-end">Precio</th>
                  <th className="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {(pedido.items || []).map((item) => (
                  <tr key={item.codigo}>
                    <td>
                      <div className="fw-semibold small">{item.nombre}</div>
                      <small className="text-muted">{item.codigo}{item.unidad ? ` · ${item.unidad}` : ''}</small>
                    </td>
                    <td className="text-center">{item.cantidad}</td>
                    <td className="text-end small">
                      {item.precioFinal !== item.precioUnitario && (
                        <s className="text-muted me-1">{dinero(item.precioUnitario)}</s>
                      )}
                      {dinero(item.precioFinal)}
                    </td>
                    <td className="text-end small fw-semibold">{dinero(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row g-3">
            <div className="col-md-6 small">
              <div><strong>Entrega preferida:</strong> {fechaSimple(pedido.fechaEntregaPreferida) || 'Por confirmar'}</div>
              <div>
                <strong>Dirección:</strong>{' '}
                {pedido.direccionEntrega
                  ? [pedido.direccionEntrega, pedido.comuna, pedido.region].filter(Boolean).join(', ')
                  : 'Por confirmar'}
              </div>
              {mostrarCliente && <div><strong>Cliente:</strong> {pedido.correoCliente}</div>}
            </div>
            <div className="col-md-6 small">
              <div className="d-flex justify-content-between"><span>Subtotal</span><span>{dinero(pedido.subtotal)}</span></div>
              {pedido.descuento > 0 && (
                <div className="d-flex justify-content-between text-success">
                  <span>Descuento Duoc (20%)</span><span>-{dinero(pedido.descuento)}</span>
                </div>
              )}
              <div className="d-flex justify-content-between text-muted"><span>Neto</span><span>{dinero(pedido.neto)}</span></div>
              <div className="d-flex justify-content-between text-muted"><span>IVA (19%)</span><span>{dinero(pedido.iva)}</span></div>
              <div className="d-flex justify-content-between fw-bold fs-6 border-top pt-1">
                <span>Total</span><span>{dinero(pedido.total)}</span>
              </div>
            </div>
          </div>

          <h6 className="fw-bold mt-3 mb-2">Seguimiento</h6>
          <ul className="list-unstyled small mb-0">
            {(pedido.historial || []).map((h, i) => (
              <li key={`${h.estado}-${i}`} className="d-flex gap-2 mb-1">
                <EstadoBadge estado={h.estado} />
                <span className="text-muted">{fechaHora(h.fecha)}</span>
                {h.comentario && h.comentario !== ESTADOS_PEDIDO[h.estado]?.texto && <span>· {h.comentario}</span>}
              </li>
            ))}
          </ul>

          {children && <div className="mt-3 d-flex flex-wrap gap-2">{children}</div>}
        </div>
      )}
    </div>
  );
};
