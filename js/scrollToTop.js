import { fadeIn, fadeOut } from './animaciones.js';

export function initScrollToTop() {
    let scrollToTopVisible = false;
    const scrollToTop = document.querySelector('.scroll-to-top');

    document.addEventListener('scroll', () => {
        if (document.documentElement.scrollTop > 100) {
            if (!scrollToTopVisible) {
                fadeIn(scrollToTop);
                scrollToTopVisible = true;
            }
        } else {
            if (scrollToTopVisible) {
                fadeOut(scrollToTop);
                scrollToTopVisible = false;
            }
        }
    });
}
