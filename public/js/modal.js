function abrirModal(tipo) {
  const modal = document.getElementById("modalInfo");
  const titulo = document.getElementById("modalTitulo");
  const texto = document.getElementById("modalTexto");

  modal.classList.remove("hidden");
  modal.classList.add("flex");

  if (tipo === "envios") {
    titulo.textContent = "Envíos";
    texto.textContent = "Realizamos envíos a todo Uruguay a través de DAC.";
  }

  if (tipo === "cambios") {
    titulo.textContent = "Cambios y devoluciones";
    texto.textContent = "Tenés hasta 7 días para cambios. El producto debe estar sin uso y en su empaque original.";
  }

  if (tipo === "cuidados") {
    titulo.textContent = "Cuidados de las joyas";
    texto.textContent = "Evitá el contacto con agua, perfumes o químicos. Guardá tus piezas en un lugar seco.";
  }
}

function cerrarModal() {
  const modal = document.getElementById("modalInfo");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}