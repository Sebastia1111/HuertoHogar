// src/pages/ContactPage.jsx
import { ContactForm } from '../components/organisms/ContactForm';
import { Heading, Text } from '../components/atoms/Typography';

export const ContactPage = () => {
  return (
    <div className="container my-5">
      <div className="row g-5 align-items-center">
        <div className="col-md-5">
          <Heading level={1} className="fw-bold text-success mb-3">Contacto</Heading>
          <Text className="text-muted fs-5 mb-4">
            Cuéntanos qué necesitas y te respondemos a la brevedad.
          </Text>
          <ul className="list-unstyled fs-6 text-muted d-flex flex-column gap-3">
            <li>📧 <strong>Correo:</strong> contacto@huertohogar.cl</li>
            <li>📞 <strong>Teléfono:</strong> +56 9 1234 5678</li>
            <li>💬 <strong>WhatsApp:</strong> +56 9 1234 5678</li>
            <li>🕐 <strong>Horario:</strong> Lunes a sábado, 9:00 a 19:00</li>
          </ul>
        </div>
        <div className="col-md-7">
          <ContactForm />
        </div>
      </div>
    </div>
  );
};