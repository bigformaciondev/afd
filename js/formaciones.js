import { abrirModalDesdeCurso } from './modal.js';

export function initFormaciones() {
    const requiredIds = [
        "filtro-nombre",
        "filtro-codigo",
        "filtro-centro",
        "formaciones-container"
    ];

    const elementosFaltantes = requiredIds.filter(id => !document.getElementById(id));
    if (elementosFaltantes.length > 0) {
        console.warn("Esperando a que cargue el DOM completamente para:", elementosFaltantes);
        setTimeout(initFormaciones, 100);
        return;
    }

    let formaciones = [];

    const equivalenciasFamilias = {
        "Administración": "filtros.familia.administracion",
        "Marketing": "filtros.familia.marketing",
        "Sanidad": "filtros.familia.sanidad",
        "Informática": "filtros.familia.informatica",
        "Idiomas": "filtros.familia.idiomas",
        "RRHH": "filtros.familia.rrhh",
        "Diseño": "filtros.familia.diseno"
    };

    fetch("../assets/data/formaciones.json")
        .then(res => res.json())
        .then(data => {
            formaciones = data;
            prepararFiltroFamilia(formaciones, mostrarFormaciones);
            prepararFiltroPorCentro();
        })
        .catch(err => console.error("Error cargando formaciones:", err));

    function mostrarFormaciones() {
        const container = document.getElementById("formaciones-container");
        const nombreEl = document.getElementById("filtro-nombre");
        const codigoEl = document.getElementById("filtro-codigo");
        const centroEl = document.getElementById("filtro-centro");
        const familiaEl = document.getElementById("filtro-familia");
        const inicioEl = document.getElementById("filtro-inicio");
        const finEl = document.getElementById("filtro-fin");

        if (!container || !nombreEl || !codigoEl || !centroEl) {
            console.warn("Faltan elementos del DOM. No se puede mostrar formaciones.");
            return;
        }

        container.innerHTML = "";

        const nombre = nombreEl.value.toLowerCase();
        const codigo = codigoEl.value.toLowerCase();
        const centro = centroEl.value;
        const familia = familiaEl?.value || "";
        const fechaInicio = inicioEl?.value || "";
        const fechaFin = finEl?.value || "";

        const filtradas = formaciones.filter(f =>
            f.titulo.toLowerCase().includes(nombre) &&
            f.codigo.toLowerCase().includes(codigo) &&
            (!centro || f.lugar === centro) &&
            (!familia || f.familia === familia) &&
            (!fechaInicio || f.fecha_inicio >= fechaInicio) &&
            (!fechaFin || f.fecha_fin <= fechaFin)
        );

        if (!filtradas.length) {
            container.innerHTML = '<p class="text-center">No hay formaciones disponibles.</p>';
            return;
        }

        filtradas.forEach(f => {
            const item = document.createElement("div");
            item.className = "col-lg-3 col-md-6 mb-4";
            item.innerHTML = `
                <a class="portfolio-item" href="#!" data-curso="${f.titulo}" data-codigo="${f.codigo}">
                    <div class="caption">
                        <div class="caption-content">
                            <div class="h2">${f.titulo}</div>
                            <p class="mb-0">${f.descripcion}</p>
                        </div>
                    </div>
                    <img class="img-fluid" src="${f.imagen}" alt="${f.titulo}" />
                </a>
            `;
            item.querySelector('.portfolio-item').addEventListener('click', () => {
                abrirModalDesdeCurso(f);
            });
            container.appendChild(item);
        });
    }

    function prepararFiltroFamilia(formaciones, callback) {
        const contenedor = document.querySelector("#formaciones .row.mb-4");
        if (!contenedor) return;

        const select = document.createElement("select");
        select.id = "filtro-familia";
        select.className = "form-control mb-2";
        select.innerHTML = `<option value="">Todas las familias</option>`;

        const familias = [...new Set(formaciones.map(f => f.familia))];

        familias.forEach(fam => {
            const opcion = document.createElement("option");
            opcion.value = fam;
            opcion.setAttribute("data-i18n", equivalenciasFamilias[fam] || fam);
            opcion.textContent = fam;
            select.appendChild(opcion);
        });

        const columna = document.createElement("div");
        columna.className = "col-md-3 mb-2";
        columna.appendChild(select);
        contenedor.appendChild(columna);

        select.addEventListener("change", mostrarFormaciones);

        if (typeof callback === "function") callback();
    }

    function prepararFiltroPorCentro() {
        document.querySelectorAll(".centro[data-lugar]").forEach(el => {
            el.style.cursor = "pointer";
            el.addEventListener("click", () => {
                const lugar = el.dataset.lugar;
                const filtroCentro = document.getElementById("filtro-centro");
                if (filtroCentro) {
                    filtroCentro.value = lugar;
                    mostrarFormaciones();
                    document.getElementById("formaciones")?.scrollIntoView({ behavior: "smooth" });
                }
            });
        });
    }

    ["filtro-nombre", "filtro-codigo", "filtro-centro", "filtro-inicio", "filtro-fin"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("input", mostrarFormaciones);
    });

    window.filtrarFormaciones = mostrarFormaciones;
    window.getFormaciones = () => formaciones;
}
