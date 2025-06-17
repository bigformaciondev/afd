import { initI18n } from './i18n.js';
import { initMenu } from "./menu.js";
import { initScrollToTop } from "./scrollToTop.js";
import { initFormaciones } from "./formaciones.js";
import { initModal } from "./modal.js";


window.addEventListener("DOMContentLoaded", () => {
   initFormaciones();
  initI18n('es'); 
  initMenu();
  initScrollToTop();
  initModal();
});