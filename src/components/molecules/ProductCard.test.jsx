

//Probando que la tarjeta de producto muestre la informacion correcta y responda al boton añadir

// src/components/molecules/ProductCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProductCard } from './ProductCard';

describe('<ProductCard />', () => {
  const productoMock = {
    codigo: 'FR001',
    nombre: 'Manzanas Fuji',
    precio: 1200,
    stock: 50,
    unidad: 'kilo',
    categoria: 'frutas',
    emoji: '🍎'
  };

  it('renderiza la información del producto correctamente', () => {
    render(<ProductCard producto={productoMock} stocks={{ FR001: 50 }} />);

    expect(screen.getByText('Manzanas Fuji')).toBeInTheDocument();
    expect(screen.getByText('FR001')).toBeInTheDocument();
    expect(screen.getByText('$1.200')).toBeInTheDocument();
    expect(screen.getByText('50 en stock')).toBeInTheDocument();
  });

  it('llama a la función onAddToCart al presionar el botón añadir', () => {
    const handleAddToCart = vi.fn();

    render(
      <ProductCard
        producto={productoMock}
        stocks={{ FR001: 50 }}
        onAddToCart={handleAddToCart}
      />
    );

    const botonAñadir = screen.getByRole('button', { name: /añadir/i });
    fireEvent.click(botonAñadir);

    expect(handleAddToCart).toHaveBeenCalledTimes(1);
  });

  it('deshabilita el botón cuando no hay stock disponible', () => {
    render(<ProductCard producto={productoMock} stocks={{ FR001: 0 }} />);

    const botonAñadir = screen.getByRole('button', { name: /Agotado/i });
    expect(botonAñadir).toBeDisabled();
    expect(screen.getByText('Sin stock')).toBeInTheDocument();
  });
});