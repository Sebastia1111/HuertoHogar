// src/components/organisms/InfoSection.jsx
import { useState } from 'react';
import { INFO_SECCIONES } from '../../data/productos';
import { Heading, Text } from '../atoms/Typography';

export const InfoSection = () => {
  const [selectedId, setSelectedId] = useState(INFO_SECCIONES[0].id);
  const infoActiva = INFO_SECCIONES.find((s) => s.id === selectedId);

  return (
    <section className="my-5">
      <Heading level={2} className="fw-bold text-success mb-1">Descubre HuertoHogar</Heading>
      <Text className="text-muted small mb-3">Haz clic en una tarjeta para ver el detalle.</Text>

      <div className="d-flex gap-3 overflow-auto pb-3">
        {INFO_SECCIONES.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setSelectedId(sec.id)}
            className={`btn border text-start p-3 rounded-3 shadow-sm flex-shrink-0 ${
              selectedId === sec.id ? 'btn-success text-white' : 'btn-white bg-white'
            }`}
            style={{ width: '200px' }}
          >
            <div className="fs-3 mb-1">{sec.icono}</div>
            <Heading level={6} className="fw-bold mb-1 fs-6">{sec.titulo}</Heading>
            <Text className={`extra-small mb-0 ${selectedId === sec.id ? 'text-white-50' : 'text-muted'}`}>
              {sec.bajada}
            </Text>
          </button>
        ))}
      </div>

      {infoActiva && (
        <div className="p-4 bg-white border-start border-success border-4 rounded shadow-sm mt-3">
          <Heading level={4} className="fs-5 fw-bold text-success mb-2">
            {infoActiva.icono} {infoActiva.titulo}
          </Heading>
          <Text className="text-muted mb-0">{infoActiva.detalle}</Text>
        </div>
      )}
    </section>
  );
};