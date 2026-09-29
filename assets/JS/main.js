
const navigationLinks = [...document.querySelectorAll('nav a[href^="#"]')];
const sections = navigationLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter((section) => section !== null);

const setCurrentNavigationLink = (activeSection) => {
    navigationLinks.forEach((link) => {
        if (link.hash === `#${activeSection.id}`) {
            link.setAttribute('aria-current', 'location');
        } else {
            link.removeAttribute('aria-current');
        }
    });
};

let navigationUpdatePending = false;

const updateCurrentSection = () => {
    if (navigationUpdatePending) {
        return;
    }

    navigationUpdatePending = true;
    const applyNavigationUpdate = () => {
        if (!navigationUpdatePending) {
            return;
        }

        const viewportCenter = window.innerHeight / 2;
        const activeSection = sections.find((section) => {
            const bounds = section.getBoundingClientRect();
            return bounds.top <= viewportCenter && bounds.bottom > viewportCenter;
        });

        if (activeSection) {
            setCurrentNavigationLink(activeSection);
        }

        navigationUpdatePending = false;
    };

    window.requestAnimationFrame(applyNavigationUpdate);
    window.setTimeout(applyNavigationUpdate, 100);
};

navigationLinks.forEach((link) => {
    link.addEventListener('click', () => {
        const targetSection = sections.find((section) => link.hash === `#${section.id}`);

        if (targetSection) {
            setCurrentNavigationLink(targetSection);
        }
    });
});

window.addEventListener('scroll', updateCurrentSection, { passive: true });
window.addEventListener('resize', updateCurrentSection);
updateCurrentSection();
