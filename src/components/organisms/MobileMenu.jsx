// src/components/organisms/MobileMenu.jsx
import { Button } from '../atoms/Button';
import { Heading, Text } from '../atoms/Typography';

export const MobileMenu = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Fondo oscuro al abrir el menú */}
      <div className="modal-backdrop fade show" onClick={onClose} style={{ zIndex: 1040 }}></div>

      {/* Menú lateral desplegable */}
      <div className="offcanvas offcanvas-start show bg-white" tabIndex="-1" style={{ visibility: 'visible', zIndex: 1050 }}>
        <div className="offcanvas-header border-bottom">
          <Heading level={5} className="offcanvas-title text-success fw-bold d-flex align-items-center mb-0">
            🥑 Huerto<b>Hogar</b>
          </Heading>
          {/* Átomo Button para cerrar */}
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
          <div className="d-grid gap-2">
            {/* Átomos Button para Inicio de Sesión y Registro */}
            <a href="#/ingreso" onClick={onClose} className="text-decoration-none">
              <Button variant="outline-success" className="w-100">Iniciar Sesión</Button>
            </a>
            <a href="#/registro" onClick={onClose} className="text-decoration-none">
              <Button variant="success" className="w-100">Registrarse</Button>
            </a>
          </div>

          <div className="mt-5 border-top pt-3 text-muted">
            <Text className="mb-0 small">📍 Despachos a Santiago, Viña del Mar, Valparaíso, Puente Alto y Concepción.</Text>
          </div>
        </div>
      </div>
    </>
  );
};