// src/pages/AboutPage.jsx
import { Heading, Text } from '../components/atoms/Typography';

const CATEGORIAS = [
  { id: 'frutas', nombre: 'Frutas frescas', emoji: '🍓', descripcion: 'De la cosecha directa a tu hogar: frutas de temporada cultivadas en su punto óptimo de madurez.' },
  { id: 'verduras', nombre: 'Verduras orgánicas', emoji: '🥬', descripcion: 'Cultivadas sin pesticidas ni químicos, seleccionadas por su calidad y valor nutricional.' },
  { id: 'organicos', nombre: 'Productos orgánicos', emoji: '🍯', descripcion: 'Miel, granos y semillas elaborados de manera responsable para un estilo de vida saludable.' },
  { id: 'lacteos', nombre: 'Productos lácteos', emoji: '🥛', descripcion: 'Leches y yogures de granjas locales que producen de forma responsable.' }
];

export const AboutPage = () => {
  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <Heading level={1} className="fw-bold text-success">Nosotros</Heading>
        <Text className="text-muted fs-5">La historia detrás de cada despacho.</Text>
      </div>

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
      <Heading level={2} className="fs-4 fw-bold text-success mb-3 text-center">Zonas de despacho</Heading>
      <div className="p-4 border rounded-4 bg-white shadow-sm text-center mb-5">
        <div className="mapa-contenedor mb-3">
          <img src="assets/img/mapa-chile.png" alt="Mapa de Chile con despacho" className="img-fluid" />
          <span className="marcador izq m-vina"><i></i><b>Viña del Mar</b></span>
          <span className="marcador izq m-valpo"><i></i><b>Valparaíso</b></span>
          <span className="marcador m-santiago"><i></i><b>Santiago</b></span>
          <span className="marcador m-puente"><i></i><b>Puente Alto</b></span>
          <span className="marcador izq m-conce"><i></i><b>Concepción</b></span>
        </div>
        <Text className="text-muted small mb-0">
          Hacemos envíos a estas 5 ciudades, directo del campo a tu hogar.
        </Text>
      </div>

      {/* Equipo */}
      <Heading level={2} className="fs-4 fw-bold text-success mb-3 text-center">Equipo de desarrollo</Heading>
      <ul className="list-group shadow-sm mx-auto" style={{ maxWidth: '500px' }}>
        <li className="list-group-item"><strong>Sebastián Orellana</strong> — Desarrollo Frontend</li>
        <li className="list-group-item"><strong>Joaquín Correa</strong> — Diseño y Estilos</li>
        <li className="list-group-item"><strong>Esteban Medina</strong> — Lógica y Validaciones</li>
      </ul>
    </div>
  );
};