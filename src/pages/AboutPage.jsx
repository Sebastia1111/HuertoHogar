// src/pages/AboutPage.jsx
import { Heading, Text } from '../components/atoms/Typography';

export const AboutPage = () => {
  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <Heading level={1} className="fw-bold text-success">Nosotros</Heading>
        <Text className="text-muted fs-5">La historia detrás de cada despacho.</Text>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="p-4 border rounded bg-white h-100 shadow-sm">
            <Heading level={3} className="fs-5 fw-bold text-success mb-2">Nuestra historia</Heading>
            <Text className="text-muted small mb-0">
              HuertoHogar nació hace más de 6 años con una idea simple: acercar el campo a las ciudades. Partimos despachando cajas de verduras dentro de Santiago y hoy llegamos a hogares de Santiago, Puente Alto, Viña del Mar, Valparaíso y Concepción.
            </Text>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-4 border rounded bg-white h-100 shadow-sm">
            <Heading level={3} className="fs-5 fw-bold text-success mb-2">Misión</Heading>
            <Text className="text-muted small mb-0">
              Brindar un servicio que conecte a las familias con productos frescos y saludables, apoyando a los productores locales y promoviendo una alimentación consciente y sostenible.
            </Text>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-4 border rounded bg-white h-100 shadow-sm">
            <Heading level={3} className="fs-5 fw-bold text-success mb-2">Visión</Heading>
            <Text className="text-muted small mb-0">
              Ser la tienda online líder en distribución de productos frescos del país, reconocida por la calidad de lo que vendemos y por acortar la distancia entre el campo y la ciudad.
            </Text>
          </div>
        </div>
      </div>

      <div className="bg-light p-4 rounded-3 text-center my-5">
        <Heading level={2} className="fs-4 fw-bold text-success mb-3">Zonas de Despacho</Heading>
        <Text className="text-muted mb-4">Hacemos envíos directo del campo a tu hogar en las siguientes ciudades:</Text>
        <div className="d-flex flex-wrap justify-content-center gap-3">
          {['📍 Santiago', '📍 Puente Alto', '📍 Viña del Mar', '📍 Valparaíso', '📍 Concepción'].map((ciudad, idx) => (
            <span key={idx} className="badge bg-white text-dark border p-2 fs-6 shadow-sm">{ciudad}</span>
          ))}
        </div>
      </div>

      <div className="my-5">
        <Heading level={2} className="fs-4 fw-bold text-success mb-3 text-center">Equipo de Desarrollo</Heading>
        <ul className="list-group max-w-md mx-auto shadow-sm" style={{ maxWidth: '500px' }}>
          <li className="list-group-item"><strong>Sebastián Orellana</strong> — Desarrollo Frontend</li>
          <li className="list-group-item"><strong>Joaquín Correa</strong> — Diseño y Estilos</li>
          <li className="list-group-item"><strong>Esteban Medina</strong> — Lógica y Validaciones</li>
        </ul>
      </div>
    </div>
  );
};