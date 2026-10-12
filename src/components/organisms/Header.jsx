// src/components/organisms/Header.jsx
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';

export const Header = ({ onOpenMenu, onOpenCart, onOpenSearch, cartCount = 0 }) => {
  return (
    <header className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top px-3 py-2">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        
        {/* Botón Menú Móvil usando el Átomo Button */}
        <div className="d-lg-none me-2">
          <Button variant="outline-success" onClick={onOpenMenu} aria-label="abrir menú">
            ☰
          </Button>
        </div>

        {/* Logo de HuertoHogar */}
        <a href="#/inicio" className="navbar-brand d-flex align-items-center text-success fw-bold fs-4">
          <svg className="me-2" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 22V10"/>
            <path d="M12 12C12 7 8 4 3 4c0 5 4 8 9 8z"/>
            <path d="M12 10c0-4 3-6 9-6 0 4-3 6-9 6z"/>
          </svg>
          <span>Huerto<b>Hogar</b></span>
        </a>

        {/* Acciones utilizando Átomos Button y Badge */}
        <div className="d-flex align-items-center gap-2">
          
          {/* Átomo Button para Buscar */}
          <Button variant="light" className="rounded-circle p-2" onClick={onOpenSearch} aria-label="búsqueda general">
            🔍
          </Button>

          {/* Átomo Button para Carrito + Átomo Badge para Contador */}
          <div className="position-relative">
            <Button variant="light" className="rounded-circle p-2" onClick={onOpenCart} aria-label="carrito de compras">
              🛒
            </Button>
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle">
                <Badge variant="danger">{cartCount}</Badge>
              </span>
            )}
          </div>

          {/* Átomo Button para Cuenta */}
          <a href="#/ingreso">
            <Button variant="outline-success" className="rounded-circle p-2" aria-label="cuenta">
              👤
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
};