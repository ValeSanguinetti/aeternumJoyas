
let carrito = [];
let categoriaActiva = "Todos";
let paginaActual = 1;
const productosPorPagina = 6;
let imagenesProducto = [];
let indiceImagen = 0;
let rutaAnterior = "/";
let paginaAnterior = 1;
// DOM
const contenedorProductos = document.getElementById("productos");
const contenedorCategorias = document.getElementById("categorias");
window.addEventListener("popstate", () => {

  detectarRuta();

  actualizarSEO();

  renderCategorias();
  renderProductos();

});
// Categorías
const categorias = ["Todos", ...new Set(productos.map(p => p.categoria))];

// Contador
function actualizarContador() {
  document.getElementById("contadorCarrito").textContent = carrito.length;
}

// Toggle carrito
function toggleCarrito() {
  const panel = document.getElementById("panelCarrito");
  panel.style.transform =
    panel.style.transform === "translateX(0%)"
      ? "translateX(100%)"
      : "translateX(0%)";
}
function crearSlug(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function crearSlugProducto(producto) {
  return `${crearSlug(producto.nombre)}-${crearSlug(producto.tipo)}`;
}
function rutaImagen(ruta) {
  return ruta.startsWith("/")
    ? ruta
    : "/" + ruta;
}
// Categorías UI
function renderCategorias() {

  contenedorCategorias.innerHTML = "";

  categorias.forEach(cat => {

    const enlace = document.createElement("a");

    enlace.textContent = cat;

    enlace.className =
      "cat-btn " +
      (categoriaActiva === cat
        ? "cat-btn-active"
        : "cat-btn-inactive");

    const nuevaRuta =
      cat === "Todos"
        ? "/"
        : `/${crearSlug(cat)}`;

    enlace.href = nuevaRuta;

    enlace.addEventListener("click", (e) => {

      e.preventDefault();

      categoriaActiva = cat;
      paginaActual = 1;

      history.pushState({}, "", nuevaRuta);

      actualizarSEO();

      renderCategorias();
      renderProductos();
    });

    contenedorCategorias.appendChild(enlace);
  });
}
function actualizarSEO() {

  const ruta = window.location.pathname;

  const title = document.querySelector("title");
  const description = document.querySelector('meta[name="description"]');
  const canonical = document.querySelector('link[rel="canonical"]');

  let nuevoTitulo =
    "Aeternum | Joyas y Accesorios Elegantes en Uruguay";

  let nuevaDescripcion =
    "Descubrí joyas de plata 925 y accesorios elegantes en Aeternum. Aros, collares, anillos y pulseras con envíos a todo Uruguay.";

  // HOME
  if (ruta === "/") {

    nuevoTitulo =
      "Aeternum | Joyas de Plata 925 y Accesorios en Uruguay";

    nuevaDescripcion =
      "Comprá joyas de plata 925 y accesorios en Uruguay. Aros, collares, anillos y pulseras de diseños elegantes en Aeternum, con envíos a todo el país.";
  }

  // CATEGORÍAS
  const categoria = categorias.find(
    cat =>
      cat !== "Todos" &&
      `/${crearSlug(cat)}` === ruta
  );

  if (categoria) {

    nuevoTitulo =
      `${categoria} en Uruguay | Joyas y Accesorios | Aeternum`;

    nuevaDescripcion =
      `Descubrí ${categoria.toLowerCase()} en Aeternum. Diseños elegantes en plata 925, acero y otros materiales, con envíos a todo Uruguay.`;
  }

  // PRODUCTOS
  if (ruta.startsWith("/producto/")) {

    const slug = ruta.replace("/producto/", "");

    const producto = productos.find(
      p => crearSlugProducto(p) === slug
    );

    if (producto) {

      nuevoTitulo =
        `${producto.nombre} | ${producto.tipo} | Aeternum`;

      nuevaDescripcion =
        `${producto.nombre} de ${producto.tipo}. Descubrí este diseño en Aeternum, joyas y accesorios en Uruguay.`;

      // Si tiene descripción propia, la usamos
      if (producto.descripcion) {
        nuevaDescripcion = producto.descripcion;
      }
    }
  }

  title.textContent = nuevoTitulo;
  description.setAttribute("content", nuevaDescripcion);

  canonical.setAttribute(
    "href",
    `https://www.aeternumuy.com${ruta}`
  );
}
function abrirModalProducto(producto) {

  const modal = document.getElementById("modalProducto");

  imagenesProducto =
    producto.imagenes || [producto.imagen];

  indiceImagen = 0;

  const modalImg =
    document.getElementById("modalImg");

  modalImg.src =
    rutaImagen(imagenesProducto[indiceImagen]);

  modalImg.alt =
    `${producto.nombre} ${producto.tipo} Aeternum Uruguay`;

  document.getElementById("modalNombre").textContent =
    producto.nombre;

  document.getElementById("modalPrecio").textContent =
    "$" + producto.precio;

  document.getElementById("modalTipo").textContent =
    producto.tipo;

  const desc =
    document.getElementById("modalDescripcion");

  if (producto.descripcion) {

    desc.textContent =
      producto.descripcion;

    desc.style.display = "block";

  } else {

    desc.style.display = "none";
  }

  const btn =
    document.getElementById("modalBtn");

  btn.onclick = () => {

    agregarAlCarrito(producto);

    cerrarModalProducto();
  };

  modal.classList.add("active");
}
function nextImg() {
  if (indiceImagen < imagenesProducto.length - 1) {
    indiceImagen++;

    document.getElementById("modalImg").src =
      rutaImagen(imagenesProducto[indiceImagen]);
  }
}

function prevImg() {
  if (indiceImagen > 0) {
    indiceImagen--;

    document.getElementById("modalImg").src =
      rutaImagen(imagenesProducto[indiceImagen]);
  }
}
function cerrarModalProducto() {

  document.getElementById("modalProducto").classList.remove("active");

  // Volvemos a la ruta anterior
  history.pushState(
    {},
    "",
    rutaAnterior
  );

  // Primero detectamos la ruta
  detectarRuta();

  // Después restauramos la página donde estaba el usuario
  paginaActual = paginaAnterior;

  // Actualizamos SEO
  actualizarSEO();

  // Actualizamos la interfaz
  renderCategorias();
  renderProductos();
}
// Productos UI
function renderProductos() {

  contenedorProductos.innerHTML = "";

  const filtrados =
    categoriaActiva === "Todos"
      ? productos
      : productos.filter(
          p => p.categoria === categoriaActiva
        );

  const inicio =
    (paginaActual - 1) * productosPorPagina;

  const fin =
    inicio + productosPorPagina;

  const productosPagina =
    filtrados.slice(inicio, fin);

  productosPagina.forEach(p => {

    const div = document.createElement("div");

    div.className = "product-card";

    const enlace = document.createElement("a");

    const rutaProducto =
      `/producto/${crearSlugProducto(p)}`;

    enlace.href = rutaProducto;

    enlace.style.textDecoration = "none";
    enlace.style.color = "inherit";

    enlace.innerHTML = `
      <img 
        src="${rutaImagen(p.imagen)}"
        class="img-card"
        alt="${p.nombre} ${p.tipo} Aeternum Uruguay"
      >

      <h3 class="h3-card">
        ${p.nombre}
      </h3>

      <p class="p-card">
        $${p.precio}
      </p>
    `;

enlace.addEventListener("click", (e) => {

  e.preventDefault();

  // Guardamos dónde estaba el usuario
  rutaAnterior = window.location.pathname;
  paginaAnterior = paginaActual;

  history.pushState(
    {},
    "",
    rutaProducto
  );

  actualizarSEO();

  abrirModalProducto(p);
});
    div.appendChild(enlace);

    const btn = document.createElement("button");

    btn.textContent = "Agregar";
    btn.className = "product-btn";

    btn.onclick = (e) => {

      e.stopPropagation();

      agregarAlCarrito(p);
    };

    div.appendChild(btn);

    contenedorProductos.appendChild(div);
  });

  renderPaginacion(filtrados.length);
}
function detectarRuta() {

  const ruta = window.location.pathname;

  // HOME
  if (ruta === "/") {
    categoriaActiva = "Todos";
    paginaActual = 1;
    return;
  }

  // CATEGORÍAS
  const categoriaEncontrada = categorias.find(
    cat =>
      cat !== "Todos" &&
      `/${crearSlug(cat)}` === ruta
  );

  if (categoriaEncontrada) {

    categoriaActiva = categoriaEncontrada;
    paginaActual = 1;

    return;
  }

  // PRODUCTO
if (ruta.startsWith("/producto/")) {

  const slug = ruta.replace("/producto/", "");

  const producto = productos.find(
    p => crearSlugProducto(p) === slug
  );

  if (producto) {

    categoriaActiva = producto.categoria;
    paginaActual = 1;

    setTimeout(() => {
      abrirModalProducto(producto);
    }, 0);
  }
}
}
function renderPaginacion(totalProductos) {
  let paginacion = document.getElementById("paginacion");

  if (!paginacion) {
    paginacion = document.createElement("div");
    paginacion.id = "paginacion";
    paginacion.className = "paginacion";
    contenedorProductos.after(paginacion);
  }

  paginacion.innerHTML = "";

  const totalPaginas = Math.ceil(totalProductos / productosPorPagina);

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement("button");

    btn.textContent = i;
    btn.className = "page-btn " + (i === paginaActual ? "active" : "");

    btn.onclick = () => {
      paginaActual = i;
      renderProductos();
    };

    paginacion.appendChild(btn);
  }
}
// Agregar
function agregarAlCarrito(producto) {
  carrito.push(producto);
  renderCarrito();
  actualizarContador();
}

// Eliminar
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  renderCarrito();
  actualizarContador();
}

// Render carrito
function renderCarrito() {
  const contenedor = document.getElementById("carrito");
  const totalEl = document.getElementById("total");

  contenedor.innerHTML = "";
  let total = 0;

  carrito.forEach((p, i) => {
    total += p.precio;

    const item = document.createElement("div");
    item.className = "cart-item";

    item.innerHTML = `
      <div class="cart-item-left">
        <img 
  src="${rutaImagen(p.imagen)}" 
  class="cart-img"
  alt="${p.nombre} ${p.tipo} Aeternum Uruguay"
>
        <span>${p.nombre}</span>
      </div>

      <div class="cart-item-right">
        <span>$${p.precio}</span>
      </div>
    `;

    const btn = document.createElement("button");
    btn.textContent = "✕";
    btn.className = "cart-remove";
    btn.onclick = () => eliminarDelCarrito(i);

    item.querySelector(".cart-item-right").appendChild(btn);

    contenedor.appendChild(item);
  });

  totalEl.textContent = "$" + total;
}

// WhatsApp
function enviarPedido() {
  if (carrito.length === 0) return alert("Carrito vacío");

  let mensaje = "Hola! Quiero este pedido:%0A";

  carrito.forEach(p => {
    mensaje += `• ${p.nombre} ($${p.precio})%0A`;
  });

  const total = carrito.reduce((acc, p) => acc + p.precio, 0);
  mensaje += `%0ATotal: $${total}`;

  window.open(`https://wa.me/59893737340?text=${mensaje}`);
}

// INIT
detectarRuta();

actualizarSEO();

renderCategorias();
renderProductos();
actualizarContador();
