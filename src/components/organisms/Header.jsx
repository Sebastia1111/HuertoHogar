import { useState } from 'react';

export const Header = ({ onOpenMenu, onOpenCart, onOpenSearch, cartCount, sesion, onCerrarSesion }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleUserClick = () => {
    if (sesion) {
      setShowUserMenu(!showUserMenu);
    } else {
      window.location.hash = '#/ingreso';
    }
  };

  const handlerLogoCLick = (e) =>{
    if(window.location.hash == '#/inicio' || window.location.hash == ''){
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth'});

    } else {
      window.location.hash = "#/inicio";
      window.scrollTo({ top: 0, behavior: 'smooth'});
    }

  }



  return (
    <header className="sticky-top bg-white border-bottom py-2 px-3 shadow-sm" style={{ zIndex: 1030 }}>
      <div className="container-fluid d-flex align-items-center justify-content-between position-relative">
        <button
          className="btn btn-light rounded-3 p-2"
          onClick={onOpenMenu}
          aria-label="Abrir menú"
        >
          ☰
        </button>




        {/* Logo perfectamente centrado independientemente de los botones laterales */}
        <a href="#/inicio" onClick={handlerLogoCLick} className="text-decoration-none d-flex align-items-center gap-2 position-absolute start-50 translate-middle-x">
          <span className="fs-4">🌱</span>
          <span className="fs-5 fw-bold text-dark">
            Huerto<b className="text-success">Hogar</b>
          </span>
        </a>

        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-light rounded-3 p-2" onClick={onOpenSearch} title="Buscar">
            🔍
          </button>

          <button className="btn btn-light rounded-3 p-2 position-relative" onClick={onOpenCart} title="Carrito">
            🧺
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                {cartCount}
              </span>
            )}
          </button>

          <button className="btn btn-light rounded-3 p-2" onClick={handleUserClick} title="Cuenta">
            👤
          </button>

          {showUserMenu && sesion && (
            <div className="menu-usuario-popup">
              <p className="fw-bold m-0 text-dark">Hola, {sesion.nombre}</p>
              <small className="text-muted d-block mb-2">{sesion.tipo}</small>

              {sesion.tipo === 'Administrador' && (
                <a
                  href="#/admin"
                  className="btn btn-outline-success btn-sm w-100 mb-2 fw-bold"
                  onClick={() => setShowUserMenu(false)}
                >
                  📦 Gestionar stock
                </a>
              )}

              <button
                className="btn btn-outline-danger btn-sm w-100 fw-bold"
                onClick={() => {
                  setShowUserMenu(false);
                  onCerrarSesion();
                }}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};