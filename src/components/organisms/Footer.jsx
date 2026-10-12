import { Heading, Text } from '../atoms/Typography';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row g-4">
          
          <div className="col-lg-4 col-md-6">
            <a href="#/inicio" className="text-success text-decoration-none fw-bold fs-4 d-flex align-items-center mb-3">
              <span className="me-2">🌱</span>
              <span className="text-white">Huerto<b className="text-success">Hogar</b></span>
            </a>
            <Text className="text-white-50 small">
              Conecta con la naturaleza y lleva lo mejor del campo a tu mesa. Productos frescos y saludables, directo a tu hogar.
            </Text>
          </div>

          <div className="col-lg-2 col-md-6">
            <Heading level={5} className="text-uppercase fw-bold fs-6 mb-3 text-white">Navegación</Heading>
            <ul className="list-unstyled small">
              <li className="mb-2"><a href="#/inicio" className="text-white-50 text-decoration-none">Inicio</a></li>
              <li className="mb-2"><a href="#/inicio" className="text-white-50 text-decoration-none">Productos</a></li>
              <li className="mb-2"><a href="#/nosotros" className="text-white-50 text-decoration-none">Nosotros</a></li>
              <li className="mb-2"><a href="#/blogs" className="text-white-50 text-decoration-none">Blogs</a></li>
              <li className="mb-2"><a href="#/contacto" className="text-white-50 text-decoration-none">Contacto</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <Heading level={5} className="text-uppercase fw-bold fs-6 mb-3 text-white">Contacto</Heading>
            <ul className="list-unstyled text-white-50 small">
              <li className="mb-2">📧 contacto@huertohogar.cl</li>
              <li className="mb-2">📞 +56 9 1234 5678</li>
              <li className="mb-2">🕐 Lunes a sábado, 9:00 a 19:00</li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <Heading level={5} className="text-uppercase fw-bold fs-6 mb-3 text-white">Ciudades de Despacho</Heading>
            <ul className="list-unstyled text-white-50 small">
              <li className="mb-1">📍 Santiago</li>
              <li className="mb-1">📍 Puente Alto</li>
              <li className="mb-1">📍 Viña del Mar</li>
              <li className="mb-1">📍 Valparaíso</li>
              <li className="mb-1">📍 Concepción</li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="text-center text-white-50 small">
          <Text className="mb-0">© {currentYear} HuertoHogar. Todos los derechos reservados.</Text>
        </div>
      </div>
    </footer>
  );
};

