// src/components/organisms/CartDrawer.jsx
import { Button } from '../atoms/Button';
import { Heading, Text } from '../atoms/Typography';

export const CartDrawer = ({ isOpen, onClose, cartItems, onRemoveItem, onUpdateQuantity, onClearCart }) => {
  if (!isOpen) return null;

  const total = cartItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} style={{ zIndex: 1040 }}></div>

      <aside className="offcanvas offcanvas-end show bg-white" style={{ visibility: 'visible', zIndex: 1050 }}>
        <div className="offcanvas-header border-bottom">
          <Heading level={4} className="offcanvas-title text-success fw-bold fs-5 mb-0">
            🛒 Tu Carrito
          </Heading>
          <Button variant="light" className="btn-close" onClick={onClose} aria-label="Cerrar"></Button>
        </div>

        <div className="offcanvas-body d-flex flex-column">
          {cartItems.length === 0 ? (
            <div className="text-center my-auto py-5">
              <span className="display-3">🧺</span>
              <Heading level={5} className="mt-3 text-muted">Tu carrito está vacío</Heading>
              <Text className="text-muted small">Agrega productos frescos desde el catálogo.</Text>
            </div>
          ) : (
            <div className="flex-grow-1 overflow-auto pe-1">
              {cartItems.map((item) => (
                <div key={item.id} className="d-flex align-items-center justify-content-between p-2 mb-2 border rounded">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fs-3">{item.icono}</span>
                    <div>
                      <Heading level={6} className="mb-0 fs-6 fw-bold">{item.nombre}</Heading>
                      <Text className="text-success fw-semibold small mb-0">
                        ${item.precio.toLocaleString('es-CL')}
                      </Text>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <div className="btn-group btn-group-sm">
                      <Button variant="outline-secondary" onClick={() => onUpdateQuantity(item.id, item.cantidad - 1)}>
                        -
                      </Button>
                      <span className="btn btn-sm btn-light border-0 disabled fw-bold px-2">
                        {item.cantidad}
                      </span>
                      <Button variant="outline-secondary" onClick={() => onUpdateQuantity(item.id, item.cantidad + 1)}>
                        +
                      </Button>
                    </div>
                    <Button variant="outline-danger" className="btn-sm p-1" onClick={() => onRemoveItem(item.id)}>
                      🗑️
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-top pt-3 mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Heading level={5} className="mb-0 fs-5 text-muted">Total:</Heading>
              <Text className="fs-4 fw-bold text-success mb-0">
                ${total.toLocaleString('es-CL')}
              </Text>
            </div>

            <div className="d-grid gap-2">
              <Button variant="outline-danger" onClick={onClearCart} disabled={cartItems.length === 0}>
                Vaciar carrito
              </Button>
              <Button variant="success" className="fw-bold" disabled={cartItems.length === 0} onClick={() => alert('¡Compra realizada con éxito!')}>
                Finalizar compra
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};