export function initModal() {
  const modalElement = document.getElementById("modal-contacto");
  const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);

  // Botón para abrir el modal con listado de cursos libres
  document.getElementById("btn-abrir-contacto").addEventListener("click", e => {
    e.preventDefault();
    const formaciones = window.getFormaciones?.() || [];
    abrirModalLibre(formaciones, modalInstance);
  });

  // Aquí NO agregamos listener submit que cierre automáticamente ni muestre notificaciones.
  // Esa lógica debe estar en initFormulario.js para evitar duplicados/conflictos.

  // Exportamos función cerrarModal usando API Bootstrap
  window.cerrarModal = () => {
    modalInstance.hide();
    // Limpiar formulario al cerrar
    const form = document.getElementById("form-contacto");
    if (form) form.reset();
  };
}

export function abrirModalDesdeCurso(f) {
  const imagenesFamilias = {
    AFD: "assets/img/familias/afd.webp",
    ADG: "assets/img/familias/administracion.webp",
    // ... resto de familias
  };

  const imagen = imagenesFamilias[f.familia] || "assets/img/portfolio-2.webp";
  const modalElement = document.getElementById("modal-contacto");
  const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);

  mostrarModal({
    modoLibre: false,
    titulo: f.especialidad,
    codigo: f.codigo,
    imagen: imagen,
  });

  modalInstance.show();
}

function abrirModalLibre(formaciones, modalInstance) {
  mostrarModal({
    modoLibre: true,
    titulo: "Información de Cursos",
    imagen: "assets/img/portfolio-1.jpg",
    formaciones,
  });
  modalInstance.show();
}

function mostrarModal({ modoLibre, titulo, codigo = "", imagen = "assets/img/portfolio-1.jpg", formaciones = [] }) {
  document.getElementById("modal-curso-titulo").textContent = titulo;
  document.getElementById("modal-curso-bg").style.backgroundImage =
    `linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.1)), url('${imagen}')`;

  const selector = document.getElementById("selector-curso-container");
  const camposFijos = document.getElementById("campos-fijos");
  const camposFijosCodigo = document.getElementById("campos-fijos-codigo");
  const select = document.getElementById("selector-curso");

  if (modoLibre) {
    selector.style.display = "block";
    camposFijos.style.display = "none";
    camposFijosCodigo.style.display = "none";

    // Asignar opciones
    select.innerHTML = "";
    formaciones.forEach(f => {
      const opt = document.createElement("option");
      opt.value = f.codigo;
      opt.textContent = `${f.especialidad} (${f.localidad})`;
      select.appendChild(opt);
    });

    select.setAttribute("required", "true");
  } else {
    selector.style.display = "none";
    camposFijos.style.display = "block";
    camposFijosCodigo.style.display = "block";

    document.getElementById("modal-curso-input").value = titulo;
    document.getElementById("modal-codigo-input").value = codigo;

    select.removeAttribute("required");
  }
}
export function mostrarNotificacion(titulo, mensaje) {
  const modalElement = document.getElementById("modal-notificacion");
  const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);

  document.getElementById("modal-notificacion-titulo").textContent = titulo;
  document.getElementById("modal-notificacion-mensaje").textContent = mensaje;

  modalInstance.show();

  setTimeout(() => modalInstance.hide(), 3000);
}

