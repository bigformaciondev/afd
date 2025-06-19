export function initI18n(defaultLang = "es") {
  let currentLang = defaultLang;
  let translations = {};

  function cargarIdioma(lang) {
    fetch(`assets/i18n/${lang}/${lang}.json`)
      .then((res) => res.json())
      .then((data) => {
        translations = data;
        aplicarTraducciones();
        currentLang = lang;

        // Actualizar imagen de la bandera actual
        const flagMap = {
          es: "flag-icon-spain.svg",
          gl: "flag-icon-galician.svg",
          va: "flag-icon-valencia.svg",
        };
        document.getElementById(
          "current-flag"
        ).src = `assets/img/${flagMap[lang]}`;
      })
      .catch((err) => console.error("Error al cargar traducciones:", err));
  }

  // Vincular cambio de idioma al menú con banderas
  document.querySelectorAll(".dropdown-item[data-lang]").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const lang = item.getAttribute("data-lang");
      cargarIdioma(lang);
    });
  });

  function aplicarTraducciones() {
    // Texto interno
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (translations[key]) {
        el.textContent = translations[key];
      }
    });

    // Placeholder
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (translations[key]) {
        el.setAttribute("placeholder", translations[key]);
      }
    });

    // Title, etc.
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (translations[key]) {
        el.setAttribute("title", translations[key]);
      }
    });
  }

  // Exponer globalmente
  window.setLanguage = cargarIdioma;
  window.updateI18nTexts = aplicarTraducciones;

  // Carga inicial
  cargarIdioma(currentLang);
}
