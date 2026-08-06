import discoverItems from '../chamber/data/discover-items.mjs';

const discoverGrid = document.getElementById('discover-grid');
const visitMessage = document.getElementById('visit-message');
const yearElement = document.getElementById('currentyear');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

menuToggle?.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
});

function getVisitMessage() {
    const stored = localStorage.getItem('discover-last-visit');
    const now = Date.now();

    if (!stored) {
        localStorage.setItem('discover-last-visit', String(now));
        return 'Welcome! Let us know if you have any questions.';
    }

    const lastVisit = Number(stored);
    if (Number.isNaN(lastVisit)) {
        localStorage.setItem('discover-last-visit', String(now));
        return 'Welcome! Let us know if you have any questions.';
    }

    const msPerDay = 24 * 60 * 60 * 1000;
    const days = Math.floor((now - lastVisit) / msPerDay);
    localStorage.setItem('discover-last-visit', String(now));

    if (days === 0) {
        return 'Back so soon! Awesome!';
    }

    return `You last visited ${days} day${days === 1 ? '' : 's'} ago.`;
}

function renderDiscoverCards(items) {
    if (!discoverGrid) return;
    discoverGrid.innerHTML = items.map((item) => `
    <article class="discover-card" data-area="item-${item.id}">
      <h2>${item.name}</h2>
      <figure class="discover-image">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
      </figure>
      <address>${item.address}</address>
      <p>${item.description}</p>
      <button type="button">Learn more</button>
    </article>
  `).join('');
}

function init() {
    if (visitMessage) {
        visitMessage.textContent = getVisitMessage();
    }

    renderDiscoverCards(discoverItems);
}

init();
