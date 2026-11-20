// src/pages/AdminPage.jsx
// Panel de gestión con restricciones por rol:
//  - Stock y Pedidos: ADMIN y VENDEDOR
//  - Usuarios: solo ADMIN
// El backend valida los mismos permisos y responde 403 si alguien se los salta.
import { useState } from 'react';
import { Heading, Text } from '../components/atoms/Typography';
import { AccesoRestringido } from '../components/molecules/AccesoRestringido';
import { PanelPedidos } from '../components/organisms/PanelPedidos';
import { PanelStock } from '../components/organisms/PanelStock';
import { PanelUsuarios } from '../components/organisms/PanelUsuarios';
import { puedeGestionar, puedeGestionarUsuarios } from '../utils/permisos';

export const AdminPage = ({
  sesion,
  verificandoSesion = false,
  productos,
  stocks,
  onUpdateStock,
  modoApi = false,
  cargando = false,
  errorApi = '',
  onReintentar,
  onMostrarAviso
}) => {
  const [pestana, setPestana] = useState('stock');

  if (verificandoSesion) return <AccesoRestringido tipo="verificando" />;

  if (!sesion) {
    return (
      <AccesoRestringido mensaje="Inicia sesión con una cuenta administradora o de vendedor para gestionar la tienda." />
    );
  }

  if (!puedeGestionar(sesion)) {
    return (
      <AccesoRestringido
        tipo="permisos"
        mensaje="Esta sección es exclusiva para administradores y vendedores de HuertoHogar."
      />
    );
  }

  const pestanas = [
    { id: 'stock', texto: '📦 Stock' },
    { id: 'pedidos', texto: '🧾 Pedidos' },
    ...(puedeGestionarUsuarios(sesion) ? [{ id: 'usuarios', texto: '👥 Usuarios' }] : [])
  ];
  const activa = pestanas.some((p) => p.id === pestana) ? pestana : 'stock';

  return (
    <div className="container my-5">
      <Heading level={1} className="fw-bold text-success mb-1">Panel de gestión</Heading>
      <Text className="text-muted mb-3">Sesión: {sesion.nombre || sesion.correo} · {sesion.tipo}</Text>

      <ul className="nav nav-tabs mb-4">
        {pestanas.map((p) => (
          <li className="nav-item" key={p.id}>
            <button
              type="button"
              className={`nav-link ${activa === p.id ? 'active fw-bold' : 'text-success'}`}
              onClick={() => setPestana(p.id)}
            >
              {p.texto}
            </button>
          </li>
        ))}
      </ul>

      {activa === 'stock' && (
        <PanelStock
          productos={productos}
          stocks={stocks}
          onUpdateStock={onUpdateStock}
          modoApi={modoApi}
          cargando={cargando}
          errorApi={errorApi}
          onReintentar={onReintentar}
        />
      )}
      {activa === 'pedidos' && (
        <PanelPedidos sesion={sesion} onMostrarAviso={onMostrarAviso} onStockCambiado={onReintentar} />
      )}
      {activa === 'usuarios' && <PanelUsuarios sesion={sesion} onMostrarAviso={onMostrarAviso} />}
    </div>
  );
};
