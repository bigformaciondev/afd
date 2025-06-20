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

            prepararBotonCargarMas();

            // Mostrar formaciones inicialmente
            mostrarFormaciones();
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
    /*
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
*/
    function renderFormaciones() {
        const container = document.getElementById("formaciones-container");

        const cursosAMostrar = resultadosFiltrados.slice(container.childElementCount, cantidadMostrada);
        const delayBase = 100; // ms por tarjeta

        cursosAMostrar.forEach((f, index) => {
            const imagen = imagenesFamilias[f.familia] || "assets/img/portfolio-2.webp";
            const item = document.createElement("div");
            item.className = "col-lg-3 col-md-6 mb-4 curso-animado";
            item.style.animationDelay = `${index * delayBase}ms`;

            // Construimos el HTML con centro visible y espacio para descripción futura
            item.innerHTML = `
            <div class="card rounded-4 hover-scale shadow text-center h-100 me-5">
              <div class="card-header rounded-top bg-primary p-0">
                <img class="card-img-top rounded-top" src="${imagen}" 
                     style="width: 100%; height: 200px; object-fit: cover;" 
                     alt="${f.especialidad}" onerror="this.src='assets/img/portfolio-2.webp'">
              </div>
              <div class="card-body d-flex flex-column justify-content-start" style="height: 280px;">
                <span class="badge bg-secondary mb-2" data-i18n="familias.${f.familia.toUpperCase()}">${f.familia}</span>
                <h4 class="mt-2">${f.especialidad}</h4>
                <p class="text-muted small mb-1">${f.provincia}</p> <!-- Campo centro/provincia -->
                <p class="descripcion-futura text-truncate">
                  <!-- Aquí la descripción futura -->
                </p>
              </div>
              <div class="card-footer p-3">
                <a href="#" class="btn btn-gradient btn-gradient-filled w-100" 
                   aria-label="Acceder a ${f.especialidad}" data-i18n="accede">Acceder</a>
              </div>
            </div>
        `;

            // Evento para abrir modal con datos de la formación
            item.querySelector("a.btn").addEventListener("click", (e) => {
                e.preventDefault();
                abrirModalDesdeCurso(f);
            });

            container.appendChild(item);
        });

        const wrapper = document.getElementById("formaciones-cargar-mas");
        if (wrapper) {
            wrapper.style.display = resultadosFiltrados.length > container.childElementCount ? "block" : "none";
        }

        // Aplicar traducciones si usas i18next (ajusta esta parte a tu motor)
        if (window.updateI18nTexts) {
            window.updateI18nTexts();
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

    function initFiltroCentros() {
        document.querySelectorAll('#centros .centro').forEach(centroDiv => {
            centroDiv.addEventListener('click', () => {
                const lugar = centroDiv.getAttribute('data-lugar');
                const filtroCentro = document.getElementById('filtro-centro');
                if (filtroCentro) {
                    filtroCentro.value = lugar;
                    filtroCentro.dispatchEvent(new Event('change'));
                }
                document.querySelectorAll('#centros .centro').forEach(c => c.classList.remove('activo'));
                centroDiv.classList.add('activo');
            });
        });
    }

    initFiltroCentros();
    // Inputs de texto -> escuchan "input"
    ["filtro-nombre", "filtro-codigo"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("input", mostrarFormaciones);
    });

    // Selects -> escuchan "change"
    ["filtro-centro", "filtro-familia", "filtro-modalidad"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("change", mostrarFormaciones);
    });

    window.filtrarFormaciones = mostrarFormaciones;
    window.getFormaciones = () => formaciones;
}
