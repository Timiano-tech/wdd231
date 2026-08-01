const timestampInput = document.getElementById('timestamp');
const openLinks = document.querySelectorAll('[data-modal]');
const modals = document.querySelectorAll('.modal');

function setTimestamp() {
    if (!timestampInput) return;
    const now = new Date();
    timestampInput.value = now.toLocaleString('en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
}

function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
}

function handleModalClick(event) {
    event.preventDefault();
    const modalId = event.currentTarget.dataset.modal;
    if (modalId) {
        openModal(modalId);
    }
}

function handleDocumentKeydown(event) {
    if (event.key === 'Escape') {
        modals.forEach((modal) => closeModal(modal));
    }
}

function handleCloseClick(event) {
    const modal = event.currentTarget.closest('.modal');
    closeModal(modal);
}

function handleBackdropClick(event) {
    if (event.target.dataset.close === 'true') {
        const modal = event.currentTarget;
        closeModal(modal);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    setTimestamp();
    openLinks.forEach((link) => link.addEventListener('click', handleModalClick));
    modals.forEach((modal) => {
        modal.addEventListener('click', handleBackdropClick);
        const closeButton = modal.querySelector('.modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', handleCloseClick);
        }
    });
    document.addEventListener('keydown', handleDocumentKeydown);
});
