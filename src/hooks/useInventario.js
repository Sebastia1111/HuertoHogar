// src/hooks/useInventario.js
// Carga el catálogo desde el microservicio tienda y deja un respaldo local
// (src/data/productos.js) para que la página siga funcionando si el backend está apagado.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { PRODUCTOS } from '../data/productos';
import { leerStorage, guardarStorage } from '../utils/storage';
import { actualizarStock as actualizarStockApi } from '../services/inventarioApi';
import {
  finalizarCompra as finalizarCompraTienda,
  listarCatalogo
} from '../services/tiendaApi';
import { aProductoFrontend, stocksDesdeProductos } from '../services/productoMapper';

const construirCatalogoLocal = () => {
  const stocksGuardados = leerStorage('hh_stocks', null) || {};
  return PRODUCTOS.map((producto) => {
    const stock = Number(stocksGuardados[producto.codigo] ?? producto.stock);
    const stockMinimo = Number(producto.stockMinimo ?? 0);
    return {
      ...producto,
      stock,
      stockMinimo,
      disponible: stock > 0,
      stockBajo: stock <= stockMinimo
    };
  });
};

const conStock = (producto, stock) => ({
  ...producto,
  stock,
  disponible: stock > 0,
  stockBajo: stock <= Number(producto.stockMinimo ?? 0)
});

export function useInventario() {
  const [productos, setProductos] = useState(construirCatalogoLocal);
  const [modoApi, setModoApi] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [errorApi, setErrorApi] = useState('');

  const recargar = useCallback(async () => {
    setCargando(true);
    try {
      const datos = await listarCatalogo();
      const lista = Array.isArray(datos) ? datos.map(aProductoFrontend) : [];
      setProductos(lista);
      setModoApi(true);
      setErrorApi('');
    } catch (error) {
      setModoApi(false);
      setErrorApi(error.message);
      setProductos(construirCatalogoLocal());
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    // Carga inicial del catálogo desde la API (operación asíncrona).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    recargar();
  }, [recargar]);

  // Guarda el último stock conocido para el modo local.
  useEffect(() => {
    guardarStorage('hh_stocks', stocksDesdeProductos(productos));
  }, [productos]);

  const stocks = useMemo(() => stocksDesdeProductos(productos), [productos]);

  const actualizarStock = useCallback(
    async (codigo, nuevoStock, motivo = 'Ajuste desde administración') => {
      const stock = Math.max(0, Number(nuevoStock) || 0);
      const anterior = productos.find((producto) => producto.codigo === codigo);
      if (!anterior) return false;

      setProductos((prev) =>
        prev.map((producto) => (producto.codigo === codigo ? conStock(producto, stock) : producto))
      );

      if (!modoApi || anterior.id == null) {
        return true;
      }

      try {
        const actualizado = await actualizarStockApi(anterior.id, stock, motivo);
        setProductos((prev) =>
          prev.map((producto) =>
            producto.codigo === codigo ? aProductoFrontend(actualizado) : producto
          )
        );
        return true;
      } catch (error) {
        setProductos((prev) =>
          prev.map((producto) =>
            producto.codigo === codigo ? conStock(producto, anterior.stock) : producto
          )
        );
        throw error;
      }
    },
    [modoApi, productos]
  );

  /**
   * Finaliza la compra. Con API: crea el pedido en tienda (boleta + descuento de stock
   * en MySQL) y devuelve la respuesta { numero, total, pedido, productos }.
   * Sin API (modo local): descuenta el stock en el navegador y devuelve null.
   */
  const descontarStock = useCallback(
    async (items, referencia, opciones = {}) => {
      if (!modoApi) {
        setProductos((prev) =>
          prev.map((producto) => {
            const item = items.find((linea) => linea.codigo === producto.codigo);
            if (!item) return producto;
            return conStock(producto, Math.max(0, producto.stock - item.cantidad));
          })
        );
        return null;
      }

      const respuesta = await finalizarCompraTienda(items, referencia, opciones);
      const porCodigo = new Map(
        (respuesta?.productos || []).map((dto) => [dto.codigo, aProductoFrontend(dto)])
      );
      setProductos((prev) =>
        prev.map((producto) => porCodigo.get(producto.codigo) || producto)
      );
      return respuesta;
    },
    [modoApi]
  );

  return {
    productos,
    stocks,
    modoApi,
    cargando,
    errorApi,
    recargar,
    actualizarStock,
    descontarStock
  };
}
