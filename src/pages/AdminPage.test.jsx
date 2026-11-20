import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AdminPage } from './AdminPage';

vi.mock('../services/tiendaApi', () => ({
  listarTodosPedidos: vi.fn().mockResolvedValue([]),
  cambiarEstadoPedido: vi.fn()
}));
vi.mock('../services/usuariosApi', () => ({
  listarUsuarios: vi.fn().mockResolvedValue([]),
  actualizarUsuario: vi.fn()
}));

const productos = [{ codigo: 'FR001', nombre: 'Manzanas Fuji', stock: 10, stockMinimo: 5, emoji: '🍎' }];

describe('<AdminPage /> restricciones por rol', () => {
  it('pide iniciar sesión si no hay sesión', () => {
    render(<AdminPage sesion={null} productos={productos} stocks={{}} />);
    expect(screen.getByText('Acceso Restringido')).toBeInTheDocument();
  });

  it('un CLIENTE ve "No tienes permisos"', () => {
    render(<AdminPage sesion={{ rol: 'CLIENTE', tipo: 'Cliente' }} productos={productos} stocks={{}} />);
    expect(screen.getByText('No tienes permisos')).toBeInTheDocument();
    expect(screen.queryByText('Gestión de Stock')).not.toBeInTheDocument();
  });

  it('un VENDEDOR gestiona stock y pedidos, pero no usuarios', () => {
    render(<AdminPage sesion={{ rol: 'VENDEDOR', tipo: 'Vendedor', nombre: 'Vale' }} productos={productos} stocks={{}} />);
    expect(screen.getByText('Gestión de Stock')).toBeInTheDocument();
    expect(screen.getByText('🧾 Pedidos')).toBeInTheDocument();
    expect(screen.queryByText('👥 Usuarios')).not.toBeInTheDocument();
  });

  it('un ADMIN además ve la pestaña de usuarios', () => {
    render(<AdminPage sesion={{ rol: 'ADMIN', tipo: 'Administrador', nombre: 'Admin' }} productos={productos} stocks={{}} />);
    expect(screen.getByText('👥 Usuarios')).toBeInTheDocument();
  });
});
