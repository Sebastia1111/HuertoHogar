import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PedidosPage } from './PedidosPage';

const pedido = {
  numero: 'HH-1001',
  fecha: '2026-11-19T18:00:00',
  estado: 'PENDIENTE',
  items: [{ codigo: 'FR003', nombre: 'Plátanos Cavendish', cantidad: 5, precioUnitario: 800, precioFinal: 640, subtotal: 3200 }],
  subtotal: 4000,
  descuento: 800,
  neto: 2689,
  iva: 511,
  total: 3200,
  fechaEntregaPreferida: '2026-11-21',
  historial: [{ estado: 'PENDIENTE', fecha: '2026-11-19T18:00:00', comentario: 'Pedido recibido' }]
};

vi.mock('../services/tiendaApi', () => ({
  obtenerPedidos: vi.fn(() => Promise.resolve([pedido])),
  cancelarPedido: vi.fn()
}));

describe('<PedidosPage />', () => {
  it('pide iniciar sesión si no hay sesión', () => {
    render(<PedidosPage sesion={null} />);
    expect(screen.getByText('Acceso Restringido')).toBeInTheDocument();
  });

  it('muestra la boleta con descuento y permite cancelar un pedido pendiente', async () => {
    render(<PedidosPage sesion={{ rol: 'CLIENTE', correo: 'ana@duocuc.cl' }} />);

    const cabecera = await screen.findByText('Boleta HH-1001');
    fireEvent.click(cabecera);

    expect(screen.getByText('Descuento Duoc (20%)')).toBeInTheDocument();
    expect(screen.getByText('21-11-2026')).toBeInTheDocument();
    expect(screen.getByText('Cancelar pedido')).toBeInTheDocument();
  });
});
