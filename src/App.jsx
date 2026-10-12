import './styles/style.css'
// src/App.jsx
import { useState, useEffect } from 'react';
import { Header } from './components/organisms/Header';
import { Footer } from './components/organisms/Footer';
import { MobileMenu } from './components/organisms/MobileMenu';
import { CartDrawer } from './components/organisms/CartDrawer';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

export function App() {
  // Estado de la ruta actual basado en hash (#/inicio, #/nosotros, etc.)
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/inicio');

  // Estados de modales/drawers
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Estado del Carrito de compras
  const [cartItems, setCartItems] = useState([]);

  // Escuchar cambios de ruta en la URL (#)
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#/inicio');
      window.scrollTo(0, 0); // Volver arriba al cambiar de página
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Lógica del Carrito
  const handleAddToCart = (producto) => {
    setCartItems((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
    setIsCartOpen(true); // Abre el carrito al agregar
  };

  const handleRemoveFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, cantidad: nuevaCantidad } : item))
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.cantidad, 0);

  // Renderizado dinámico de la página activa
  const renderPage = () => {
    switch (currentPath) {
      case '#/nosotros':
        return <AboutPage />;
      case '#/contacto':
        return <ContactPage />;
      case '#/ingreso':
        return <LoginPage />;
      case '#/registro':
        return <RegisterPage />;
      case '#/inicio':
      default:
        return <HomePage onAddToCart={handleAddToCart} />;
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Cabecera Principal */}
      <Header
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => alert('Usa el panel de búsqueda especial en el catálogo')}
        cartCount={totalCartCount}
      />

      {/* Menú Móvil Desplegable */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Carrito Lateral Desplegable */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
      />

      {/* Contenido Dinámico de las Páginas */}
      <main className="flex-grow-1">{renderPage()}</main>

      {/* Pie de Página */}
      <Footer />
    </div>
  );
};

export default App;
