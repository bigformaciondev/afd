import { initI18n } from './i18n.js';
import { initMenu } from "./menu.js";
import { initScrollToTop } from "./scrollToTop.js";
import { initFormaciones } from "./formaciones.js";
import { initModal } from "./modal.js";
import { initFormulario } from "./formulario.js"; // <- NUEVO

window.addEventListener("DOMContentLoaded", () => {
    initI18n('es');     // Primero, cargar traducciones e idioma
    initMenu();         // Luego inicializar menú y otros elementos de UI
    initScrollToTop();  // Scroll to top puede ir pronto también
    initModal();        // Inicializar modal antes que formulario
    initFormulario();   // Formulario depende del modal
    initFormaciones();  // Puede ir después; depende si usa traducciones o modales
});
