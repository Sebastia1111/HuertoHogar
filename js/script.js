(function(){
  const fila = document.querySelector('.tarjetas-fila');
  if(!fila) return;
  let x0=0, y0=0, s0=0, eje=null;

  window.addEventListener('touchstart', function(e){
    if(!fila.contains(e.target)) return;
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    s0 = fila.scrollLeft; eje = null;
  }, {capture:true, passive:true});

  window.addEventListener('touchmove', function(e){
    if(!fila.contains(e.target)) return;
    const dx = e.touches[0].clientX - x0, dy = e.touches[0].clientY - y0;
    if(!eje){
      if(Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      eje = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }
    if(eje !== 'x') return;
    e.stopImmediatePropagation();
    e.preventDefault();
    fila.scrollLeft = s0 - dx;
  }, {capture:true, passive:false});

  window.addEventListener('touchend', function(){ eje = null; }, {capture:true, passive:true});
})();

// formatos de precio aca en chile
const fmt = n => '$' + n.toLocaleString('es-CL');

// escape basico para cuando mostramos texto que escribio el usuario
function esc(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function leerStorage(clave, porDefecto){
  try{
    const v = JSON.parse(localStorage.getItem(clave));
    return v === null || v === undefined ? porDefecto : v;
  }catch{
    return porDefecto;
  }
}

// categorias de la pauta
const CATEGORIAS = [
  {id:'frutas', nombre:'Frutas frescas', emoji:'🍓', descripcion:'De la cosecha directa a tu hogar: frutas de temporada cultivadas en su punto óptimo de madurez, con todo el sabor y los nutrientes intactos.'},
  {id:'verduras', nombre:'Verduras orgánicas', emoji:'🥬', descripcion:'Cultivadas sin pesticidas ni químicos, seleccionadas por su calidad y valor nutricional para una alimentación consciente.'},
  {id:'organicos', nombre:'Productos orgánicos', emoji:'🍯', descripcion:'Miel, granos y semillas elaborados de manera responsable, perfectos para un estilo de vida saludable sin renunciar al sabor.'},
  {id:'lacteos', nombre:'Productos lácteos', emoji:'🥛', descripcion:'Leches y yogures de granjas locales que producen de forma responsable, ricos en calcio y con su frescura intacta.'}
];

// arreglo de productos de la tienda
const PRODUCTOS = [
  {codigo:'FR001', nombre:'Manzanas Fuji', precio:1200, stock:150, unidad:'kilo', categoria:'frutas', emoji:'🍎', origen:'Valle del Maule',
   descripcion:'Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule. Perfectas para meriendas saludables o como ingrediente en postres, se destacan por su textura firme y un sabor equilibrado entre dulce y ácido.'},
  {codigo:'FR002', nombre:'Naranjas Valencia', precio:1000, stock:200, unidad:'kilo', categoria:'frutas', emoji:'🍊', origen:'',
   descripcion:'Jugosas y ricas en vitamina C, estas naranjas Valencia son ideales para zumos frescos y refrescantes. Se cultivan en condiciones climáticas óptimas que aseguran su dulzura y jugosidad.'},
  {codigo:'FR003', nombre:'Plátanos Cavendish', precio:800, stock:250, unidad:'kilo', categoria:'frutas', emoji:'🍌', origen:'',
   descripcion:'Plátanos maduros y dulces, perfectos para el desayuno o como snack energético. Son ricos en potasio y vitaminas, ideales para mantener una dieta equilibrada.'},
  {codigo:'VR001', nombre:'Zanahorias Orgánicas', precio:900, stock:100, unidad:'kilo', categoria:'verduras', emoji:'🥕', origen:"Región de O'Higgins",
   descripcion:'Zanahorias crujientes cultivadas sin pesticidas en la Región de O\'Higgins. Excelente fuente de vitamina A y fibra, ideales para ensaladas, jugos o como snack saludable.'},
  {codigo:'VR002', nombre:'Espinacas Frescas', precio:700, stock:80, unidad:'bolsa de 500g', categoria:'verduras', emoji:'🥬', origen:'',
   descripcion:'Espinacas frescas y nutritivas, perfectas para ensaladas y batidos verdes. Se cultivan bajo prácticas orgánicas que garantizan su calidad y valor nutricional.'},
  {codigo:'VR003', nombre:'Pimientos Tricolores', precio:1500, stock:120, unidad:'kilo', categoria:'verduras', emoji:'🫑', origen:'',
   descripcion:'Pimientos rojos, amarillos y verdes, ideales para salteados y platos coloridos. Ricos en antioxidantes y vitaminas, añaden un toque vibrante y saludable a cualquier receta.'},
  {codigo:'PO001', nombre:'Miel Orgánica', precio:5000, stock:50, unidad:'frasco de 500g', categoria:'organicos', emoji:'🍯', origen:'Apicultores locales',
   descripcion:'Miel pura y orgánica producida por apicultores locales. Rica en antioxidantes y con un sabor inigualable, perfecta para endulzar de manera natural tus comidas y bebidas.'},
  {codigo:'PO003', nombre:'Quinua Orgánica', precio:3200, stock:45, unidad:'bolsa de 1kg', categoria:'organicos', emoji:'🌾', origen:'',
   descripcion:'Quinua orgánica de grano pequeño, cultivada de manera responsable. Una fuente vegetal completa de proteínas, ideal para ensaladas, guisos y desayunos saludables.'},
  {codigo:'PL001', nombre:'Leche Entera', precio:950, stock:120, unidad:'litro', categoria:'lacteos', emoji:'🥛', origen:'Granjas locales',
   descripcion:'Leche entera de granjas locales que se dedican a la producción responsable y de calidad. Rica en calcio y nutrientes esenciales, perfecta para toda la familia.'}
];

const BLOGS = [
  {id:'temporada', titulo:'Frutas de temporada: por qué valen la pena', categoria:'Vida saludable', fecha:'14 de agosto de 2025', autor:'Equipo HuertoHogar', minLectura:3, emoji:'🍑',
   resumen:'Comprar fruta de temporada no solo sabe mejor: también es más barato, más nutritivo y mucho más amigable con el planeta.',
   cuerpo:[
     'Cuando compras fruta de temporada estás llevando un producto que se cosechó hace pocos días, en su punto exacto de madurez. Eso se nota en el aroma, la textura y el sabor: una manzana Fuji de otoño no tiene comparación con una que lleva semanas en cámaras de frío.',
     'El segundo motivo es nutricional. La fruta que se cosecha madura conserva mejor sus vitaminas y antioxidantes, mientras que la que madura durante el transporte pierde parte de su valor nutricional en el camino.',
     'También es una decisión de bolsillo: la oferta abundante de cada estación hace bajar los precios. Comprar naranjas en invierno o sandías en verano siempre conviene.',
     'Por último, el impacto ambiental es menor: menos transporte, menos cámaras frigoríficas y menos intermediarios entre el agricultor y tu mesa. En HuertoHogar trabajamos justamente con ese modelo, publicando cada semana qué frutas están en su mejor momento.'
   ]},
  {id:'despensa', titulo:'5 cambios simples para una despensa más orgánica', categoria:'Tips', fecha:'2 de septiembre de 2025', autor:'Equipo HuertoHogar', minLectura:4, emoji:'🫙',
   resumen:'No necesitas cambiarlo todo de un día para otro. Estos cinco pasos te acercan a una despensa más limpia y consciente.',
   cuerpo:[
     'No hace falta volverse experto en nutrición para mejorar lo que hay en tu despensa. Con cambios pequeños y sostenibles en el tiempo basta, y estos cinco son un buen punto de partida.',
     'Primero, planifica tu menú de la semana y compra con lista: vas a gastar menos y a tirar menos comida. Segundo, prioriza productos locales y de temporada: llegan más frescos y con menor huella de transporte.',
     'Tercero, aprende a leer etiquetas: mientras más corta e interpretable sea la lista de ingredientes, mejor. Cuarto, almacena bien: frutas y verduras separadas, en lugares ventilados y lejos de la luz directa duran mucho más.',
     'Y quinto, reemplaza de a poco: cambia los snacks ultraprocesados por frutos secos, fruta fresca o miel orgánica para endulzar. En un mes vas a notar la diferencia, tanto en sabor como en cómo te sientes.'
   ]}
];

// contenido de las tarjetas de informacion del home
const INFO_SECCIONES = [
  {id:'historia', icono:'🌱', titulo:'Nuestra historia', bajada:'más de 6 años del campo a tu mesa',
   detalle:`<p>HuertoHogar nació hace más de 6 años con una idea simple: acercar el campo a las ciudades. Partimos despachando cajas de verduras dentro de Santiago y hoy operamos en las principales ciudades del país.</p>
   <p>Seguimos trabajando con agricultores locales que cosechan en su punto justo, para que cada pedido llegue tan fresco como salió de la tierra.</p>`},
  {id:'impacto', icono:'🌍', titulo:'Nuestro impacto', bajada:'comercio justo y agricultura local',
   detalle:`<p>Creemos que comprar bien puede transformar el campo chileno. Por eso cada decisión nuestra apunta a un circuito más corto y más justo:</p>
   <ul><li>compra directa a agricultores locales, sin intermediarios innecesarios</li><li>preferencia por cultivos orgánicos y de temporada</li><li>embalajes reciclables y rutas de despacho optimizadas</li><li>educación alimentaria a través de nuestros blogs</li></ul>`},
  {id:'contacto', icono:'💬', titulo:'Contacto', bajada:'estamos para ayudarte',
   detalle:`<p>Si tienes dudas con un pedido, un producto o quieres trabajar con nosotros, escríbenos por el canal que prefieras:</p>
   <ul><li>correo: contacto@huertohogar.cl</li><li>teléfono y whatsapp: +56 9 1234 5678</li><li>atención: lunes a sábado, de 9:00 a 19:00</li></ul>
   <p>También puedes usar el <a href="#/contacto">formulario de contacto</a> de la página.</p>`},
  {id:'direccion', icono:'📍', titulo:'Dónde encontrarnos', bajada:'puntos de retiro en 5 ciudades',
   detalle:`<p>Hoy tenemos presencia en las principales ciudades de Chile, con puntos de retiro y oficinas en:</p>
   <ul><li>Santiago — Av. Providencia 1234, local 4</li><li>Puente Alto — Av. Concha y Toro 01500</li><li>Viña del Mar — Av. Valparaíso 550</li><li>Valparaíso — Calle Errázuriz 812</li><li>Concepción — Caupolicán 355</li></ul>`},
  {id:'despacho', icono:'🚚', titulo:'Despacho a domicilio', bajada:'frescura en 24 a 48 horas',
   detalle:`<p>Cosechamos y preparamos tu pedido el mismo día para que llegue como recién salido del campo:</p>
   <ul><li>Santiago: entrega en 24 horas</li><li>regiones: entrega entre 24 y 48 horas</li><li>despacho gratis en compras sobre $30.000</li><li>embalaje reciclable y refrigerado</li></ul>`}
];

// regiones y comunas de la pauta, completar con el arreglo oficial cuando llegue
const REGIONES = [
  {nombre:'Región Metropolitana', comunas:['Santiago','Providencia','Las Condes','Maipú','Puente Alto','La Florida']},
  {nombre:'Región de Valparaíso', comunas:['Valparaíso','Viña del Mar','Quilpué','Villa Alemana']},
  {nombre:"Región de O'Higgins", comunas:['Rancagua','San Fernando','Santa Cruz','Machalí']},
  {nombre:'Región del Maule', comunas:['Talca','Curicó','Linares','Constitución']},
  {nombre:'Región del Biobío', comunas:['Concepción','Talcahuano','Chiguayante','Los Ángeles']}
];

// cuentas base para probar los roles, el resto se crea por registro
const USUARIOS_BASE = [
  {correo:'admin@huertohogar.cl', clave:'admin123', nombre:'Administrador', tipo:'Administrador'},
  {correo:'vendedor@huertohogar.cl', clave:'vend123', nombre:'Vendedor', tipo:'Vendedor'}
];

const $ = id => document.getElementById(id);

const btnMenu=$('btnMenu'), menuLateral=$('menuLateral'), btnCerrarMenu=$('btnCerrarMenu'), fondo=$('fondo'),
btnBuscar=$('btnBuscar'), busquedaOverlay=$('busquedaOverlay'), inputBusquedaGeneral=$('inputBusquedaGeneral'),
btnCerrarBusqueda=$('btnCerrarBusqueda'), resultadosBusqueda=$('resultadosBusqueda'),
btnCarrito=$('btnCarrito'), carritoLateral=$('carritoLateral'), btnCerrarCarrito=$('btnCerrarCarrito'),
itemsCarrito=$('itemsCarrito'), totalCarrito=$('totalCarrito'), btnVaciarCarrito=$('btnVaciarCarrito'),
btnFinalizarCompra=$('btnFinalizarCompra'), contadorCarrito=$('contadorCarrito'),
btnUsuario=$('btnUsuario'), menuUsuario=$('menuUsuario'), saludoUsuario=$('saludoUsuario'),
rolUsuario=$('rolUsuario'), btnCerrarSesion=$('btnCerrarSesion'), zonaSesion=$('zonaSesion'),
tarjetasInfo=$('tarjetasInfo'), detalleTarjeta=$('detalleTarjeta'),
grillaProductos=$('grillaProductos'), filtroTexto=$('filtroTexto'), filtroCategoria=$('filtroCategoria'),
filtroOrden=$('filtroOrden'), contadorResultados=$('contadorResultados'), btnLimpiarFiltros=$('btnLimpiarFiltros'),
categoriasGrid=$('categoriasGrid'), listaBlogs=$('listaBlogs'), blogDetalle=$('blogDetalle'),
productoDetalle=$('productoDetalle'), formIngreso=$('formIngreso'), formRegistro=$('formRegistro'),
formContacto=$('formContacto'), contactoComentario=$('contactoComentario'), contadorComentario=$('contadorComentario'),
regRegion=$('regRegion'), regComuna=$('regComuna'), anioFooter=$('anioFooter');

// estado del carrito y la sesion, todo queda guardado por si el usuario cierra el navegador
let carrito = leerStorage('hh_carrito', []);
let sesion = leerStorage('hh_sesion', null);
let filtros = {texto:'', categoria:'todas', orden:'relevancia'};
let avisoTimer;

function aviso(mensaje){
  const el = $('aviso');
  el.textContent = mensaje;
  el.classList.add('visible');
  clearTimeout(avisoTimer);
  avisoTimer = setTimeout(() => el.classList.remove('visible'), 2600);
}

function guardarCarrito(){
  localStorage.setItem('hh_carrito', JSON.stringify(carrito));
}

function obtenerUsuarios(){
  return USUARIOS_BASE.concat(leerStorage('hh_usuarios', []));
}

/* ------- carrito de compras ------- */

function agregarAlCarrito(codigo, cantidad){
  const p = PRODUCTOS.find(x => x.codigo === codigo);
  if(!p) return false;
  const item = carrito.find(i => i.codigo === codigo);
  const nueva = (item ? item.cantidad : 0) + cantidad;
  if(nueva > p.stock){
    aviso('solo hay ' + p.stock + ' unidades de ' + p.nombre);
    return false;
  }
  if(item) item.cantidad = nueva;
  else carrito.push({codigo, cantidad});
  guardarCarrito();
  renderCarrito();
  aviso(p.nombre + ' se añadió al carrito 🧺');
  return true;
}

function cambiarCantidad(codigo, delta){
  const item = carrito.find(i => i.codigo === codigo);
  if(!item) return;
  const p = PRODUCTOS.find(x => x.codigo === codigo);
  const nueva = item.cantidad + delta;
  if(nueva > p.stock){
    aviso('no hay más stock disponible de ' + p.nombre);
    return;
  }
  if(nueva <= 0){
    quitarDelCarrito(codigo);
    return;
  }
  item.cantidad = nueva;
  guardarCarrito();
  renderCarrito();
}

function quitarDelCarrito(codigo){
  carrito = carrito.filter(i => i.codigo !== codigo);
  guardarCarrito();
  renderCarrito();
  aviso('producto quitado del carrito');
}

function totalDelCarrito(){
  return carrito.reduce((suma, i) => {
    const p = PRODUCTOS.find(x => x.codigo === i.codigo);
    return suma + (p ? p.precio * i.cantidad : 0);
  }, 0);
}

function renderCarrito(){
  if(!carrito.length){
    itemsCarrito.innerHTML = `
      <div class="carrito-vacio">
        <span>🧺</span>
        <p>tu carrito está vacío</p>
        <a href="#/inicio" data-scroll="catalogo" class="btn btn-borde">ver catálogo</a>
      </div>`;
  } else {
    itemsCarrito.innerHTML = carrito.map(i => {
      const p = PRODUCTOS.find(x => x.codigo === i.codigo);
      return `
      <div class="item-carrito" data-codigo="${p.codigo}">
        <figure class="mini cat-${p.categoria}">${p.emoji}</figure>
        <div class="item-info">
          <h4>${p.nombre}</h4>
          <p class="precio">${fmt(p.precio)}</p>
          <div class="item-controles">
            <button class="btn-step" data-accion="restar">−</button>
            <span>${i.cantidad}</span>
            <button class="btn-step" data-accion="sumar">+</button>
            <button class="btn-quitar" data-accion="quitar">quitar</button>
          </div>
        </div>
        <strong>${fmt(p.precio * i.cantidad)}</strong>
      </div>`;
    }).join('');
  }
  const totalItems = carrito.reduce((a, i) => a + i.cantidad, 0);
  contadorCarrito.textContent = totalItems;
  contadorCarrito.classList.toggle('oculto', totalItems === 0);
  totalCarrito.textContent = fmt(totalDelCarrito());
}

itemsCarrito.addEventListener('click', e => {
  const btn = e.target.closest('button[data-accion]');
  if(!btn) return;
  const codigo = btn.closest('.item-carrito').dataset.codigo;
  if(btn.dataset.accion === 'sumar') cambiarCantidad(codigo, 1);
  else if(btn.dataset.accion === 'restar') cambiarCantidad(codigo, -1);
  else if(btn.dataset.accion === 'quitar') quitarDelCarrito(codigo);
});

btnVaciarCarrito.addEventListener('click', () => {
  if(!carrito.length){ aviso('tu carrito ya está vacío'); return; }
  carrito = [];
  guardarCarrito();
  renderCarrito();
  aviso('carrito vaciado');
});

btnFinalizarCompra.addEventListener('click', () => {
  if(!carrito.length){ aviso('tu carrito está vacío'); return; }
  if(!sesion){
    cerrarCarrito();
    aviso('inicia sesión para finalizar tu compra');
    location.hash = '#/ingreso';
    navegar();
    return;
  }
  // pedido simulado, queda guardado para el panel admin de la proxima etapa
  const pedidos = leerStorage('hh_pedidos', []);
  const numero = 'HH-' + (1001 + pedidos.length);
  pedidos.push({
    numero,
    cliente: sesion.correo,
    fecha: new Date().toLocaleDateString('es-CL'),
    items: carrito.map(i => ({...i})),
    total: totalDelCarrito(),
    estado: 'pendiente'
  });
  localStorage.setItem('hh_pedidos', JSON.stringify(pedidos));
  carrito = [];
  guardarCarrito();
  renderCarrito();
  cerrarCarrito();
  aviso('¡pedido ' + numero + ' recibido! te avisaremos cuando esté en camino');
});

/* ------- paneles laterales y overlays ------- */

function actualizarBloqueo(){
  const abierto = menuLateral.classList.contains('abierto') || carritoLateral.classList.contains('abierto');
  document.body.classList.toggle('bloqueado', abierto);
}

function abrirMenu(){ menuLateral.classList.add('abierto'); fondo.classList.add('visible'); btnMenu.classList.add('btn-menu-abierto'); actualizarBloqueo(); }
function cerrarMenu(){ menuLateral.classList.remove('abierto'); btnMenu.classList.remove('btn-menu-abierto'); fondo.classList.remove('visible'); actualizarBloqueo(); }
function abrirCarrito(){ carritoLateral.classList.add('abierto'); fondo.classList.add('visible'); actualizarBloqueo(); }
function cerrarCarrito(){ carritoLateral.classList.remove('abierto'); fondo.classList.remove('visible'); actualizarBloqueo(); }
function cerrarMenuUsuario(){ menuUsuario.classList.add('oculto'); }
function abrirBusqueda(){
  busquedaOverlay.classList.add('abierta');
  inputBusquedaGeneral.value = '';
  renderBusqueda('');
  setTimeout(() => inputBusquedaGeneral.focus(), 80);
}
function cerrarBusqueda(){ busquedaOverlay.classList.remove('abierta'); }

btnMenu.addEventListener('click', () => menuLateral.classList.contains('abierto') ? cerrarMenu() : abrirMenu());
btnCerrarMenu.addEventListener('click', cerrarMenu);
fondo.addEventListener('click', () => { cerrarMenu(); cerrarCarrito(); cerrarMenuUsuario(); });
btnCarrito.addEventListener('click', abrirCarrito);
btnCerrarCarrito.addEventListener('click', cerrarCarrito);
btnBuscar.addEventListener('click', abrirBusqueda);
btnCerrarBusqueda.addEventListener('click', cerrarBusqueda);
busquedaOverlay.addEventListener('click', e => { if(e.target === busquedaOverlay) cerrarBusqueda(); });

document.addEventListener('keydown', e => {
  if(e.key === 'Escape'){ cerrarMenu(); cerrarCarrito(); cerrarBusqueda(); cerrarMenuUsuario(); }
});

btnUsuario.addEventListener('click', () => {
  if(sesion) menuUsuario.classList.toggle('oculto');
  else { location.hash = '#/ingreso'; navegar(); }
});

document.addEventListener('click', e => {
  if(!menuUsuario.classList.contains('oculto') && !e.target.closest('#menuUsuario') && !e.target.closest('#btnUsuario')){
    cerrarMenuUsuario();
  }
});

// todo lo que tenga data-scroll lleva al catalogo de la pagina de inicio
document.addEventListener('click', e => {
  const el = e.target.closest('[data-scroll="catalogo"]');
  if(!el) return;
  if(el.tagName === 'BUTTON' && location.hash !== '#/inicio') location.hash = '#/inicio';
  cerrarCarrito();
  cerrarMenu();
  setTimeout(() => {
    const seccion = $('catalogo');
    if(seccion) seccion.scrollIntoView({behavior:'smooth'});
  }, 150);
});

/* ------- busqueda general ------- */

function renderBusqueda(q){
  q = q.trim().toLowerCase();
  if(!q){
    resultadosBusqueda.innerHTML = '<p class="ayuda-busqueda">escribe para buscar en productos, blogs y secciones de la tienda.</p>';
    return;
  }
  const prods = PRODUCTOS.filter(p => (p.nombre + ' ' + p.codigo + ' ' + p.categoria).toLowerCase().includes(q));
  const blogs = BLOGS.filter(b => (b.titulo + ' ' + b.resumen).toLowerCase().includes(q));
  const secciones = [
    {nombre:'inicio', ruta:'#/inicio'},
    {nombre:'productos y catálogo', scroll:true},
    {nombre:'nosotros', ruta:'#/nosotros'},
    {nombre:'blogs', ruta:'#/blogs'},
    {nombre:'contacto', ruta:'#/contacto'}
  ].filter(s => s.nombre.includes(q));

  let html = '';
  if(prods.length){
    html += '<p class="grupo-busqueda">productos</p>' + prods.map(p => `
      <a class="fila-resultado" href="#/producto/${p.codigo}">
        <span class="mini-emoji">${p.emoji}</span>
        <span class="fila-texto"><strong>${p.nombre}</strong><small>${p.codigo}</small></span>
        <span class="fila-precio">${fmt(p.precio)}</span>
      </a>`).join('');
  }
  if(blogs.length){
    html += '<p class="grupo-busqueda">blogs</p>' + blogs.map(b => `
      <a class="fila-resultado" href="#/blog/${b.id}">
        <span class="mini-emoji">${b.emoji}</span>
        <span class="fila-texto"><strong>${b.titulo}</strong><small>${b.categoria}</small></span>
      </a>`).join('');
  }
  if(secciones.length){
    html += '<p class="grupo-busqueda">secciones</p>' + secciones.map(s => `
      <a class="fila-resultado" href="${s.ruta || '#/inicio'}" ${s.scroll ? 'data-scroll="catalogo"' : ''}>
        <span class="mini-emoji">🧭</span>
        <span class="fila-texto"><strong>${s.nombre}</strong></span>
      </a>`).join('');
  }
  resultadosBusqueda.innerHTML = html || `<p class="ayuda-busqueda">no encontramos resultados para "<strong>${esc(q)}</strong>".</p>`;
}

inputBusquedaGeneral.addEventListener('input', e => renderBusqueda(e.target.value));
inputBusquedaGeneral.addEventListener('keydown', e => {
  if(e.key === 'Enter'){
    const primera = resultadosBusqueda.querySelector('a');
    if(primera){
      cerrarBusqueda();
      location.hash = primera.getAttribute('href');
      navegar();
    }
  }
});
resultadosBusqueda.addEventListener('click', e => { if(e.target.closest('a')) cerrarBusqueda(); });

/* ------- tarjetas de informacion del home ------- */

function renderTarjetasInfo(){
  tarjetasInfo.innerHTML = INFO_SECCIONES.map(s => `
    <button class="tarjeta-info" data-id="${s.id}">
      <span class="icono">${s.icono}</span>
      <strong>${s.titulo}</strong>
      <small>${s.bajada}</small>
    </button>`).join('');
}

tarjetasInfo.addEventListener('click', e => {
  const t = e.target.closest('.tarjeta-info');
  if(!t) return;
  const s = INFO_SECCIONES.find(x => x.id === t.dataset.id);
  document.querySelectorAll('.tarjeta-info').forEach(x => x.classList.remove('activa'));
  t.classList.add('activa');
  detalleTarjeta.innerHTML = `<h3>${s.icono} ${s.titulo}</h3>${s.detalle}`;
  detalleTarjeta.classList.add('visible');
});

/* ------- catalogo con busqueda especial ------- */

function productosFiltrados(){
  const t = filtros.texto.trim().toLowerCase();
  let lista = PRODUCTOS.filter(p => {
    const coincideTexto = !t || (p.nombre + ' ' + p.codigo).toLowerCase().includes(t);
    const coincideCategoria = filtros.categoria === 'todas' || p.categoria === filtros.categoria;
    return coincideTexto && coincideCategoria;
  });
  if(filtros.orden === 'precio-asc') lista = [...lista].sort((a,b) => a.precio - b.precio);
  if(filtros.orden === 'precio-desc') lista = [...lista].sort((a,b) => b.precio - a.precio);
  if(filtros.orden === 'nombre') lista = [...lista].sort((a,b) => a.nombre.localeCompare(b.nombre, 'es'));
  return lista;
}

function renderCatalogo(){
  const lista = productosFiltrados();
  contadorResultados.textContent = lista.length + (lista.length === 1 ? ' producto encontrado' : ' productos encontrados');
  if(!lista.length){
    grillaProductos.innerHTML = '<div class="sin-resultados">🧐 no encontramos productos con esos filtros.<br>prueba con otra búsqueda o limpia los filtros.</div>';
    return;
  }
  grillaProductos.innerHTML = lista.map(p => `
    <article class="tarjeta-producto" data-codigo="${p.codigo}">
      <figure class="cat-${p.categoria}">${p.emoji}</figure>
      <div class="tarjeta-cuerpo">
        <span class="codigo">${p.codigo}</span>
        <h3 class="nombre-producto">${p.nombre}</h3>
        <p class="precio">${fmt(p.precio)} <small style="font-weight:400;color:var(--muted)">/ ${p.unidad}</small></p>
        <p class="stock-mini">${p.stock} en stock</p>
        <button class="btn btn-primario btn-anadir">añadir</button>
      </div>
    </article>`).join('');
}

grillaProductos.addEventListener('click', e => {
  const tarjeta = e.target.closest('.tarjeta-producto');
  if(!tarjeta) return;
  const codigo = tarjeta.dataset.codigo;
  if(e.target.closest('.btn-anadir')){
    agregarAlCarrito(codigo, 1);
    return;
  }
  location.hash = '#/producto/' + codigo;
  navegar();
});

filtroTexto.addEventListener('input', e => { filtros.texto = e.target.value; renderCatalogo(); });
filtroCategoria.addEventListener('change', e => { filtros.categoria = e.target.value; renderCatalogo(); });
filtroOrden.addEventListener('change', e => { filtros.orden = e.target.value; renderCatalogo(); });

btnLimpiarFiltros.addEventListener('click', () => {
  filtros = {texto:'', categoria:'todas', orden:'relevancia'};
  filtroTexto.value = '';
  filtroCategoria.value = 'todas';
  filtroOrden.value = 'relevancia';
  renderCatalogo();
});

/* ------- detalle de producto ------- */

function renderProducto(codigo){
  const p = PRODUCTOS.find(x => x.codigo === codigo);
  if(!p){
    productoDetalle.innerHTML = '<div class="sin-resultados">producto no encontrado. <a href="#/inicio" data-scroll="catalogo" style="color:var(--verde);font-weight:700">volver al catálogo</a></div>';
    return;
  }
  const cat = CATEGORIAS.find(c => c.id === p.categoria);
  productoDetalle.innerHTML = `
    <a class="volver" href="#/inicio" data-scroll="catalogo">‹ volver al catálogo</a>
    <article class="detalle-producto">
      <figure class="cat-${p.categoria}">${p.emoji}</figure>
      <div class="detalle-info">
        <span class="etiqueta">${cat.nombre}</span>
        <h1>${p.nombre}</h1>
        <span class="codigo">código ${p.codigo}</span>
        <p class="precio-detalle">${fmt(p.precio)} <small>por ${p.unidad}</small></p>
        <p class="descripcion">${p.descripcion}</p>
        ${p.origen ? `<p class="origen"><strong>origen:</strong> ${p.origen}</p>` : ''}
        <p class="stock-detalle">stock disponible: <strong>${p.stock}</strong></p>
        <div class="compra">
          <div class="cantidad-controles">
            <button class="btn-cant" data-accion="menos">−</button>
            <input id="cantidadProducto" type="number" min="1" max="${p.stock}" value="1">
            <button class="btn-cant" data-accion="mas">+</button>
          </div>
          <button class="btn btn-primario" data-accion="agregar">añadir al carrito</button>
        </div>
        <small class="error-suave" id="errorCantidad"></small>
      </div>
    </article>`;
}

productoDetalle.addEventListener('click', e => {
  const btn = e.target.closest('button[data-accion]');
  if(!btn) return;
  const codigo = location.hash.replace('#/','').split('/')[1];
  const p = PRODUCTOS.find(x => x.codigo === codigo);
  const input = $('cantidadProducto');
  const error = $('errorCantidad');
  let cantidad = parseInt(input.value, 10) || 0;

  if(btn.dataset.accion === 'menos'){
    input.value = Math.max(1, cantidad - 1);
    error.textContent = '';
  } else if(btn.dataset.accion === 'mas'){
    if(cantidad >= p.stock){ error.textContent = 'no hay más stock disponible'; return; }
    input.value = cantidad + 1;
    error.textContent = '';
  } else if(btn.dataset.accion === 'agregar'){
    if(cantidad < 1){ error.textContent = 'ingresa una cantidad válida'; return; }
    if(cantidad > p.stock){ error.textContent = 'solo hay ' + p.stock + ' unidades disponibles'; return; }
    if(agregarAlCarrito(codigo, cantidad)) error.textContent = '';
  }
});

/* ------- blogs ------- */

function renderBlogs(){
  listaBlogs.innerHTML = BLOGS.map(b => `
    <article class="tarjeta-blog">
      <a href="#/blog/${b.id}"><figure class="portada-mini cat-organicos">${b.emoji}</figure></a>
      <div class="tarjeta-blog-cuerpo">
        <span class="etiqueta">${b.categoria}</span>
        <h3><a href="#/blog/${b.id}">${b.titulo}</a></h3>
        <p>${b.resumen}</p>
        <a class="leer-mas" href="#/blog/${b.id}">leer más ›</a>
      </div>
    </article>`).join('');
}

function renderBlog(id){
  const b = BLOGS.find(x => x.id === id) || BLOGS[0];
  blogDetalle.innerHTML = `
    <a class="volver" href="#/blogs">‹ volver a blogs</a>
    <article class="articulo-blog">
      <figure class="portada cat-organicos">${b.emoji}</figure>
      <span class="etiqueta">${b.categoria}</span>
      <h1>${b.titulo}</h1>
      <p class="meta">${b.fecha} · por ${b.autor} · ${b.minLectura} min de lectura</p>
      ${b.cuerpo.map(par => `<p>${par}</p>`).join('')}
    </article>`;
}

/* ------- categorias en nosotros ------- */

function renderCategorias(){
  categoriasGrid.innerHTML = CATEGORIAS.map(c => `
    <article class="tarjeta-categoria">
      <figure class="icono-categoria cat-${c.id}">${c.emoji}</figure>
      <h3>${c.nombre}</h3>
      <p>${c.descripcion}</p>
    </article>`).join('');
}

/* ------- validaciones ------- */

/* esta sirve harto para el tema de validar el correo */
const DOMINIOS_PERMITIDOS = ['@huertohogar.cl','@gmail.com'];

function chequearCorreo(valor){
  const v = valor.trim().toLowerCase();
  if(!v) return 'el correo es requerido';
  if(v.length > 100) return 'máximo 100 caracteres';
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'revisa el formato del correo';
  if(!DOMINIOS_PERMITIDOS.some(d => v.endsWith(d))) return 'solo aceptamos @gmail.com';
  return '';
}

function chequearRequerido(valor, campo, max){
  const v = valor.trim();
  if(!v) return 'el campo ' + campo + ' es requerido';
  if(max && v.length > max) return 'máximo ' + max + ' caracteres';
  return '';
}

function chequearClave(valor){
  if(!valor.trim()) return 'la contraseña es requerida';
  if(valor.length < 4 || valor.length > 10) return 'debe tener entre 4 y 10 caracteres';
  return '';
}

function chequearComentario(valor){
  const v = valor.trim();
  if(!v) return 'el comentario es requerido';
  if(v.length > 500) return 'máximo 500 caracteres';
  return '';
}

// el dv se calcula con el algoritmo del modulo 11
function chequearRun(valor){
  const v = valor.trim().toUpperCase();
  if(!v) return 'el run es requerido';
  if(!/^[0-9K]+$/.test(v)) return 'usa solo números y K, sin puntos ni guion';
  if(v.length < 7 || v.length > 9) return 'debe tener entre 7 y 9 caracteres';
  const cuerpo = v.slice(0, -1);
  const dv = v.slice(-1);
  let suma = 0, multiplicador = 2;
  for(let i = cuerpo.length - 1; i >= 0; i--){
    suma += parseInt(cuerpo[i], 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  const resto = 11 - (suma % 11);
  const dvEsperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
  return dv === dvEsperado ? '' : 'el run ingresado no es válido';
}

// conecta un input con su validador para que revise en tiempo real
function conectarCampo(id, validador){
  const input = $(id);
  const campo = input.closest('.campo');
  const revisar = () => {
    const error = validador(input.value);
    campo.classList.toggle('invalido', !!error);
    campo.classList.toggle('valido', !error && input.value.trim() !== '');
    const msg = campo.querySelector('.msg-error');
    if(msg) msg.textContent = error;
    return !error;
  };
  input.addEventListener('input', revisar);
  input.addEventListener('blur', revisar);
  input.addEventListener('change', revisar);
  return revisar;
}

function marcarError(id, mensaje){
  const input = $(id);
  const campo = input.closest('.campo');
  campo.classList.add('invalido');
  campo.classList.remove('valido');
  const msg = campo.querySelector('.msg-error');
  if(msg) msg.textContent = mensaje;
}

function limpiarEstados(form){
  form.querySelectorAll('.campo').forEach(c => c.classList.remove('valido','invalido'));
}

/* ------- sesion ------- */

function actualizarSesion(){
  if(sesion){
    saludoUsuario.textContent = 'hola, ' + sesion.nombre;
    rolUsuario.textContent = sesion.tipo;
    zonaSesion.innerHTML = `
      <p class="saludo-menu">hola, <strong>${esc(sesion.nombre)}</strong></p>
      <p class="rol-menu">${esc(sesion.tipo)}</p>
      <button id="btnSalirMenu" class="btn btn-borde btn-block">cerrar sesión</button>`;
    $('btnSalirMenu').addEventListener('click', cerrarSesion);
  } else {
    zonaSesion.innerHTML = `
      <a class="btn btn-primario btn-block" href="#/ingreso">iniciar sesión</a>
      <a class="btn btn-borde btn-block" href="#/registro">crear cuenta</a>`;
  }
}

function iniciarSesion(usuario){
  sesion = {nombre: usuario.nombre, correo: usuario.correo, tipo: usuario.tipo};
  localStorage.setItem('hh_sesion', JSON.stringify(sesion));
  actualizarSesion();
  aviso('sesión iniciada, ¡hola ' + usuario.nombre + '!');
  location.hash = '#/inicio';
  navegar();
}

function cerrarSesion(){
  sesion = null;
  localStorage.removeItem('hh_sesion');
  actualizarSesion();
  cerrarMenuUsuario();
  aviso('sesión cerrada');
}

btnCerrarSesion.addEventListener('click', cerrarSesion);

/* ------- regiones y comunas ------- */

function poblarComunas(indice){
  if(indice < 0){
    regComuna.innerHTML = '<option value="">elige una comuna</option>';
    regComuna.disabled = true;
    return;
  }
  regComuna.innerHTML = '<option value="">elige una comuna</option>' +
    REGIONES[indice].comunas.map(c => `<option value="${c}">${c}</option>`).join('');
  regComuna.disabled = false;
}

function poblarRegiones(){
  regRegion.innerHTML = '<option value="">elige una región</option>' +
    REGIONES.map((r, i) => `<option value="${i}">${r.nombre}</option>`).join('');
  poblarComunas(-1);
  regRegion.addEventListener('change', () => {
    poblarComunas(regRegion.value === '' ? -1 : parseInt(regRegion.value, 10));
  });
}

/* ------- envio de formularios ------- */

const chequeosIngreso = [
  conectarCampo('loginCorreo', chequearCorreo),
  conectarCampo('loginClave', chequearClave)
];

formIngreso.addEventListener('submit', e => {
  e.preventDefault();
  if(!chequeosIngreso.every(fn => fn())) return;
  const correo = $('loginCorreo').value.trim().toLowerCase();
  const usuario = obtenerUsuarios().find(u => u.correo === correo);
  if(!usuario){ marcarError('loginCorreo', 'no encontramos una cuenta con ese correo'); return; }
  if(usuario.clave !== $('loginClave').value){ marcarError('loginClave', 'contraseña incorrecta'); return; }
  formIngreso.reset();
  limpiarEstados(formIngreso);
  iniciarSesion(usuario);
});

const chequeosRegistro = [
  conectarCampo('regRun', chequearRun),
  conectarCampo('regNombre', v => chequearRequerido(v, 'nombre', 50)),
  conectarCampo('regApellidos', v => chequearRequerido(v, 'apellidos', 100)),
  conectarCampo('regCorreo', chequearCorreo),
  conectarCampo('regClave', chequearClave),
  conectarCampo('regRegion', v => v ? '' : 'elige una región'),
  conectarCampo('regComuna', v => v ? '' : 'elige una comuna'),
  conectarCampo('regDireccion', v => chequearRequerido(v, 'dirección', 300))
];

formRegistro.addEventListener('submit', e => {
  e.preventDefault();
  if(!chequeosRegistro.every(fn => fn())) return;
  const correo = $('regCorreo').value.trim().toLowerCase();
  if(obtenerUsuarios().some(u => u.correo === correo)){
    marcarError('regCorreo', 'ya existe una cuenta con ese correo');
    return;
  }
  const nuevo = {
    run: $('regRun').value.trim().toUpperCase(),
    nombre: $('regNombre').value.trim(),
    apellidos: $('regApellidos').value.trim(),
    correo,
    clave: $('regClave').value,
    fecha: $('regFecha').value,
    region: REGIONES[parseInt(regRegion.value, 10)].nombre,
    comuna: regComuna.value,
    direccion: $('regDireccion').value.trim(),
    tipo: 'Cliente'
  };
  const guardados = leerStorage('hh_usuarios', []);
  guardados.push(nuevo);
  localStorage.setItem('hh_usuarios', JSON.stringify(guardados));
  formRegistro.reset();
  poblarComunas(-1);
  limpiarEstados(formRegistro);
  iniciarSesion(nuevo);
  aviso('cuenta creada, ¡bienvenido a HuertoHogar, ' + nuevo.nombre + '!');
});

const chequeosContacto = [
  conectarCampo('contactoNombre', v => chequearRequerido(v, 'nombre', 100)),
  conectarCampo('contactoCorreo', v => v.trim() ? chequearCorreo(v) : ''),
  conectarCampo('contactoComentario', chequearComentario)
];

contactoComentario.addEventListener('input', () => {
  contadorComentario.textContent = contactoComentario.value.length + ' / 500';
});

formContacto.addEventListener('submit', e => {
  e.preventDefault();
  if(!chequeosContacto.every(fn => fn())) return;
  const mensajes = leerStorage('hh_mensajes', []);
  mensajes.push({
    nombre: $('contactoNombre').value.trim(),
    correo: $('contactoCorreo').value.trim().toLowerCase(),
    comentario: $('contactoComentario').value.trim(),
    fecha: new Date().toLocaleString('es-CL')
  });
  localStorage.setItem('hh_mensajes', JSON.stringify(mensajes));
  formContacto.reset();
  contadorComentario.textContent = '0 / 500';
  limpiarEstados(formContacto);
  aviso('¡mensaje enviado! te responderemos pronto 🌱');
});

/* ------- router por hash ------- */

function navegar(){
  const hash = location.hash || '#/inicio';
  const partes = hash.replace('#/','').split('/');
  const ruta = partes[0] || 'inicio';

  cerrarMenu();
  cerrarCarrito();
  cerrarBusqueda();
  cerrarMenuUsuario();

  if(ruta === 'blog') renderBlog(partes[1]);
  if(ruta === 'producto') renderProducto(partes[1]);

  let destino = ruta;
  if(!$('vista-' + destino)) destino = 'inicio';
  document.querySelectorAll('.vista').forEach(v => v.classList.remove('activa'));
  $('vista-' + destino).classList.add('activa');

  document.querySelectorAll('.menu-lista .link-vista').forEach(a => {
    a.classList.toggle('activo', a.dataset.ruta === ruta);
  });

  window.scrollTo({top: 0});
}

window.addEventListener('hashchange', navegar);

/* ------- inicio ------- */

function iniciar(){
  anioFooter.textContent = new Date().getFullYear();
  renderTarjetasInfo();
  renderCatalogo();
  renderBlogs();
  renderCategorias();
  poblarRegiones();
  renderCarrito();
  actualizarSesion();
  navegar();
}

iniciar();