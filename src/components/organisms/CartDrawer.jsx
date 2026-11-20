// src/components/organisms/CartDrawer.jsx
import { useState } from 'react';
import { calcularPrecioReal } from '../../utils/storage';

// Fecha local en formato YYYY-MM-DD sumando días a hoy
const fechaMasDias = (dias) => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
};

export const CartDrawer = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
  sesion,
  onMostrarAviso,
  onFinalizarCompra,
  modoApi = false
}) => {
  const [procesando, setProcesando] = useState(false);
  const [fechaEntrega, setFechaEntrega] = useState(() => fechaMasDias(2));

  if (!isOpen) return null;

  const total = cartItems.reduce((suma, item) => {
    const pReal = calcularPrecioReal(item.precio, sesion);
    return suma + pReal * item.cantidad;
  }, 0);

  const handleVerCatalogo =(e) => {
    e.preventDefault();
    onClose();
  
    const irAlCatalogo =()=>{
      const elemento = document.getElementById('catalogo')
      if(elemento){
        elemento.scrollIntoView({ behavior: 'smooth'});
      }
    };

    if (window.location.hash !== '#/inicio' && window.location.hash !== ''){
      window.location.hash = '#/inicio';
      setTimeout(irAlCatalogo, 150)

    } else {
      irAlCatalogo();
    }
  
  };



  const handleFinalizarCompra = async () => {
    if (cartItems.length === 0) {
      onMostrarAviso('Tu carrito está vacío');
      return;
    }

    if (!sesion) {
      onClose();
      onMostrarAviso('Inicia sesión para finalizar tu compra');
      window.location.assign('#/ingreso');
      return;
    }

    const minimo = fechaMasDias(1);
    const maximo = fechaMasDias(30);
    if (fechaEntrega < minimo || fechaEntrega > maximo) {
      onMostrarAviso('Elige una fecha de entrega entre mañana y los próximos 30 días');
      return;
    }

    // Número provisorio: el definitivo (boleta HH-xxxx) lo asigna el backend
    const referencia = 'WEB-' + Date.now();

    setProcesando(true);
    try {
      const respuesta = onFinalizarCompra
        ? await onFinalizarCompra(cartItems, referencia, { fechaEntrega })
        : null;

      onClearCart();
      onClose();

      if (respuesta?.numero) {
        onMostrarAviso(
          `¡Pedido ${respuesta.numero} confirmado por $${Number(respuesta.total).toLocaleString('es-CL')}! ` +
            'Revisa tu boleta en "Mis pedidos" 🌱'
        );
      } else if (modoApi) {
        onMostrarAviso('Compra registrada y stock actualizado 🌱');
      } else {
        // Modo local (backend apagado): el pedido no queda registrado en el servidor
        onMostrarAviso('Compra simulada en modo local: el backend no está disponible.');
      }
    } catch (error) {
      if (error?.status === 401 || error?.status === 403) {
        onMostrarAviso('Tu sesión expiró o no tiene permisos. Inicia sesión nuevamente.');
        onClose();
        window.location.assign('#/ingreso');
        return;
      }
      onMostrarAviso(error?.message || 'No se pudo descontar el stock. Intenta nuevamente.');
    } finally {
      setProcesando(false);
    }
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
                onClick={handleVerCatalogo}
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
          {cartItems.length > 0 && sesion && modoApi && (
            <div className="mb-3">
              <label htmlFor="fechaEntrega" className="form-label small fw-bold mb-1">
                Fecha de entrega preferida
              </label>
              <input
                id="fechaEntrega"
                type="date"
                className="form-control form-control-sm"
                value={fechaEntrega}
                min={fechaMasDias(1)}
                max={fechaMasDias(30)}
                onChange={(e) => setFechaEntrega(e.target.value)}
              />
            </div>
          )}
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
            disabled={cartItems.length === 0 || procesando}
          >
            {procesando ? 'Procesando…' : 'Finalizar compra'}
          </button>
        </div>
      </div>
    </>
  );
};