export function initMenu() {
    const sidebarWrapper = document.getElementById('sidebar-wrapper');
    const menuToggle = document.body.querySelector('.menu-toggle');
    const scrollTriggerList = document.querySelectorAll('.js-scroll-trigger');

    if (menuToggle) {
        menuToggle.addEventListener('click', event => {
            event.preventDefault();
            if (sidebarWrapper) {
                sidebarWrapper.classList.toggle('active');
            }
            _toggleMenuIcon();
            menuToggle.classList.toggle('active');
        });
    }
    scrollTriggerList.forEach(scrollTrigger => {
        scrollTrigger.addEventListener('click', () => {
            if (sidebarWrapper) {
                sidebarWrapper.classList.remove('active');
            }
            if (menuToggle) {
                menuToggle.classList.remove('active');
            }
            _toggleMenuIcon();
        });
    });

    function _toggleMenuIcon() {
        const menuToggleBars = document.querySelector('.menu-toggle > .fa-bars');
        const menuToggleTimes = document.querySelector('.menu-toggle > .fa-xmark');

        if (menuToggleBars) {
            menuToggleBars.classList.remove('fa-bars');
            menuToggleBars.classList.add('fa-xmark');
        }
        if (menuToggleTimes) {
            menuToggleTimes.classList.remove('fa-xmark');
            menuToggleTimes.classList.add('fa-bars');
        }
    }
}
