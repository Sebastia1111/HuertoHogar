// src/pages/HomePage.jsx
import { useState } from 'react';
import { PRODUCTOS } from '../data/productos';
import { FilterPanel } from '../components/organisms/FilterPanel';
import { ProductGrid } from '../components/organisms/ProductGrid';
import { InfoSection } from '../components/organisms/InfoSection';
import { Heading, Text } from '../components/atoms/Typography';
import { Button } from '../components/atoms/Button';

export const HomePage = ({ onAddToCart, sesion, stocks }) => {
  const [texto, setTexto] = useState('');
  const [categoria, setCategoria] = useState('todas');
  const [orden, setOrden] = useState('relevancia');

  const listaProductos = PRODUCTOS || [];

  const productosFiltrados = listaProductos
    .filter((prod) => {
      const coincideTexto =
        (prod.nombre || '').toLowerCase().includes(texto.toLowerCase()) ||
        (prod.codigo || '').toLowerCase().includes(texto.toLowerCase());
      const coincideCat = categoria === 'todas' || prod.categoria === categoria;
      return coincideTexto && coincideCat;
    })
    .sort((a, b) => {
      if (orden === 'precio-asc') return a.precio - b.precio;
      if (orden === 'precio-desc') return b.precio - a.precio;
      if (orden === 'nombre') return a.nombre.localeCompare(b.nombre);
      return 0;
    });

  const handleLimpiarFiltros = () => {
    setTexto('');
    setCategoria('todas');
    setOrden('relevancia');
  };

  return (
    <div>
      <section className="bg-success-subtle py-5 px-3 rounded-3 mb-5 text-center text-md-start">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-7">
              <span className="badge bg-success mb-2 px-3 py-2 fs-6">🥑 Tienda online de productos frescos</span>
              <Heading level={1} className="display-4 fw-bold text-success mb-3">
                Del campo a tu mesa
              </Heading>
              <Text className="fs-5 text-muted mb-4">
                Frutas, verduras y productos orgánicos seleccionados en su punto justo de madurez.
              </Text>
              <div className="d-flex gap-2 justify-content-center justify-content-md-start">
                <a href="#catalogo">
                  <Button variant="success" className="fw-bold px-4 py-2">Ver catálogo</Button>
                </a>
                <a href="#/nosotros">
                  <Button variant="outline-success" className="fw-bold px-4 py-2">Conócenos</Button>
                </a>
              </div>
            </div>
            <div className="col-md-5 text-center mt-4 mt-md-0 display-1">
              🍎 🥕 🥦 🍯 🥛 🍊
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <InfoSection />
      </div>

      <section id="catalogo" className="container my-5">
        <div className="text-center mb-4">
          <Heading level={2} className="fw-bold text-success">Catálogo</Heading>
          <Text className="text-muted">Todo lo que está disponible hoy, directo del campo.</Text>
        </div>

        <div className="row g-4">
          <div className="col-lg-3">
            <FilterPanel
              texto={texto}
              categoria={categoria}
              orden={orden}
              onTextoChange={setTexto}
              onCategoriaChange={setCategoria}
              onOrdenChange={setOrden}
              onLimpiar={handleLimpiarFiltros}
              totalResultados={productosFiltrados.length}
            />
          </div>

          <div className="col-lg-9">
            <ProductGrid
              productos={productosFiltrados}
              sesion={sesion}
              stocks={stocks}
              onAddToCart={onAddToCart}
            />
          </div>
        </div>
      </section>
    </div>
  );
};