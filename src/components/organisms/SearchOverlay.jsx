// src/components/organisms/SearchOverlay.jsx
import { useState } from 'react';
import { PRODUCTOS } from '../../data/productos';
import { BLOGS } from '../../data/blogs';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';

export const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const productosEncontrados = q
    ? PRODUCTOS.filter((p) =>
        (p.nombre + ' ' + p.codigo + ' ' + p.categoria).toLowerCase().includes(q)
      )
    : [];

  const blogsEncontrados = q
    ? BLOGS.filter((b) => (b.titulo + ' ' + b.resumen).toLowerCase().includes(q))
    : [];

  const secciones = [
    { nombre: 'Inicio', ruta: '#/inicio' },
    { nombre: 'Productos y Catálogo', ruta: '#/inicio' },
    { nombre: 'Nosotros', ruta: '#/nosotros' },
    { nombre: 'Blogs', ruta: '#/blogs' },
    { nombre: 'Contacto', ruta: '#/contacto' }
  ].filter((s) => s.nombre.toLowerCase().includes(q));

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} style={{ zIndex: 1040 }}></div>

      <div
        className="modal d-block"
        tabIndex="-1"
        style={{ zIndex: 1050 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content shadow-lg border-0 rounded-4 overflow-hidden">
            <div className="modal-header border-bottom p-3 bg-white d-flex align-items-center gap-2">
              <span className="fs-5">🔍</span>
              <div className="flex-grow-1">
                <Input
                  type="search"
                  name="busquedaGlobal"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Busca productos, blogs o secciones..."
                  className="border-0 shadow-none fs-5"
                />
              </div>
              <Button variant="light" className="btn-close" onClick={onClose} aria-label="Cerrar"></Button>
            </div>

            <div className="modal-body overflow-auto p-4" style={{ maxHeight: '60vh' }}>
              {!q ? (
                <p className="text-muted text-center py-4 mb-0">
                  Escribe para buscar productos, artículos de blogs y secciones de la tienda.
                </p>
              ) : (
                <>
                  {/* Productos */}
                  {productosEncontrados.length > 0 && (
                    <div className="mb-4">
                      <h6 className="text-uppercase fw-bold text-muted small mb-2">Productos</h6>
                      <div className="list-group list-group-flush">
                        {productosEncontrados.map((p) => (
                          <a
                            key={p.codigo}
                            href={`#/producto/${p.codigo}`}
                            onClick={onClose}
                            className="list-group-item list-group-item-action d-flex align-items-center justify-content-between p-2 rounded mb-1"
                          >
                            <div className="d-flex align-items-center gap-2">
                              <span className="fs-4">{p.emoji}</span>
                              <div>
                                <strong className="d-block text-dark small">{p.nombre}</strong>
                                <small className="text-muted extra-small">{p.codigo}</small>
                              </div>
                            </div>
                            <span className="fw-bold text-success">${p.precio.toLocaleString('es-CL')}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Blogs */}
                  {blogsEncontrados.length > 0 && (
                    <div className="mb-4">
                      <h6 className="text-uppercase fw-bold text-muted small mb-2">Blogs</h6>
                      <div className="list-group list-group-flush">
                        {blogsEncontrados.map((b) => (
                          <a
                            key={b.id}
                            href={`#/blog/${b.id}`}
                            onClick={onClose}
                            className="list-group-item list-group-item-action d-flex align-items-center gap-2 p-2 rounded mb-1"
                          >
                            <span className="fs-4">{b.emoji}</span>
                            <div>
                              <strong className="d-block text-dark small">{b.titulo}</strong>
                              <small className="text-muted extra-small">{b.categoria}</small>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Secciones */}
                  {secciones.length > 0 && (
                    <div>
                      <h6 className="text-uppercase fw-bold text-muted small mb-2">Secciones</h6>
                      <div className="list-group list-group-flush">
                        {secciones.map((s, idx) => (
                          <a
                            key={idx}
                            href={s.ruta}
                            onClick={onClose}
                            className="list-group-item list-group-item-action d-flex align-items-center gap-2 p-2 rounded mb-1"
                          >
                            <span className="fs-5">🧭</span>
                            <strong className="text-dark small">{s.nombre}</strong>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {productosEncontrados.length === 0 &&
                    blogsEncontrados.length === 0 &&
                    secciones.length === 0 && (
                      <p className="text-muted text-center py-4 mb-0">
                        No encontramos resultados para "<strong>{query}</strong>".
                      </p>
                    )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};