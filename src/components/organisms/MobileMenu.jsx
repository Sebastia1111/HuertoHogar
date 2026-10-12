// src/components/organisms/MobileMenu.jsx
import { Button } from '../atoms/Button';
import { Heading, Text } from '../atoms/Typography';

export const MobileMenu = ({ isOpen, onClose, sesion, onCerrarSesion }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} style={{ zIndex: 1040 }}></div>

      <div className="offcanvas offcanvas-start show bg-white" tabIndex="-1" style={{ visibility: 'visible', zIndex: 1050 }}>
        <div className="offcanvas-header border-bottom">
          <Heading level={5} className="offcanvas-title text-success fw-bold d-flex align-items-center mb-0">
            🥑 Huerto<b>Hogar</b>
          </Heading>
          <Button variant="light" className="btn-close" onClick={onClose} aria-label="Cerrar"></Button>
        </div>

        <div className="offcanvas-body">
          <Text className="text-uppercase fw-bold text-muted small mb-2">Tienda</Text>
          <ul className="nav flex-column mb-4">
            <li className="nav-item mb-2">
              <a className="nav-link text-dark fw-semibold" href="#/inicio" onClick={onClose}>🏠 Inicio</a>
            </li>
            <li className="nav-item mb-2">
              <a className="nav-link text-dark fw-semibold" href="#/inicio" onClick={onClose}>🥬 Productos</a>
            </li>
            <li className="nav-item mb-2">
              <a className="nav-link text-dark fw-semibold" href="#/nosotros" onClick={onClose}>🤝 Nosotros</a>
            </li>
            <li className="nav-item mb-2">
              <a className="nav-link text-dark fw-semibold" href="#/blogs" onClick={onClose}>📰 Blogs</a>
            </li>
            <li className="nav-item mb-2">
              <a className="nav-link text-dark fw-semibold" href="#/contacto" onClick={onClose}>✉️ Contacto</a>
            </li>
          </ul>

          <Text className="text-uppercase fw-bold text-muted small mb-2">Cuenta</Text>
          {sesion ? (
            <div className="p-3 bg-light rounded-3 border">
              <p className="fw-bold m-0 text-dark">Hola, {sesion.nombre || sesion.correo}</p>
              <small className="text-muted d-block mb-3">{sesion.tipo || 'Cliente'}</small>

              {sesion.tipo === 'Administrador' && (
                <a
                  href="#/admin"
                  className="btn btn-outline-success btn-sm w-100 mb-2 fw-bold"
                  onClick={onClose}
                >
                  📦 Gestionar stock
                </a>
              )}

              <Button
                variant="outline-danger"
                className="w-100 btn-sm fw-bold"
                onClick={() => {
                  onClose();
                  onCerrarSesion();
                }}
              >
                Cerrar sesión
              </Button>
            </div>
          ) : (
            <div className="d-grid gap-2">
              <a href="#/ingreso" onClick={onClose} className="text-decoration-none">
                <Button variant="outline-success" className="w-100">Iniciar Sesión</Button>
              </a>
              <a href="#/registro" onClick={onClose} className="text-decoration-none">
                <Button variant="success" className="w-100">Registrarse</Button>
              </a>
            </div>
          )}

          <div className="mt-5 border-top pt-3 text-muted">
            <Text className="mb-0 small">📍 Despachos a Santiago, Viña del Mar, Valparaíso, Puente Alto y Concepción.</Text>
          </div>
        </div>
      </div>
    </>
  );
};