// src/App.jsx
import { useState, useEffect } from 'react';
import { Header } from './components/organisms/Header';
import { Footer } from './components/organisms/Footer';
import { MobileMenu } from './components/organisms/MobileMenu';
import { CartDrawer } from './components/organisms/CartDrawer';
import { SearchOverlay } from './components/organisms/SearchOverlay';
import { Toast } from './components/atoms/Toast';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AdminPage } from './pages/AdminPage';
import { BlogsPage } from './pages/BlogsPage';
import { BlogDetailPage } from './pages/BlogDetailPage';

import { leerStorage, guardarStorage } from './utils/storage';

export function App() {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/inicio');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const [sesion, setSesion] = useState(() => leerStorage('hh_sesion', null));
  const [cartItems, setCartItems] = useState(() => leerStorage('hh_carrito', []));

  const mostrarAviso = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2800);
  };

  useEffect(() => {
    guardarStorage('hh_carrito', cartItems);
  }, [cartItems]);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#/inicio');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleAddToCart = (producto, cantidad = 1) => {
    setCartItems((prev) => {
      const existe = prev.find((item) => item.codigo === producto.codigo);
      if (existe) {
        return prev.map((item) =>
          item.codigo === producto.codigo ? { ...item, cantidad: item.cantidad + cantidad } : item
        );
      }
      return [...prev, { ...producto, cantidad }];
    });
    mostrarAviso(`${producto.nombre} se añadió al carrito 🧺`);
  };

  const handleUpdateQuantity = (codigo, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      handleRemoveItem(codigo);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.codigo === codigo ? { ...i, cantidad: nuevaCantidad } : i))
    );
  };

  const handleRemoveItem = (codigo) => {
    setCartItems((prev) => prev.filter((i) => i.codigo !== codigo));
    mostrarAviso('Producto quitado del carrito');
  };

  const handleCerrarSesion = () => {
    setSesion(null);
    localStorage.removeItem('hh_sesion');
    mostrarAviso('Sesión cerrada');
  };

  const renderPage = () => {
    if (currentPath.startsWith('#/producto/')) {
      const codigo = currentPath.split('/')[2];
      return <ProductDetailPage codigo={codigo} sesion={sesion} onAddToCart={handleAddToCart} />;
    }

    if (currentPath.startsWith('#/blog/')) {
      const id = currentPath.split('/')[2];
      return <BlogDetailPage id={id} />;
    }

    switch (currentPath) {
      case '#/nosotros': return <AboutPage />;
      case '#/blogs': return <BlogsPage />;
      case '#/contacto': return <ContactPage onContactSuccess={() => mostrarAviso('¡Mensaje enviado con éxito!')} />;
      case '#/ingreso':
        return (
          <LoginPage
            onLoginSuccess={(user) => {
              setSesion(user);
              guardarStorage('hh_sesion', user);
              mostrarAviso(`Sesión iniciada, ¡hola ${user.nombre}!`);
              window.location.hash = '#/inicio';
            }}
          />
        );
      case '#/registro':
        return (
          <RegisterPage
            onRegisterSuccess={(user) => {
              setSesion(user);
              guardarStorage('hh_sesion', user);
              mostrarAviso(`Cuenta creada, ¡bienvenido ${user.nombre}!`);
              window.location.hash = '#/inicio';
            }}
          />
        );
      case '#/admin': return <AdminPage sesion={sesion} />;
      case '#/inicio':
      default: return <HomePage onAddToCart={handleAddToCart} sesion={sesion} />;
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        cartCount={cartItems.reduce((a, b) => a + b.cantidad, 0)}
        sesion={sesion}
        onCerrarSesion={handleCerrarSesion}
      />

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={() => {
          setCartItems([]);
          mostrarAviso('Carrito vaciado');
        }}
        sesion={sesion}
        onMostrarAviso={mostrarAviso}
      />

      <main className="flex-grow-1">{renderPage()}</main>
      <Footer />
      <Toast mensaje={toastMsg} />
    </div>
  );
}

export default App;