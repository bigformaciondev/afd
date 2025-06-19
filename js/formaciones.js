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
    let resultadosFiltrados = [];
    let cantidadMostrada = 12;

    const imagenesFamilias = {
        AFD: "assets/img/familias/afd.webp",
        ADG: "assets/img/familias/administracion.webp",
        AGA: "assets/img/familias/agraria.webp",
        ARG: "assets/img/familias/artes-graficas.webp",
        ART: "assets/img/familias/artes-artesanias.webp",
        COM: "assets/img/familias/marketing.webp",
        EOC: "assets/img/familias/edificacion.webp",
        ELE: "assets/img/familias/electronica.webp",
        ENA: "assets/img/familias/energia.webp",
        FME: "assets/img/familias/mecanica.webp",
        HOT: "assets/img/familias/turismo.webp",
        IMP: "assets/img/familias/imagen-personal.webp",
        IMS: "assets/img/familias/imagen-sonido.webp",
        INA: "assets/img/familias/alimentaria.webp",
        IEX: "assets/img/familias/extractivas.webp",
        IFC: "assets/img/familias/informatica.webp",
        IMA: "assets/img/familias/instalacion.webp",
        MAM: "assets/img/familias/madera.webp",
        MAP: "assets/img/familias/maritimo.webp",
        QUI: "assets/img/familias/quimica.webp",
        SAN: "assets/img/familias/sanidad.webp",
        SEA: "assets/img/familias/medioambiente.webp",
        SSC: "assets/img/familias/sociocultural.webp",
        TCP: "assets/img/familias/textil.webp",
        TMV: "assets/img/familias/vehiculos.webp",
        VIC: "assets/img/familias/vidrio.webp"
    };

    fetch("assets/data/formaciones_2025_2026.json")
        .then(res => res.json())
        .then(data => {
            formaciones = data.AFD || [];
            prepararFiltroFamilia(formaciones, mostrarFormaciones);
            prepararFiltroModalidad(formaciones);
            prepararBotonCargarMas();
        })
        .catch(err => console.error("Error cargando formaciones:", err));

    function mostrarFormaciones() {
        const container = document.getElementById("formaciones-container");
        const nombre = document.getElementById("filtro-nombre")?.value.toLowerCase() || "";
        const codigo = document.getElementById("filtro-codigo")?.value.toLowerCase() || "";
        const provincia = document.getElementById("filtro-centro")?.value || "";
        const familia = document.getElementById("filtro-familia")?.value || "";
        const modalidad = document.getElementById("filtro-modalidad")?.value || "";

        container.innerHTML = "";
        cantidadMostrada = 12;

        resultadosFiltrados = formaciones.filter(f =>
            f.especialidad?.toLowerCase().includes(nombre) &&
            f.codigo?.toLowerCase().includes(codigo) &&
            (!provincia || f.provincia === provincia) &&
            (!familia || f.familia === familia) &&
            (!modalidad || f.modalidad === modalidad)
        );

        if (!resultadosFiltrados.length) {
            container.innerHTML = `<p class="text-center" data-i18n="formaciones.no_disponibles">No hay formaciones disponibles.</p>`;
            return;
        }

        renderFormaciones();
    }

    function renderFormaciones() {
        const container = document.getElementById("formaciones-container");

        const cursosAMostrar = resultadosFiltrados.slice(container.childElementCount, cantidadMostrada);
        const delayBase = 100; // ms por tarjeta

        cursosAMostrar.forEach((f, index) => {
            const imagen = imagenesFamilias[f.familia] || "assets/img/portfolio-2.webp";
            const item = document.createElement("div");
            item.className = "col-lg-3 col-md-6 mb-4 curso-animado";
            item.style.animationDelay = `${index * delayBase}ms`;

            item.innerHTML = `
            <a class="portfolio-item"  data-curso="${f.especialidad}" data-codigo="${f.codigo}">
                <div class="caption">
                    <div class="caption-content">
                        <div class="h2">${f.especialidad}</div>
                        <p class="mb-0">${f.modalidad} - ${f.localidad}</p>
                    </div>
                </div>
                <img class="img-fluid" src="${imagen}" alt="${f.especialidad}" onerror="this.src='assets/img/portfolio-2.webp'" />
            </a>
        `;

            item.querySelector('.portfolio-item').addEventListener('click', () => {
                abrirModalDesdeCurso(f);
            });

            container.appendChild(item);
        });

        const wrapper = document.getElementById("formaciones-cargar-mas");
        if (wrapper) {
            wrapper.style.display = resultadosFiltrados.length > container.childElementCount ? 'block' : 'none';
        }
    }


    function prepararBotonCargarMas() {
        const boton = document.getElementById("btn-cargar-mas");
        const wrapper = document.getElementById("formaciones-cargar-mas");

        if (!boton || !wrapper) {
            console.warn("Botón o contenedor 'Cargar más' no encontrados en el DOM.");
            return;
        }

        boton.addEventListener("click", () => {

            setTimeout(() => {
                cantidadMostrada += 12;
                renderFormaciones();
            }, 300); // puedes aumentar el tiempo si la animación es pesada
        });
    }


    function prepararFiltroFamilia(formaciones, callback) {
        const contenedor = document.querySelector("#formaciones .row.mb-4");
        if (!contenedor) return;

        const select = document.createElement("select");
        select.id = "filtro-familia";
        select.className = "form-control mb-2";
        select.innerHTML = `<option value="" data-i18n="formaciones.todas_familias">Todas las familias</option>`;

        const familias = [...new Set(formaciones.map(f => f.familia).filter(Boolean))].sort();
        familias.forEach(fam => {
            const opcion = document.createElement("option");
            opcion.value = fam;
            opcion.setAttribute("data-i18n", `familias.${fam}`);
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

    function prepararFiltroModalidad(formaciones) {
        const contenedor = document.querySelector("#formaciones .row.mb-4");
        if (!contenedor) return;

        const select = document.createElement("select");
        select.id = "filtro-modalidad";
        select.className = "form-control mb-2";
        select.innerHTML = `<option value="" data-i18n="formaciones.todas_modalidades">Todas las modalidades</option>`;

        const modalidades = [...new Set(formaciones.map(f => f.modalidad).filter(Boolean))].sort();
        modalidades.forEach(mod => {
            const opcion = document.createElement("option");
            opcion.value = mod;
            opcion.setAttribute("data-i18n", `modalidades.${mod}`);
            opcion.textContent = mod;
            select.appendChild(opcion);
        });

        const columna = document.createElement("div");
        columna.className = "col-md-2 mb-2";
        columna.appendChild(select);
        contenedor.appendChild(columna);

        select.addEventListener("change", mostrarFormaciones);
    }

    ["filtro-nombre", "filtro-codigo", "filtro-centro"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("input", mostrarFormaciones);
    });

    window.filtrarFormaciones = mostrarFormaciones;
    window.getFormaciones = () => formaciones;
}
