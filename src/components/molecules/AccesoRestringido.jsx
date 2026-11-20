// src/components/molecules/AccesoRestringido.jsx
// Aviso reutilizable cuando una vista requiere sesión o un rol específico.
import { Button } from '../atoms/Button';
import { Heading, Text } from '../atoms/Typography';

export const AccesoRestringido = ({ tipo = 'login', mensaje }) => {
  if (tipo === 'verificando') {
    return (
      <div className="container my-5 text-center py-5">
        <div className="spinner-border text-success" role="status"></div>
        <Text className="text-muted mt-3">Verificando tu sesión…</Text>
      </div>
    );
  }

  if (tipo === 'permisos') {
    return (
      <div className="container my-5 text-center py-5 bg-white border rounded">
        <span className="display-4">⛔</span>
        <Heading level={3} className="mt-3 text-muted">No tienes permisos</Heading>
        <Text className="text-muted">{mensaje || 'Esta sección no está disponible para tu tipo de cuenta.'}</Text>
        <a href="#/inicio"><Button variant="outline-success" className="mt-3">Volver a la tienda</Button></a>
      </div>
    );
  }

  return (
    <div className="container my-5 text-center py-5 bg-white border rounded">
      <span className="display-4">🔒</span>
      <Heading level={3} className="mt-3 text-muted">Acceso Restringido</Heading>
      <Text className="text-muted">{mensaje || 'Inicia sesión para continuar.'}</Text>
      <a href="#/ingreso"><Button variant="success" className="mt-3">Iniciar Sesión</Button></a>
    </div>
  );
};
