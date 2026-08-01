const submissionDetails = document.getElementById('submission-details');
const currentYear = document.getElementById('currentyear');

function createDetailBlock(label, value) {
    const block = document.createElement('div');
    block.className = 'submission-detail';
    block.innerHTML = `<strong>${label}</strong><span>${value || 'Not provided'}</span>`;
    return block;
}

function renderSubmittedData() {
    if (!submissionDetails) return;
    const params = new URLSearchParams(window.location.search);
    const firstName = params.get('firstName');
    const lastName = params.get('lastName');
    const email = params.get('email');
    const phone = params.get('phone');
    const organization = params.get('organization');
    const timestamp = params.get('timestamp');

    const values = [
        ['First name', firstName],
        ['Last name', lastName],
        ['Email address', email],
        ['Mobile phone', phone],
        ['Business or organization', organization],
        ['Submitted on', timestamp],
    ];

    if (!firstName && !lastName && !email && !phone && !organization && !timestamp) {
        submissionDetails.innerHTML = '<p>We did not receive your submission details. Please use the form to submit again.</p>';
        return;
    }

    submissionDetails.innerHTML = '';
    values.forEach(([label, value]) => submissionDetails.appendChild(createDetailBlock(label, value)));
}

window.addEventListener('DOMContentLoaded', () => {
    renderSubmittedData();
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
});
