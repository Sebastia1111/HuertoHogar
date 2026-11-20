# Registro de cambios para asistentes de IA (Gemini, Claude, etc.)

> Lee este archivo **antes** de modificar el proyecto. Explica qué se cambió, por qué y qué falta verificar.
> El mismo archivo está en la raíz de los dos repositorios: `HuertoHogar-backend-main` y `HuertoHogar-Moderno`.
> Fecha: 2026-11-19. Autor de los cambios: Claude (Anthropic), a pedido del equipo.

---

## 0. Actualización 2026-11-20: base de datos (11 → 8 tablas) y arranque simplificado

Se eliminaron las tablas que no afectaban el flujo ni guardaban información útil:

| Tabla eliminada | Motivo | Reemplazo |
| --- | --- | --- |
| `carritos`, `items_carrito` | Siempre vacías: el frontend guarda el carrito en `localStorage` y lo envía completo en el checkout | Ninguno. Se borró el paquete `tienda/.../carrito/` y las funciones de carrito de `src/services/tiendaApi.js`. El checkout ahora exige `items` (`@NotEmpty`) |
| `refresh_tokens` | Crecía con cada renovación y nunca se limpiaba | El refresh token es un **JWT de 7 días** (claim `tipo=refresh`). El cierre de sesión y el cambio de clave suben `usuarios.tokenVersion` (claim `ver`), lo que invalida access y refresh anteriores. Ya no hay rotación ni detección de reutilización |

- `JwtService` (usuarios): `generarRefreshToken`, `validarRefresh`. `validar` solo acepta `tipo=access`.
- `JwtService` (tienda): rechaza los tokens con `tipo=refresh`.
- `limpiar-tablas-antiguas.sql`: borra las 3 tablas en un MySQL que ya las tenía (Hibernate no borra tablas).
- **Arranque simplificado:** `iniciar.bat` (doble clic) reemplaza a `iniciar-todo.ps1`. Eureka pasó a ser **opcional**: `UsuariosClient` busca "usuarios" en Eureka y, si no lo encuentra, usa `app.usuarios.url` (por defecto `http://localhost:8082`, o la variable `USUARIOS_URL`). Los clientes Eureka no exigen registrarse al iniciar, así que el orden de arranque no importa.
- **Limpieza y revisión final (2026-11-20, tarde):**
  - Eliminado código sin uso. Backend: `POST /api/inventario/productos/descuento` + `DescuentoStockRequest` + `ProductoGestionService.descontar`, `GET /api/tienda/categorias` y `GET /api/tienda/alertas` (duplicaban `/api/inventario/categorias` y `/alertas/stock-bajo`), el filtro `stockBajo` del catálogo público, la carpeta vacía `catalogo/client` y `tienda/README.md` (describía un frontend HTML antiguo). Frontend: respaldos que llamaban a inventario cuando tienda fallaba (viven en el mismo servicio, nunca podían funcionar), funciones de API sin uso (`crearProducto`, `actualizarProducto`, `ajustarStock`, `eliminarProducto`, `obtenerMovimientos`, `obtenerResumen`, `obtenerAlertasStockBajo`, `obtenerProducto`, `obtenerCategorias`, `obtenerAlertas`, `obtenerPedido`, `eliminarUsuario`, `aProductoBackend`), el átomo `Badge.jsx`, las imágenes de plantilla de Vite (`hero.png`, `react.svg`, `vite.svg`, `public/icons.svg`) y la carpeta `coverage/` (reporte generado; ahora en `.gitignore`).
  - Organización: `UsuarioController` se dividió en `PerfilController` (`/api/usuarios/me`) y `UsuarioController` (CRUD ADMIN); `InventarioApiController` se dividió en productos/stock y `CategoriaController`; `UsuariosClient` pasó a `pedido/client/`.
  - Swagger: grupos numerados (`tags-sorter=alpha`), quién puede usar cada operación en su título, guía de 3 pasos en la portada, ejemplos `@Schema` en todos los DTO (el login ya trae `admin@huertohogar.cl` / `12345`), token persistente (`persist-authorization`), `/` redirige a Swagger (`InicioController`) y el `ProductoController` original oculto (`springdoc.packages-to-exclude`).
  - Validaciones: todos los campos de entrada tienen restricción y mensaje propio (máximos de stock/precio, formato de código en las líneas de compra, URL de imagen, correo del checkout; perfil exige región, comuna y dirección como el frontend). Mensajes visibles con tildes (UTF-8).
- **Detener y desinstalar:** `detener.bat` ejecuta `gradlew --stop` y cierra con PowerShell lo que escucha en 8761, 8082 y 8083, los `java.exe` cuya línea de comandos contiene la carpeta del backend y las ventanas `cmd` de `gradlew.bat bootRun`. `borrar-bases.sql` elimina las dos bases.
- Las secciones siguientes ya están corregidas; si algo contradice esta sección, manda esta.

## 1. Contexto

- Proyecto académico **DSY1104 Desarrollo Fullstack II, Evaluación Parcial 3** (Duoc UC). Caso: tienda online **HuertoHogar**.
- La pauta exige: backend con BD y lógica de negocio, CRUD con Swagger, integración con el frontend por API REST, autenticación **JWT con roles**, sesión persistente en el frontend y restricciones de acceso por rol en el frontend.
- Hay **dos repositorios**, que deben mantenerse separados:
  - **Backend** `HuertoHogar-backend-main`: Spring Boot 4.1.2, Spring Cloud 2025.1.4 (Eureka), Java 21, Gradle 9.8.2 (wrapper), MySQL 8.4 en **Laragon**.
  - **Frontend** `HuertoHogar-Moderno`: React 19 + Vite 8 + Bootstrap 5, pruebas con Vitest.

### Instrucciones del equipo que se respetaron
1. **No modificar el código original de `inventario` ni de `eureka-server`**, salvo cambios mínimos para la integración.
   - Las clases `tienda/.../inventario/{model/Producto, repository/ProductoRepository, service/ProductoService, controller/ProductoController}` están **sin cambios**.
   - En `eureka-server` solo cambió `build.gradle` (opción `-PjavaVersion`).
2. Base de datos: **MySQL de Laragon** (`root` sin clave, puerto 3306).
3. Responder y documentar siempre en español.

---

## 2. Decisión principal: el backend se adaptó al contrato que ya usaba el frontend

El frontend ya tenía clientes HTTP escritos (`src/services/*.js`) contra una API concreta. Su README describía un backend que **no existía** (una carpeta `src/HuertoHogar-backend/` con inventario separado en el puerto 8081). Se decidió **adaptar el backend real a ese contrato**: mismos nombres de rutas y campos JSON. Así el frontend casi no cambió.

Contrato clave (no cambiarlo sin actualizar ambos lados):

| Aspecto | Valor |
| --- | --- |
| Login | `POST /api/auth/login` body `{correo, clave}` → `{accessToken, refreshToken, tokenType, expiresIn, usuario}` |
| Registro | `POST /api/auth/registro` body `{run, nombre, apellidos, correo, clave, fechaNacimiento, region, comuna, direccion}` |
| Sesión | `GET /api/auth/me` (token), `POST /api/auth/refresh` `{refreshToken}` (JWT), `POST /api/auth/logout` (solo token, responde 204) |
| Errores | JSON `{timestamp, status, error, message, detalles}`. `detalles` es un mapa campo → mensaje que usan los formularios |
| Producto (DTO) | `{id, codigo, nombre, descripcion, precio, stock, stockMinimo, unidad, categoria (slug), categoriaNombre, origen, emoji, practicasSostenibles, imagenUrl, activo, disponible, stockBajo}`. `id` = id del `Producto` de inventario |
| Checkout | `POST /api/tienda/carrito/checkout` body `{correo, items:[{codigo,cantidad}], referencia, fechaEntrega}` → `{numero, total, pedido, productos}` |
| Roles | `ADMIN`, `VENDEDOR`, `CLIENTE` (el frontend antes solo conocía ADMIN y CLIENTE) |
| Correos de registro | Solo `@gmail.com` y `@duocuc.cl`. `@huertohogar.cl` es para cuentas internas (las crea el ADMIN) |
| Descuento | 20 % si el correo termina en `@duocuc.cl` (mismo cálculo en `utils/storage.js` del frontend y en `common/Precios.java`) |

---

## 3. Arquitectura final

```
React + Vite :5173 (proxy en vite.config.js)
  ├─ /api/auth, /api/usuarios ─────► usuarios :8082 ──► MySQL huertohogar_usuarios
  └─ /api/tienda, /api/inventario ─► tienda   :8083 ──► MySQL huertohogar_tienda
                                       │ checkout: busca "usuarios" en Eureka (DiscoveryClient)
                                       └─► GET usuarios/api/auth/me (dirección de entrega)
eureka-server :8761
```

- **usuarios emite** el JWT (HMAC, librería jjwt 0.12.6). **tienda solo lo verifica**, con la misma clave `jwt.secret` (por defecto en `application.properties`, o con la variable `JWT_SECRET`).
- Claims del access token: `sub` = correo, `tipo=access`, `uid`, `rol`, `nombre`, `ver` (tokenVersion), `iss` = `huertohogar-usuarios`. El refresh token lleva `tipo=refresh`, `uid` y `ver`.
- Cada servicio tiene su propia BD. Los pedidos guardan `usuarioId` **sin FK** (está en otra BD).
- Puertos anteriores: tienda usaba 8080 por defecto y usuarios no tenía config. Ahora son **8082 / 8083**, los que ya usaba el frontend.

---

## 4. Cambios en el BACKEND (`HuertoHogar-backend-main`)

### 4.1 Estado inicial encontrado
- `usuarios`: solo existía la clase main. No arrancaba (Flyway/MySQL sin datasource, mismo puerto que tienda).
- `tienda`: usaba H2 en `application.properties`, pero **faltaba la dependencia H2** en `build.gradle` (no arrancaba). Sin `spring.application.name`. `catalogo/` y `carrito/` eran carpetas vacías (`h.txt`). Inventario solo tenía GET, POST y DELETE.

### 4.2 Configuración y build
| Archivo | Cambio |
| --- | --- |
| `usuarios/build.gradle`, `tienda/build.gradle` | + `spring-boot-starter-security`, `jjwt-api/impl/jackson 0.12.6`, `com.h2database:h2` (runtime), `spring-boot-h2console`, compilación UTF-8, `-PjavaVersion` |
| `eureka-server/build.gradle` | Solo `-PjavaVersion` (Java 21 por defecto) |
| `*/application.properties` | MySQL de Laragon por defecto (`createDatabaseIfNotExist=true`), `ddl-auto=update`, Flyway **desactivado**, puerto, Eureka, JWT, CORS (5173/4173), Swagger. Variables `DB_URL`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET` |
| `*/application-h2.properties` | Perfil `h2` alternativo (H2 en modo MySQL). Lo usan las pruebas |
| `iniciar.bat` / `detener.bat` | `detener.bat` cierra todo lo que abre `iniciar.bat` y libera la carpeta. `iniciar.bat`: doble clic en Windows: revisa Java (detecta la versión y la pasa como `-PjavaVersion`) y MySQL, y abre una ventana por servicio. Reemplazó a `iniciar-todo.ps1` el 2026-11-20 |
| `README.md` | Documentación completa de la API y la puesta en marcha |
| `.gitignore` | + `**/bin/` |

### 4.3 Microservicio `usuarios` (todo nuevo, paquete `com.huertohogar.usuarios`)
- `model/`: `Usuario` (run, nombre, apellidos, correo, password BCrypt, fechaNacimiento, region, comuna, direccion, telefono, rol, activo, **tokenVersion**, fechaRegistro), `Rol` (ADMIN, VENDEDOR, CLIENTE). Ya no existe `RefreshToken` (ver sección 0).
- `security/`:
  - `JwtService`: genera y valida el JWT (15 min).
  - `JwtAuthFilter`: no es `@Component` a propósito, para evitar que se registre dos veces. Rechaza el token si el usuario está inactivo o si `ver` ≠ `tokenVersion`.
  - `SecurityConfig`: sin estado (stateless), CORS y reglas por ruta.
  - `RestAuthHandlers`: respuestas JSON para 401 y 403.
- `service/AuthService`:
  - Registro siempre como CLIENTE.
  - Login con mensaje genérico (no revela qué correos existen).
  - **Refresh**: valida el refresh token (JWT) y que `ver` coincida con `tokenVersion`; entrega un par nuevo.
  - **Logout** sube `tokenVersion`.
- `service/UsuarioService`: perfil propio (`/me`), cambio de clave (sube `tokenVersion`) y CRUD del ADMIN. El ADMIN no puede quitarse su rol ni desactivarse.
- `validation/RunValidator`: módulo 11. `normalizar()` quita puntos y guion.
- `config/DataLoader`: crea `admin@`, `vendedor@` y `cliente@huertohogar.cl`, todos con clave `12345`, solo si la tabla está vacía.
- `config/OpenApiConfig`: Swagger con esquema bearer (botón Authorize).
- Rutas: `/api/auth/{registro,login,refresh}` son públicas. `/api/auth/{me,logout}` y `/api/usuarios/me/**` requieren token. `/api/usuarios/**` es solo para ADMIN.

### 4.4 Microservicio `tienda` (paquete `com.huertohogar.tienda`)
- `inventario/`: **SIN CAMBIOS**. El `ProductoController` original (`/api/inventario`) sigue disponible.
- `catalogo/model/`:
  - `ProductoCatalogo`: ficha 1 a 1 con `Producto`. Guarda codigo, categoria, stockMinimo, unidad, origen, practicasSostenibles, emoji, imagenUrl y activo. Existe para **no modificar `Producto`**.
  - `Categoria`: slug (`frutas`, `verduras`, `organicos`, `lacteos`), codigo, nombre y descripcion.
  - `MovimientoStock` + `TipoMovimiento` (ENTRADA, SALIDA, AJUSTE, VENTA, DEVOLUCION): trazabilidad de cada cambio de stock.
- `catalogo/service/ProductoGestionService`: CRUD, `actualizarStock`, `ajustar`, `descontarConBloqueo`, `reponer`, `resumen` y alertas.
  - El bloqueo se hace con `EntityManager.refresh(p, PESSIMISTIC_WRITE)` (equivale a `SELECT ... FOR UPDATE`), en orden de id.
  - Valida **todas** las líneas antes de descontar (todo o nada).
  - Eliminar es una baja lógica. El borrado físico solo se permite si el producto no tiene pedidos.
- `catalogo/controller/`: `InventarioApiController` (`/api/inventario/productos…`, `/resumen`, `/alertas/stock-bajo`), `CategoriaController` (`/api/inventario/categorias`) y `TiendaCatalogoController` (`/api/tienda/catalogo`, público).
- `carrito/`: **eliminado** el 2026-11-20 (el carrito vive en el navegador).
- `pedido/` (nuevo):
  - `Pedido`, `DetallePedido` (copia del precio al momento de la compra), `HistorialEstadoPedido` y `EstadoPedido`. Transiciones válidas: PENDIENTE → EN_PREPARACION → EN_CAMINO → ENTREGADO; CANCELADO solo desde PENDIENTE o EN_PREPARACION, y devuelve el stock.
  - `PedidoService.checkout`: crea el pedido, asigna el número `HH-(1000+id)`, descuenta stock con bloqueo y guarda la boleta. Valida la fecha de entrega (por defecto 2 días; rango de mañana a +30 días). `items` es obligatorio.
  - `pedido/client/UsuariosClient`: usa `DiscoveryClient` (Eureka) + `RestClient` para pedir `/api/auth/me` a usuarios, **fuera de la transacción**. Si Eureka no conoce a usuarios, usa `app.usuarios.url`. Si falla, la compra sigue sin dirección. No se usa `@LoadBalanced RestClient.Builder`, porque puede interferir con el transporte del cliente Eureka.
- `common/`: `GlobalExceptionHandler`, `ErrorResponse`, `ReglaNegocioException(status, mensaje, detalles)`, `Precios` (descuento Duoc e IVA 19 %) y `Acceso.verificarCorreo` (el `correo` del body debe coincidir con el del token, salvo para ADMIN).
- `config/DataLoader`: 4 categorías y 9 productos, con los **mismos datos que `src/data/productos.js` del frontend**.
- Permisos (`security/SecurityConfig`):
  - GET de catálogo e inventario: públicos.
  - Resumen, alertas, movimientos y `/pedidos/todos`: ADMIN o VENDEDOR.
  - PATCH de estado de pedido: ADMIN o VENDEDOR.
  - DELETE de inventario: solo ADMIN.
  - Otras escrituras de inventario: ADMIN o VENDEDOR.
  - `/api/tienda/**`: requiere token.

### 4.5 Pruebas del backend
- `usuarios`: `RunValidatorTest`, `JwtServiceTest` y `AuthFlowIntegrationTest` (registro → 409 → login → /me → 403 → refresh → el refresh no sirve como access → logout invalida access y refresh).
- `tienda`: `TiendaIntegrationTest` (catálogo con filtros, permisos por rol, historial de stock, checkout con descuento Duoc, aislamiento entre clientes, transiciones de estado, falta de stock sin descuento parcial, checkout vacío → 400, cancelación con devolución de stock y refresh token rechazado).
- Usan `@ActiveProfiles("h2")` y `eureka.client.enabled=false`. En tienda, el JWT de prueba se firma con la misma clave.

---

## 5. Cambios en el FRONTEND (`HuertoHogar-Moderno`)

| Archivo | Cambio |
| --- | --- |
| `vite.config.js` | Proxy compartido entre `server` y `preview`: `/api/auth` y `/api/usuarios` → 8082; `/api/tienda` y `/api/inventario` → 8083 |
| `.env.example` | Comentarios actualizados |
| `src/services/tiendaApi.js` | `finalizarCompra(items, referencia, {fechaEntrega})` + `obtenerPedido`, `cancelarPedido`, `listarTodosPedidos`, `cambiarEstadoPedido`. Se quitaron las funciones de carrito del servidor (2026-11-20) |
| `src/services/usuariosApi.js` (nuevo) | `obtenerMiPerfil`, `actualizarMiPerfil`, `cambiarMiClave`, `listarUsuarios`, `actualizarUsuario`, `eliminarUsuario` |
| `src/services/authApi.js`, `inventarioApi.js` | Solo comentarios (puertos reales) |
| `src/hooks/useInventario.js` | `descontarStock(items, referencia, opciones)` ahora **devuelve** la respuesta del checkout (`numero`, `total`, `pedido`). Sin API usa el catálogo local (`src/data/productos.js`) |
| `src/hooks/useAuth.js` | + `actualizarUsuario()`; `tipo` contempla VENDEDOR |
| `src/App.jsx` | Rutas `#/pedidos` y `#/perfil`; pasa `modoApi` al carrito y `onMostrarAviso` al admin |
| `src/components/organisms/CartDrawer.jsx` | Fecha de entrega preferida; usa el número de boleta del backend; **se eliminó `localStorage hh_pedidos`** |
| `src/components/organisms/Header.jsx`, `MobileMenu.jsx` | Enlaces "Mis pedidos", "Mi perfil" y "Panel de gestión" (este último solo para ADMIN o VENDEDOR) |
| `src/pages/AdminPage.jsx` | Reescrito: control de acceso + pestañas Stock y Pedidos (ADMIN/VENDEDOR) y Usuarios (solo ADMIN) |
| `src/components/organisms/PanelStock.jsx` (nuevo) | El contenido anterior de AdminPage (gestión de stock), sin cambios de lógica |
| `src/components/organisms/PanelPedidos.jsx`, `PanelUsuarios.jsx`, `BoletaPedido.jsx` (nuevos) | Gestión de pedidos, gestión de usuarios y boleta reutilizable con seguimiento |
| `src/components/molecules/AccesoRestringido.jsx` (nuevo) | Avisos de "verificando", "inicia sesión" y "sin permisos" |
| `src/pages/PedidosPage.jsx`, `PerfilPage.jsx` (nuevos) | Historial con boletas y cancelación; edición del perfil y cambio de clave |
| `src/utils/permisos.js`, `formato.js` (nuevos) | `puedeGestionar`, `esAdmin`, estados de pedido, `dinero()` y `fechaSimple()` (sin desfase de zona horaria) |
| Pruebas nuevas | `tiendaApi.test.js`, `usuariosApi.test.js`, `permisos.test.js`, `pages/AdminPage.test.jsx`, `pages/PedidosPage.test.jsx` |
| `README.md` | Corregido con la arquitectura real, puertos, cuentas y vistas |
| `dist/` | Regenerado con `npm run build` |

No se tocaron `node_modules/` (son de Windows), `coverage/`, `package.json` ni `package-lock.json`. Había cambios sin commit del equipo que se conservaron.

---

## 6. Estado de verificación (IMPORTANTE)

| Parte | Verificado | Cómo |
| --- | --- | --- |
| Frontend | ✅ | `npm test` (54/54), `npm run lint` sin errores, `npm run build` ok, y prueba E2E con Playwright contra un backend simulado con el mismo contrato (8 flujos ok, sin errores de consola) |
| Backend | ✅ con una salvedad | El equipo lo compiló y probó en Windows + Laragon el 2026-11-20 ("todo funciona"). La limpieza final de ese día (DTOs con `@Schema`, controladores divididos, tildes) solo se revisó con `javac` y chequeos de coherencia, porque el entorno de la IA no tiene acceso a Maven: **volver a correr `gradlew test`** |

Puntos del backend con más riesgo, que conviene revisar si falla la compilación o el arranque:
1. Coordenada `org.springframework.boot:spring-boot-h2console` (módulo de Boot 4; verificado en la documentación).
2. Paquete `org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc` en las pruebas (Boot 4; verificado en la documentación).
3. API de jjwt 0.12.x: `Jwts.builder().subject()...signWith(key)` y `Jwts.parser().verifyWith(key).requireIssuer().build().parseSignedClaims()`.
4. Inyección de `EntityManager` por constructor en `ProductoGestionService`.
5. `jjwt-jackson` trae Jackson 2, mientras Boot 4 usa Jackson 3; pueden convivir. Si da problemas, cambiar a `jjwt-gson`.
6. DDL de Hibernate en MySQL 8.4 con emojis: requiere `utf8mb4`, que es el valor por defecto de MySQL 8.

---

## 7. Cómo ejecutar

```powershell
# Backend (Laragon con MySQL iniciado)
cd HuertoHogar-backend-main
iniciar.bat                                   # doble clic; el orden de arranque no importa
cd usuarios; .\gradlew.bat test
cd ..\tienda; .\gradlew.bat test

# Frontend
cd HuertoHogar-Moderno
npm install
npm run dev        # http://localhost:5173
npm test -- --run
```
Cuentas: `admin@huertohogar.cl`, `vendedor@huertohogar.cl` y `cliente@huertohogar.cl`, todas con clave `12345`.
Swagger: `http://localhost:8082/swagger-ui.html` y `http://localhost:8083/swagger-ui.html`.

---

## 8. Pendiente / ideas

- Compilar y probar el backend en una máquina con acceso a Maven (prioridad 1).
- Entregables de la pauta: **manual de usuario con pantallazos** y **documento de integración**.
- Opcionales del caso: reseñas y calificaciones, API Gateway, notificaciones por correo de cambio de estado, CRUD completo de productos en la interfaz del admin (la API ya lo soporta: `POST/PUT/DELETE /api/inventario/productos`).

## 9. Reglas para próximos cambios

- Si cambias un nombre de campo o una ruta, actualiza **los dos lados** (`src/services/*.js` y los DTO o controladores Java) y sus pruebas.
- No muevas lógica a las clases originales de `inventario`; usa `catalogo/` (por ejemplo `ProductoGestionService`).
- Los permisos deben coincidir en `tienda/.../security/SecurityConfig.java`, `usuarios/.../security/SecurityConfig.java` y `src/utils/permisos.js`.
- Los mensajes de error para el usuario van en `message`, y los errores por campo en `detalles`.
