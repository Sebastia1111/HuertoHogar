// src/pages/AboutPage.jsx
import { Heading, Text } from '../components/atoms/Typography';
import mapaChile from '../assets/img/mapa-chile.png';

const CATEGORIAS = [
  { id: 'frutas', nombre: 'Frutas frescas', emoji: '🍓', descripcion: 'De la cosecha directa a tu hogar: frutas de temporada cultivadas en su punto óptimo de madurez.' },
  { id: 'verduras', nombre: 'Verduras orgánicas', emoji: '🥬', descripcion: 'Cultivadas sin pesticidas ni químicos, seleccionadas por su calidad y valor nutricional.' },
  { id: 'organicos', nombre: 'Productos orgánicos', emoji: '🍯', descripcion: 'Miel, granos y semillas elaborados de manera responsable para un estilo de vida saludable.' },
  { id: 'lacteos', nombre: 'Productos lácteos', emoji: '🥛', descripcion: 'Leches y yogures de granjas locales que producen de forma responsable.' }
];

const CIUDADES = [
  { nombre: 'Santiago', region: 'Región Metropolitana', emoji: '📍' },
  { nombre: 'Puente Alto', region: 'Región Metropolitana', emoji: '📍' },
  { nombre: 'Viña del Mar', region: 'Región de Valparaíso', emoji: '📍' },
  { nombre: 'Valparaíso', region: 'Región de Valparaíso', emoji: '📍' },
  { nombre: 'Concepción', region: 'Región del Biobío', emoji: '📍' }
];

export const AboutPage = () => {
  return (
    <div className="container my-5">
      {/* Encabezado */}
      <div className="text-center mb-5">
        <Heading level={1} className="fw-bold text-success">Nosotros</Heading>
        <Text className="text-muted fs-5">La historia detrás de cada despacho.</Text>
      </div>

      {/* Tarjetas Historia, Misión y Visión */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="p-4 border rounded-4 bg-white h-100 shadow-sm">
            <Heading level={3} className="fs-5 fw-bold text-success mb-2">Nuestra historia</Heading>
            <Text className="text-muted small mb-0">
              HuertoHogar nació hace más de 6 años con una idea simple: acercar el campo a las ciudades. Partimos despachando cajas de verduras dentro de Santiago y hoy llegamos a hogares de Santiago, Puente Alto, Viña del Mar, Valparaíso y Concepción.
            </Text>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-4 border rounded-4 bg-white h-100 shadow-sm">
            <Heading level={3} className="fs-5 fw-bold text-success mb-2">Misión</Heading>
            <Text className="text-muted small mb-0">
              Brindar un servicio que conecte a las familias con productos frescos y saludables, apoyando a los productores locales y promoviendo una alimentación consciente y sostenible.
            </Text>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-4 border rounded-4 bg-white h-100 shadow-sm">
            <Heading level={3} className="fs-5 fw-bold text-success mb-2">Visión</Heading>
            <Text className="text-muted small mb-0">
              Ser la tienda online líder en distribución de productos frescos del país, reconocida por la calidad de lo que vendemos y por acortar la distancia entre el campo y la ciudad.
            </Text>
          </div>
        </div>
      </div>

      {/* Lo que vendemos (Categorías) */}
      <Heading level={2} className="fs-4 fw-bold text-success mb-3 text-center">Lo que vendemos</Heading>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 mb-5">
        {CATEGORIAS.map((cat) => (
          <div key={cat.id} className="col">
            <div className="p-3 border rounded-4 bg-white h-100 shadow-sm text-center">
              <div className={`display-4 p-3 rounded-4 mb-2 cat-${cat.id}`}>{cat.emoji}</div>
              <Heading level={4} className="fs-6 fw-bold mb-1">{cat.nombre}</Heading>
              <Text className="text-muted extra-small mb-0">{cat.descripcion}</Text>
            </div>
          </div>
        ))}
      </div>

      {/* Mapa de Despacho */}
    <Heading level={2} className="fs-4 fw-bold text-success mb-3 text-center">
      Zonas de despacho
    </Heading>

    <div className="p-4 border rounded-4 bg-white shadow-sm mb-5 text-center">
      <div className="mapa-wrapper mb-3">
        <div className="mapa-seccion">
          <img src={mapaChile} alt="Mapa de Chile" className="mapa-img" />

          {/* LADO IZQUIERDO: Texto a la izquierda, punto verde a la derecha */}
          <span className="marcador pos-vina">
            <b>Viña del Mar</b><i></i>
          </span>
          <span className="marcador pos-valpo">
            <b>Valparaíso</b><i></i>
          </span>
          <span className="marcador pos-conce">
            <b>Concepción</b><i></i>
          </span>

          {/* LADO DERECHO: Punto verde a la izquierda, texto a la derecha */}
          <span className="marcador pos-santiago">
            <i></i><b>Santiago</b>
          </span>
          <span className="marcador pos-puente">
            <i></i><b>Puente Alto</b>
          </span>
        </div>
      </div>

      <Text className="text-muted small mb-3">
        Hacemos envíos a estas 5 ciudades, directo del campo a tu hogar.
      </Text>

      {/* Resumen de Ciudades */}
      <div className="row row-cols-2 row-cols-md-5 g-2 text-center pt-3 border-top">
        {CIUDADES.map((c, i) => (
          <div key={i} className="col">
            <div className="p-2 rounded-3 bg-light border">
              <span className="fw-bold d-block text-dark small">{c.emoji} {c.nombre}</span>
              <small className="text-muted extra-small">{c.region}</small>
            </div>
          </div>
        ))}
      </div>
    </div>

      {/* Equipo de Desarrollo */}
      <Heading level={2} className="fs-4 fw-bold text-success mb-3 text-center">Equipo de desarrollo</Heading>
      <ul className="list-group shadow-sm mx-auto" style={{ maxWidth: '500px' }}>
        <li className="list-group-item"><strong>Sebastián Orellana</strong> — Desarrollo Frontend</li>
        <li className="list-group-item"><strong>Joaquín Correa</strong> — Diseño y Estilos</li>
        <li className="list-group-item"><strong>Esteban Medina</strong> — Lógica y Validaciones</li>
      </ul>
    </div>
  );
};