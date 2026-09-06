<div align="center">

# HuertoHogar
### Tienda Web de Productos Orgánicos y Del Campo

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
<!-- [![LocalStorage](https://img.shields.io/badge/Storage-LocalStorage-FF6D00?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage) -->

</div>

---

## Descripción del Proyecto

**HuertoHogar** es una tienda online dedicada a la venta de productos frescos: frutas de temporada, verduras orgánicas, productos orgánicos y lácteos de granjas locales. Hoy despacha a las principales ciudades de Chile.

El proyecto está desarrollado **100% con HTML, CSS y JavaScript vanilla**, sin frameworks ni dependencias externas.

---

## Funcionalidades

| Vista | Descripción |
| ----- | ----------- |
| **Home** | Hero de bienvenida, tarjetas de información con scroll horizontal, sección de "lo más vendido", catálogo con búsqueda especial y filtros en tiempo real |
| **Productos** | Listado generado desde un arreglo de JavaScript, con carrito funcional en la vista |
| **Detalle del producto** | Descripción completa, control de cantidad según stock y añadir al carrito |
| **Carrito** | Persistencia en `localStorage`, validación contra stock, totales y generación de pedidos simulados |
| **Ingreso / Registro** | Validaciones en tiempo real: correos Duoc/Gmail, RUN chileno con dígito verificador, regiones y comunas dinámicas |
| **Nosotros** | Historia, misión, visión, categorías del negocio y equipo de desarrollo |
| **Blogs + Detalle** | 2 artículos con sus respectivas vistas de detalle |
| **Contacto** | Formulario validado con contador de caracteres en vivo |

Además:

- **Búsqueda general** (lupa en la cabecera) sobre productos, blogs y secciones
- **Menú lateral deslizante** con navegación completa
- **Diseño responsivo** para móvil, tablet y escritorio

---

## 📁 Estructura del Proyecto

```
HuertoHogar/
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   └── img/
├── index.html
└── README.md
```

---

## Ejecución Local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/usuario/huertohogar.git
   cd huertohogar
   ```
2. Abre `index.html` en tu navegador (o usa la extensión *Live Server* de VS Code).
3. Listo. No requiere instalación ni dependencias.

También puedes desplegarlo gratis con **GitHub Pages** desde `Settings → Pages`.

---

## Cuentas de Prueba

| Correo | Contraseña | Rol |
| ------ | ---------- | --- |
| `admin@duoc.cl` | `admin123` | Administrador |
| `vendedor@duoc.cl` | `vend123` | Vendedor |

Para probar como **Cliente**, simplemente crea una cuenta desde la vista de registro.

---

## Validaciones Implementadas

- **Correo:** requerido en ingreso, máximo 100 caracteres, solo dominios `@duoc.cl`, `@profesor.duoc.cl` y `@gmail.com`
- **Contraseña:** entre 4 y 10 caracteres
- **RUN:** sin puntos ni guion, entre 7 y 9 caracteres, con validación real del dígito verificador (módulo 11)
- **Contacto:** nombre requerido (máx. 100), comentario requerido (máx. 500) con contador en vivo
- **Carrito:** no permite superar el stock disponible de cada producto

---
## Catálogo Detallado de Productos

| Código | Producto | Categoría | Precio | Stock | Descripción Destacada |
| :---: | --- | --- | :---: | :---: | --- |
| **FR001** | Manzanas Fuji | Frutas Frescas | $1,200 CLP / kg | 150 kg | Crujientes y dulces, cultivadas en el Valle del Maule. |
| **FR002** | Naranjas Valencia | Frutas Frescas | $1,000 CLP / kg | 200 kg | Jugosas y ricas en vitamina C, ideales para zumos frescos. |
| **FR003** | Plátanos Cavendish | Frutas Frescas | $800 CLP / kg | 250 kg | Maduros y dulces, excelentes para aportar energía diaria. |
| **VR001** | Zanahorias Orgánicas | Verduras Orgánicas | $900 CLP / kg | 100 kg | Cultivadas sin pesticidas en O'Higgins. Fuente de vitamina A. |
| **VR002** | Espinacas Frescas | Verduras Orgánicas | $700 CLP / 500g | 80 bolsas | Nutritivas y frescas, perfectas para batidos verdes. |
| **VR003** | Pimientos Tricolores | Verduras Orgánicas | $1,500 CLP / kg | 120 kg | Pimientos rojos, amarillos y verdes ricos en antioxidantes. |
| **PO001** | Miel Orgánica | Productos Orgánicos | $5,000 CLP / 500g | 50 frascos | Miel pura producida por apicultores locales. |
| **PO003** | Quinua Orgánica | Productos Orgánicos | Consultar | En Stock | Grano ancestral con alto contenido proteico. |
| **PL001** | Leche Entera | Productos Lácteos | Consultar | En Stock | Leche fresca proveniente de granjas locales. |

---

## 👥 Equipo de Desarrollo

<div align="center">
<table>
<tr>
<td align="center">
<a href="https://github.com/Sebastia1111">
<img src="https://github.com/Sebastia1111.png" width="100" style="border-radius:50%"><br>
<strong>Sebastian Orellana</strong><br>
</a>
</td>
<td align="center">
<a href="https://github.com/Joaquinstrap">
<img src="https://github.com/Joaquinstrap.png" width="100" style="border-radius:50%"><br>
<strong>Joaquin Correa</strong><br>
</a>
</td>
<td align="center">
<a href="https://github.com/estmedinat">
<img src="https://github.com/estmedinat.png" width="100" style="border-radius:50%"><br>
<strong>Esteban Medina</strong><br>
</a>
</td>
</tr>
</table>
</div>

---

## 📄 Licencia

Este proyecto fue desarrollado con fines **educativos** como parte de la asignatura de Fullstack en DuocUC.

<div align="center">

**Hecho con ❤️ para DuocUC**

<p>
<img src="https://img.shields.io/badge/FULLSTACK-2026-FFC20E?style=for-the-badge">
</p>

</div>
