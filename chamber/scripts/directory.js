const container = document.querySelector('#members-container');
const toggleButtons = document.querySelectorAll('.toggle-btn');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const date = document.getElementById("lastModified");
date.innerHTML = `Last Modification: ${document.lastModified}`;
const year = document.querySelector("#currentyear");
year.innerHTML = new Date().getFullYear();


function setView(view) {
    if (!container) return;
    container.classList.remove('grid', 'list');
    container.classList.add(view);

    toggleButtons.forEach((button) => {
        const isActive = button.dataset.view === view;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });

    localStorage.setItem('directory-view', view);
}

function getMembershipLabel(level) {
    switch (level) {
        case 3:
            return 'Gold';
        case 2:
            return 'Silver';
        default:
            return 'Member';
    }
}

function renderMembers(members) {
    if (!container) return;

    container.innerHTML = members.map((member) => {
        const membershipLabel = getMembershipLabel(member['company membership level']);
        const website = member['company website'].startsWith('http')
            ? member['company website']
            : `https://${member['company website']}`;

        return `
            <article class="member-card">
                <img src="${member['company image']}" alt="${member['company name']} logo" loading="lazy">
                <div class="member-body">
                    <div class="member-heading">
                        <h3>${member['company name']}</h3>
                        <span class="membership-badge">${membershipLabel}</span>
                    </div>
                    <p class="member-description">${member.description}</p>
                    <p><strong>Industry:</strong> ${member.industry}</p>
                    <p><strong>Address:</strong> ${member['company address']}</p>
                    <p><strong>Phone:</strong> ${member['company phone number']}</p>
                    <a href="${website}" target="_blank" rel="noopener noreferrer">Visit website</a>
                </div>
            </article>
        `;
    }).join('');
}

async function loadMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error('Unable to load members');
        const members = await response.json();
        renderMembers(members);
        const savedView = localStorage.getItem('directory-view') || 'grid';
        setView(savedView);
    } catch (error) {
        if (container) {
            container.innerHTML = '<p class="status-message">Members could not be loaded right now.</p>';
        }
        console.error(error);
    }
}

menuToggle?.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
});

toggleButtons.forEach((button) => {
    button.addEventListener('click', () => setView(button.dataset.view));
});

loadMembers();