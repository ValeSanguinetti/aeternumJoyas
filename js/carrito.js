
let carrito = [];
let categoriaActiva = "todos";

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

    btn.className = `
      px-4 py-2 rounded-full text-sm transition
      ${categoriaActiva === cat
        ? "bg-black text-white shadow"
        : "bg-white text-gray-600 border"}
    `;

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

  const filtrados = categoriaActiva === "todos"
    ? productos
    : productos.filter(p => p.categoria === categoriaActiva);

  filtrados.forEach(p => {
    const div = document.createElement("div");

    div.className = "bg-white rounded-2xl p-4 text-center hover:shadow-lg transition";

    div.innerHTML = `
      <img src="${p.imagen}" class="h-40 mx-auto object-contain mb-4">

      <h3 class="text-sm">${p.nombre}</h3>
      <p class="text-gray-500 mb-2">$${p.precio}</p>

      <button onclick='agregarAlCarrito(${JSON.stringify(p)})'
        class="w-full bg-[#8a8f76] text-white py-2 rounded-lg hover:opacity-90 transition">
        Agregar
      </button>
    `;

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

    contenedor.innerHTML += `
      <div class="flex justify-between items-center mb-3 text-sm">
        <div class="flex gap-2 items-center">
          <img src="${p.imagen}" class="w-10 h-10 object-cover rounded">
          <span>${p.nombre}</span>
        </div>
        <div class="flex gap-2 items-center">
          <span>$${p.precio}</span>
          <button onclick="eliminarDelCarrito(${i})" class="text-red-500">✕</button>
        </div>
      </div>
    `;
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

  window.open(`https://wa.me/59800000000?text=${mensaje}`);
}

// INIT
renderCategorias();
renderProductos();
actualizarContador();
