// modal.js
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
            alert(`Gracias por tu interés en: ${cursoSeleccionado}`);
        }, 2000);
    });

    window.cerrarModal = cerrarModal;
}

export function abrirModalDesdeCurso(f) {
    mostrarModal({
        modoLibre: false,
        titulo: f.titulo,
        codigo: f.codigo,
        imagen: f.imagen,
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

function mostrarModal({ modoLibre, titulo, codigo = "", imagen = "assets/img/portfolio-1.jpg", formaciones = [] }) {
    document.getElementById("modal-curso-titulo").textContent = titulo;
    document.getElementById("modal-curso-bg").style.backgroundImage =
        `linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.1)), url('${imagen}')`;

    const selector = document.getElementById("selector-curso-container");
    const camposFijos = document.getElementById("campos-fijos");
    const camposFijosCodigo = document.getElementById("campos-fijos-codigo");

    if (modoLibre) {
        selector.style.display = "block";
        camposFijos.style.display = "none";
        camposFijosCodigo.style.display = "none";

        const select = document.getElementById("selector-curso");
        select.innerHTML = "";
        formaciones.forEach(f => {
            const opt = document.createElement("option");
            opt.value = f.codigo;
            opt.textContent = `${f.titulo} (${f.lugar})`;
            select.appendChild(opt);
        });
    } else {
        selector.style.display = "none";
        camposFijos.style.display = "block";
        camposFijosCodigo.style.display = "block";

        document.getElementById("modal-curso-input").value = titulo;
        document.getElementById("modal-codigo-input").value = codigo;
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
