// src/App.jsx
import { useCallback, useState, useEffect } from 'react';
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
import { PedidosPage } from './pages/PedidosPage';
import { PerfilPage } from './pages/PerfilPage';

import { useInventario } from './hooks/useInventario';
import { useAuth } from './hooks/useAuth';
import { leerStorage, guardarStorage } from './utils/storage';

export function App() {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/inicio');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const { sesion, verificandoSesion, iniciarSesion, registrar, cerrarSesion, actualizarUsuario } = useAuth();
  const [cartItems, setCartItems] = useState(() => leerStorage('hh_carrito', []));

  // Elimina las credenciales locales en texto plano de versiones anteriores.
  useEffect(() => {
    localStorage.removeItem('hh_usuarios');
    localStorage.removeItem('hh_sesion');
  }, []);




  // Estado global de stock dinámico
  const {
    productos,
    stocks,
    modoApi,
    cargando: cargandoInventario,
    errorApi,
    recargar: recargarInventario,
    actualizarStock,
    descontarStock
  } = useInventario();

  const mostrarAviso = useCallback((msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2800);
  }, []);

  useEffect(() => {
    const alExpirarSesion = () => {
      mostrarAviso('Tu sesión expiró. Inicia sesión nuevamente.');
    };
    window.addEventListener('hh:sesion-expirada', alExpirarSesion);
    return () => window.removeEventListener('hh:sesion-expirada', alExpirarSesion);
  }, [mostrarAviso]);

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

  const handleUpdateStock = async (codigo, nuevoStock) => {
    try {
      await actualizarStock(codigo, nuevoStock, 'Ajuste desde panel administrador');
      mostrarAviso(`Stock de ${codigo} actualizado`);
      return true;
    } catch (error) {
      mostrarAviso(error.message || 'No se pudo guardar el stock en la API');
      return false;
    }
  };

  const handleFinalizarCompraStock = async (itemsComprados, referencia, opciones) =>
    descontarStock(
      itemsComprados.map((item) => ({ codigo: item.codigo, cantidad: item.cantidad })),
      referencia,
      opciones
    );

  const handleAddToCart = (producto, cantidad = 1) => {
    const stockDisp = stocks[producto.codigo] !== undefined ? stocks[producto.codigo] : producto.stock;
    if (stockDisp <= 0) {
      mostrarAviso('Producto sin stock disponible');
      return;
    }

    const cantidadEnCarrito = cartItems.find((item) => item.codigo === producto.codigo)?.cantidad ?? 0;
    if (cantidadEnCarrito + cantidad > stockDisp) {
      mostrarAviso(`Solo hay ${stockDisp} unidades disponibles de ${producto.nombre}`);
      return;
    }

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
    const stockDisponible = stocks[codigo] ?? 0;
    if (nuevaCantidad > stockDisponible) {
      mostrarAviso(`Solo hay ${stockDisponible} unidades disponibles de este producto`);
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

  const handleCerrarSesion = async () => {
    await cerrarSesion();
    mostrarAviso('Sesión cerrada');
  };

  const renderPage = () => {
    if (currentPath.startsWith('#/producto/')) {
      const codigo = currentPath.split('/')[2];
      return (
        <ProductDetailPage
          codigo={codigo}
          sesion={sesion}
          productos={productos}
          stocks={stocks}
          onAddToCart={handleAddToCart}
        />
      );
    }

    if (currentPath.startsWith('#/blog/')) {
      const id = currentPath.split('/')[2];
      return <BlogDetailPage id={id} />;
    }

    switch (currentPath) {
      case '#/nosotros':
        return <AboutPage />;
      case '#/blogs':
        return <BlogsPage />;
      case '#/contacto':
        return <ContactPage onContactSuccess={() => mostrarAviso('¡Mensaje enviado con éxito!')} />;
      case '#/ingreso':
        return (
          <LoginPage
            onLogin={iniciarSesion}
            onLoginSuccess={(user) => {
              mostrarAviso(`Sesión iniciada, ¡hola ${user.nombre || user.correo}!`);
              window.location.hash = '#/inicio';
            }}
          />
        );
      case '#/registro':
        return (
          <RegisterPage
            onRegister={registrar}
            onRegisterSuccess={(user) => {
              mostrarAviso(`Cuenta creada, ¡bienvenido ${user.nombre}!`);
              window.location.hash = '#/inicio';
            }}
          />
        );
      case '#/admin':
        return (
          <AdminPage
            sesion={sesion}
            verificandoSesion={verificandoSesion}
            productos={productos}
            stocks={stocks}
            onUpdateStock={handleUpdateStock}
            modoApi={modoApi}
            cargando={cargandoInventario}
            errorApi={errorApi}
            onReintentar={recargarInventario}
            onMostrarAviso={mostrarAviso}
          />
        );
      case '#/pedidos':
        return (
          <PedidosPage
            sesion={sesion}
            verificandoSesion={verificandoSesion}
            onMostrarAviso={mostrarAviso}
            onPedidoCancelado={recargarInventario}
          />
        );
      case '#/perfil':
        return (
          <PerfilPage
            sesion={sesion}
            verificandoSesion={verificandoSesion}
            onMostrarAviso={mostrarAviso}
            onPerfilActualizado={actualizarUsuario}
            onSesionCerrada={handleCerrarSesion}
          />
        );
      case '#/inicio':
      default:
        return (
          <HomePage
            onAddToCart={handleAddToCart}
            sesion={sesion}
            stocks={stocks}
            productos={productos}
          />
        );
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

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        sesion={sesion}
        onCerrarSesion={handleCerrarSesion}
      />

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        productos={productos}
      />

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
        onFinalizarCompra={handleFinalizarCompraStock}
        modoApi={modoApi}
      />

      <main className="flex-grow-1">{renderPage()}</main>
      <Footer />
      <Toast mensaje={toastMsg} />
    </div>
  );


  


}

export default App;