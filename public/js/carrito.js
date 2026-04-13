
let carrito = [];
let categoriaActiva = "Todos";

// DOM
const contenedorProductos = document.getElementById("productos");
const contenedorCategorias = document.getElementById("categorias");

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

// Categorías UI
function renderCategorias() {
  contenedorCategorias.innerHTML = "";

  categorias.forEach(cat => {
    const btn = document.createElement("button");

    btn.textContent = cat;

    btn.className = "cat-btn " +
      (categoriaActiva === cat
        ? "cat-btn-active"
        : "cat-btn-inactive");


    btn.onclick = () => {
      categoriaActiva = cat;
      renderCategorias();
      renderProductos();
    };

    contenedorCategorias.appendChild(btn);
  });
}

// Productos UI
function renderProductos() {
  contenedorProductos.innerHTML = "";

  const filtrados = categoriaActiva === "Todos"
    ? productos
    : productos.filter(p => p.categoria === categoriaActiva);

  filtrados.forEach(p => {
    const div = document.createElement("div");

    div.className = "product-card";

    div.innerHTML = `
      <img src="${p.imagen}" class="img-card">

      <h3 class="h3-card">${p.nombre}</h3>
      <p class="p-card">$${p.precio}</p>
    `;

    const btn = document.createElement("button");
    btn.textContent = "Agregar";
    btn.className = "product-btn";
    btn.onclick = () => agregarAlCarrito(p);

    div.appendChild(btn);
    contenedorProductos.appendChild(div);
  });
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
        <img src="${p.imagen}" class="cart-img">
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
renderCategorias();
renderProductos();
actualizarContador();
