

export function initModal() {
    document.getElementById("btn-abrir-contacto").addEventListener("click", e => {
        e.preventDefault();
        const formaciones = window.getFormaciones?.() || [];
        abrirModalLibre(formaciones);
    });

    document.getElementById("form-contacto").addEventListener("submit", e => {
        e.preventDefault();

        const isLibre = document.getElementById('selector-curso-container').style.display === 'block';
        const cursoSeleccionado = isLibre
            ? document.getElementById('selector-curso').selectedOptions[0].textContent
            : document.getElementById('modal-curso-input').value;

        const btn = document.getElementById('btn-enviar');
        document.getElementById('btn-text').textContent = 'Enviando...';
        document.getElementById('btn-spinner').classList.remove('d-none');
        btn.disabled = true;

        setTimeout(() => {
            document.getElementById('btn-text').textContent = 'Enviar';
            document.getElementById('btn-spinner').classList.add('d-none');
            btn.disabled = false;
            cerrarModal();

            mostrarNotificacion("Formulario enviado", "Gracias por tu consulta.");
        }, 2000);
    });

    window.cerrarModal = cerrarModal;
}

export function abrirModalDesdeCurso(f) {
    const imagenesFamilias = {
        AFD: "assets/img/familias/afd.webp",
        ADG: "assets/img/familias/administracion.webp",
        // ... las demás familias
    };

    const imagen = imagenesFamilias[f.familia] || "assets/img/portfolio-2.webp";

    mostrarModal({
        modoLibre: false,
        titulo: f.especialidad,
        codigo: f.codigo,
        imagen: imagen,
    });
}

function abrirModalLibre(formaciones) {
    mostrarModal({
        modoLibre: true,
        titulo: "Información de Cursos",
        imagen: "assets/img/portfolio-1.jpg",
        formaciones,
    });
}
export function mostrarNotificacion(titulo, mensaje) {
  document.getElementById("modal-notificacion-titulo").textContent = titulo;
  document.getElementById("modal-notificacion-mensaje").textContent = mensaje;

  const modal = new bootstrap.Modal(document.getElementById("modal-notificacion"));
  modal.show();
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

    const modal = document.getElementById("modal-contacto");
    modal.classList.add("show");
    modal.style.display = "flex";
}

function cerrarModal() {
    const modal = document.getElementById("modal-contacto");
    modal.classList.remove("show");
    setTimeout(() => (modal.style.display = "none"), 300);
}
