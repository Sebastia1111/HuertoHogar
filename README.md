<div align="center">

# HuertoHogar

### Tienda web de productos orgánicos y del campo

**DSY1104 — Desarrollo Fullstack II — Evaluación Parcial 3**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io)
[![MySQL](https://img.shields.io/badge/MySQL-8.4-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com)

</div>

---

## Descripción

**HuertoHogar** es una tienda online de frutas, verduras, productos orgánicos y
lácteos de granjas locales. Este repositorio es el **frontend (React + Vite)**. Se
integra con el backend **HuertoHogar-backend** (microservicios Spring Boot + Eureka
+ MySQL en Laragon), que está en su propio repositorio.

La entrega incorpora:

- Catálogo desde la API con búsqueda, filtros y validación de stock.
- Autenticación con **JWT** y roles `ADMIN`, `VENDEDOR` y `CLIENTE`.
- Sesión persistente (sobrevive recargas) con renovación automática de tokens.
- Checkout real: crea la boleta y descuenta stock en MySQL, con fecha de entrega preferida.
- **Mis pedidos**: boletas, seguimiento de estado y cancelación.
- **Mi perfil**: dirección de entrega, teléfono y cambio de contraseña.
- **Panel de gestión** restringido por rol: stock y pedidos (ADMIN/VENDEDOR), usuarios (solo ADMIN).
- Catálogo local de respaldo si el backend está apagado.

---

## Arquitectura

```
React + Vite (5173)
   │  proxy de Vite
   ├─ /api/auth, /api/usuarios ─────► usuarios :8082 ──► MySQL huertohogar_usuarios
   └─ /api/tienda, /api/inventario ─► tienda   :8083 ──► MySQL huertohogar_tienda
                                         │ (checkout) consulta a usuarios vía Eureka (o directo si Eureka no está)
usuarios y tienda se registran en eureka-server :8761
```

| Módulo | Puerto | Responsabilidad |
| --- | --- | --- |
| Frontend React | 5173 | Interfaz (este repositorio) |
| `eureka-server` | 8761 | Registro de servicios |
| `usuarios` | 8082 | Login, registro, JWT, refresh, perfil y gestión de usuarios |
| `tienda` | 8083 | Inventario, catálogo, checkout y pedidos (el carrito vive en el navegador) |

El frontend llama siempre a rutas relativas (`/api/...`) y **Vite las enruta** al
microservicio correcto (ver `vite.config.js`), así no hay URLs fijas en el código.

---

## Puesta en marcha

### 1. Backend

1. Abrir **Laragon** → *Iniciar todo* (MySQL en el puerto 3306). Las bases, tablas,
   los 9 productos y las cuentas de prueba se crean solas al arrancar.
2. En la carpeta del backend:
   doble clic en **`iniciar.bat`**. Abre una ventana para Eureka (8761), usuarios (8082)
   y tienda (8083). El orden no importa y Eureka es opcional.

### 2. Frontend

```powershell
npm install
npm run dev
```

Abrir <http://localhost:5173>. Si el backend está apagado, el catálogo funciona en
modo local con los datos de `src/data/productos.js`.

---

## Cuentas de prueba (clave `12345`)

| Rol | Correo | Qué puede hacer |
| --- | --- | --- |
| Administrador | `admin@huertohogar.cl` | Todo: stock, pedidos y usuarios |
| Vendedor | `vendedor@huertohogar.cl` | Stock y estados de pedidos |
| Cliente | `cliente@huertohogar.cl` | Comprar, mis pedidos y mi perfil |

Para probar el **20 % de descuento Duoc**, registra una cuenta con correo `@duocuc.cl`.

---

## Funcionalidades principales

| Vista | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| **Inicio** | `#/inicio` | Público | Hero, destacados, catálogo, búsqueda y filtros |
| **Detalle** | `#/producto/FR001` | Público | Descripción, origen, stock y selector de cantidad |
| **Carrito** | panel lateral | Público / compra con sesión | Totales con descuento, fecha de entrega y checkout |
| **Ingreso / Registro** | `#/ingreso`, `#/registro` | Público | JWT; RUN módulo 11, correo y región/comuna |
| **Mis pedidos** | `#/pedidos` | Con sesión | Boletas (neto, IVA, descuento), seguimiento y cancelación |
| **Mi perfil** | `#/perfil` | Con sesión | Datos personales, dirección de entrega, teléfono y contraseña |
| **Panel de gestión** | `#/admin` | ADMIN / VENDEDOR | Pestañas Stock y Pedidos; Usuarios solo ADMIN |
| **Nosotros / Blogs / Contacto** | | Público | Contenido informativo y formulario validado |

### Seguridad y sesión

- Access token de 15 minutos y refresh token de 7 días (ambos JWT, sin tabla en la BD), guardados en `localStorage` (clave `hh_auth`).
- `session.js` renueva el token antes de que expire; varias peticiones comparten un mismo refresh.
- Al recargar, `useAuth` muestra la sesión guardada y la revalida con `/api/auth/me`.
- Al cerrar sesión, el backend sube `tokenVersion` del usuario: todos los tokens anteriores dejan de servir.
- Restricciones por rol en la interfaz (`src/utils/permisos.js`): un cliente que entra a `#/admin`
  ve "No tienes permisos", y los enlaces de gestión solo aparecen para ADMIN/VENDEDOR. El backend
  aplica las mismas reglas y responde `403` si alguien intenta saltárselas.

---

## Pruebas

```powershell
npm test -- --run
npm run lint
npm run build
```

54 pruebas (servicios de API, sesión, permisos por rol, páginas de admin y pedidos,
validadores y componentes), lint sin errores y build de producción en `dist/`.

---

## Estructura del frontend

```
src/
├── components/
│   ├── atoms/          Button, Toast, Typography...
│   ├── molecules/      FormField, SelectField, ProductCard, AccesoRestringido...
│   └── organisms/      Header, CartDrawer, BoletaPedido, PanelStock, PanelPedidos, PanelUsuarios...
├── data/               productos.js (respaldo), regiones.js, blogs...
├── hooks/              useAuth.js, useInventario.js
├── pages/              HomePage, AdminPage, PedidosPage, PerfilPage, LoginPage...
├── services/           authApi.js, session.js, tiendaApi.js, inventarioApi.js, usuariosApi.js
├── utils/              storage.js, validators.js, permisos.js, formato.js
├── App.jsx
└── main.jsx
```

---

## Equipo de desarrollo

<div align="center">
<table>
<tr>
<td align="center">
<a href="https://github.com/Sebastia1111">
<img src="https://github.com/Sebastia1111.png" width="100" style="border-radius:50%"><br>
<strong>Sebastian Orellana</strong>
</a>
</td>
<td align="center">
<a href="https://github.com/Joaquinstrap">
<img src="https://github.com/Joaquinstrap.png" width="100" style="border-radius:50%"><br>
<strong>Joaquin Correa</strong>
</a>
</td>
<td align="center">
<a href="https://github.com/estmedinat">
<img src="https://github.com/estmedinat.png" width="100" style="border-radius:50%"><br>
<strong>Esteban Medina</strong>
</a>
</td>
</tr>
</table>
</div>

---

## Licencia

Proyecto desarrollado con fines **educativos** para DuocUC.


[**Click Aquí para Obtener la Configuración!**](https://start.spring.io/#!type=maven-project&language=java&platformVersion=4.1.1&packaging=jar&configurationFileFormat=yaml&jvmVersion=21&groupId=com.fullstack&artifactId=&packageName=com.fullstack.&dependencies=web,cloud-eureka,data-jpa,validation,flyway,mysql,mariadb,lombok,cloud-feign,security)