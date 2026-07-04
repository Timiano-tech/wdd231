// Hamburger Menu Toggle
const hamburgerButton = document.querySelector('.hamburger-menu');
const navigation = document.querySelector('header nav');

if (hamburgerButton && navigation) {
    hamburgerButton.addEventListener('click', () => {
        const isOpen = hamburgerButton.classList.toggle('active');
        navigation.classList.toggle('open', isOpen);
        hamburgerButton.setAttribute('aria-expanded', String(isOpen));
        hamburgerButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });
}

// Footer Last Modified Date and Current Year

const date = document.getElementById("lastModified");
date.innerHTML = `Last Modification: ${document.lastModified}`;

const year = document.querySelector("#currentyear");
year.innerHTML = new Date().getFullYear();