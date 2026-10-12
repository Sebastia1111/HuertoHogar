// src/components/organisms/CartDrawer.jsx
import { calcularPrecioReal } from '../../utils/storage';

export const CartDrawer = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
  sesion,
  onMostrarAviso
}) => {
  if (!isOpen) return null;

  const total = cartItems.reduce((suma, item) => {
    const pReal = calcularPrecioReal(item.precio, sesion);
    return suma + pReal * item.cantidad;
  }, 0);

  const handleFinalizarCompra = () => {
    if (cartItems.length === 0) {
      onMostrarAviso('Tu carrito está vacío');
      return;
    }

    // Validar si hay usuario logueado
    if (!sesion) {
      onClose();
      onMostrarAviso('Inicia sesión para finalizar tu compra');
      window.location.hash = '#/ingreso';
      return;
    }

    // Generar pedido simulado
    const pedidos = JSON.parse(localStorage.getItem('hh_pedidos') || '[]');
    const numPedido = 'HH-' + (1001 + pedidos.length);

    pedidos.push({
      numero: numPedido,
      cliente: sesion.correo,
      fecha: new Date().toLocaleDateString('es-CL'),
      items: cartItems,
      total,
      estado: 'pendiente'
    });

    localStorage.setItem('hh_pedidos', JSON.stringify(pedidos));

    onClearCart();
    onClose();
    onMostrarAviso(`¡Pedido ${numPedido} recibido! Te avisaremos cuando esté en camino 🌱`);
  };

  return (
    <>
      <div
        className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
        style={{ zIndex: 1040 }}
        onClick={onClose}
      />

      <div
        className="position-fixed top-0 end-0 h-100 bg-white shadow-lg d-flex flex-column"
        style={{ width: 'min(380px, 100vw)', zIndex: 1050 }}
      >
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
          <h5 className="m-0 fw-bold">Tu carrito</h5>
          <button className="btn-close" onClick={onClose} aria-label="Cerrar"></button>
        </div>

        <div className="flex-grow-1 overflow-auto p-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <span className="display-4 d-block mb-2">🧺</span>
              <p className="mb-3">Tu carrito está vacío</p>
              <a
                href="#/inicio"
                onClick={onClose}
                className="btn btn-outline-success btn-sm rounded-3 fw-bold"
              >
                Ver catálogo
              </a>
            </div>
          ) : (
            cartItems.map((item) => {
              const precioCalculado = calcularPrecioReal(item.precio, sesion);
              return (
                <div
                  key={item.codigo}
                  className="d-flex align-items-center gap-3 py-3 border-bottom"
                >
                  <div
                    className={`cat-${item.categoria} rounded-3 d-flex align-items-center justify-content-center flex-shrink-0`}
                    style={{ width: '54px', height: '54px', fontSize: '26px' }}
                  >
                    {item.emoji}
                  </div>

                  <div className="flex-grow-1 min-w-0">
                    <h6 className="m-0 text-dark fw-bold small text-truncate">{item.nombre}</h6>
                    <span className="text-success fw-bold small">
                      ${precioCalculado.toLocaleString('es-CL')}
                    </span>

                    <div className="d-flex align-items-center gap-2 mt-1">
                      <button
                        className="btn btn-sm btn-outline-secondary py-0 px-2 fw-bold"
                        onClick={() => onUpdateQuantity(item.codigo, item.cantidad - 1)}
                      >
                        −
                      </button>

                      <span className="fw-bold small">{item.cantidad}</span>

                      <button
                        className="btn btn-sm btn-outline-secondary py-0 px-2 fw-bold"
                        onClick={() => onUpdateQuantity(item.codigo, item.cantidad + 1)}
                      >
                        +
                      </button>

                      <button
                        className="btn btn-sm text-danger border-0 p-0 ms-2 extra-small"
                        onClick={() => onRemoveItem(item.codigo)}
                      >
                        quitar
                      </button>
                    </div>
                  </div>

                  <strong className="text-dark small">
                    ${(precioCalculado * item.cantidad).toLocaleString('es-CL')}
                  </strong>
                </div>
              );
            })
          )}
        </div>

        <div className="p-3 border-top bg-light">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted fw-bold">Total</span>
            <strong className="fs-4 text-success">${total.toLocaleString('es-CL')}</strong>
          </div>

          <button
            className="btn btn-outline-danger w-100 mb-2 btn-sm fw-bold rounded-3"
            onClick={onClearCart}
            disabled={cartItems.length === 0}
          >
            Vaciar carrito
          </button>

          <button
            className="btn btn-success w-100 fw-bold py-2 rounded-3"
            onClick={handleFinalizarCompra}
            disabled={cartItems.length === 0}
          >
            Finalizar compra
          </button>
        </div>
      </div>
    </>
  );
};