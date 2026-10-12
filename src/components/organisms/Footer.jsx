// src/components/organisms/Footer.jsx
import { Heading, Text } from '../atoms/Typography';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row g-4">
          
          {/* Marca / Descripción con Átomo Text */}
          <div className="col-lg-4 col-md-6">
            <a href="#/inicio" className="text-success text-decoration-none fw-bold fs-4 d-flex align-items-center mb-3">
              <svg className="me-2" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 22V10"/>
                <path d="M12 12C12 7 8 4 3 4c0 5 4 8 9 8z"/>
                <path d="M12 10c0-4 3-6 9-6 0 4-3 6-9 6z"/>
              </svg>
              <span className="text-white">Huerto<b className="text-success">Hogar</b></span>
            </a>
            <Text className="text-muted small">
              Conecta con la naturaleza y lleva lo mejor del campo a tu mesa. Productos frescos y saludables, directo a tu hogar.
            </Text>
          </div>

          {/* Navegación con Átomo Heading */}
          <div className="col-lg-2 col-md-6">
            <Heading level={5} className="text-uppercase fw-bold fs-6 mb-3 text-white">Navegación</Heading>
            <ul className="list-unstyled small">
              <li className="mb-2"><a href="#/inicio" className="text-muted text-decoration-none">Inicio</a></li>
              <li className="mb-2"><a href="#/inicio" className="text-muted text-decoration-none">Productos</a></li>
              <li className="mb-2"><a href="#/nosotros" className="text-muted text-decoration-none">Nosotros</a></li>
              <li className="mb-2"><a href="#/blogs" className="text-muted text-decoration-none">Blogs</a></li>
              <li className="mb-2"><a href="#/contacto" className="text-muted text-decoration-none">Contacto</a></li>
            </ul>
          </div>

          {/* Contacto con Átomo Heading */}
          <div className="col-lg-3 col-md-6">
            <Heading level={5} className="text-uppercase fw-bold fs-6 mb-3 text-white">Contacto</Heading>
            <ul className="list-unstyled text-muted small">
              <li className="mb-2">📧 contacto@huertohogar.cl</li>
              <li className="mb-2">📞 +56 9 1234 5678</li>
              <li className="mb-2">🕐 Lunes a sábado, 9:00 a 19:00</li>
            </ul>
          </div>

          {/* Ciudades con Átomo Heading */}
          <div className="col-lg-3 col-md-6">
            <Heading level={5} className="text-uppercase fw-bold fs-6 mb-3 text-white">Ciudades de Despacho</Heading>
            <ul className="list-unstyled text-muted small">
              <li>📍 Santiago</li>
              <li>📍 Puente Alto</li>
              <li>📍 Viña del Mar</li>
              <li>📍 Valparaíso</li>
              <li>📍 Concepción</li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="text-center text-muted small">
          <Text className="mb-0">© {currentYear} HuertoHogar. Todos los derechos reservados.</Text>
        </div>
      </div>
    </footer>
  );
};


