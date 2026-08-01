const OPEN_WEATHER_API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
const weatherLocation = {
    name: 'Lagos, NG',
    lat: 6.5244,
    lon: 3.3792,
};

const currentWeatherElement = document.getElementById('current-weather');
const forecastCardsElement = document.getElementById('forecast-cards');
const spotlightContainer = document.getElementById('spotlights-container');

function formatDay(timestamp) {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
}

function capitalize(text) {
    return text ? text[0].toUpperCase() + text.slice(1) : '';
}

function showWeatherError(message) {
    currentWeatherElement.innerHTML = `<p class="status-message">${message}</p>`;
    forecastCardsElement.innerHTML = '';
}

function renderWeather(data) {
    const current = data.current;
    const description = capitalize(current.weather[0]?.description || 'No data');
    currentWeatherElement.innerHTML = `
        <div class="weather-heading">
            <span class="weather-location">${weatherLocation.name}</span>
            <span class="weather-temp">${Math.round(current.temp)}C</span>
        </div>
        <p class="weather-description">${description}</p>
        <p class="weather-detail">Feels like ${Math.round(current.feels_like)}C5 m,vb/nL;'
        | Humidity ${current.humidity}%</p>
    `;

    forecastCardsElement.innerHTML = data.daily.slice(1, 4).map((day) => `
        <article class="forecast-item">
            <span>${formatDay(day.dt)}</span>
            <span>${Math.round(day.temp.max)}� / ${Math.round(day.temp.min)}�</span>
        </article>
    `).join('');
}

async function loadWeather() {
    if (!OPEN_WEATHER_API_KEY || OPEN_WEATHER_API_KEY === '0c66ef988f57ee3b854f5154dc8770b5') {
        showWeatherError('Add your OpenWeatherMap API key in scripts/home.js to display live weather.');
        return;
    }

    const endpoint = `https://api.openweathermap.org/data/2.5/onecall?lat=${weatherLocation.lat}&lon=${weatherLocation.lon}&exclude=minutely,hourly,alerts&units=metric&appid=${OPEN_WEATHER_API_KEY}`;

    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error('Weather service unavailable');
        }
        const weatherData = await response.json();
        renderWeather(weatherData);
    } catch (error) {
        console.error(error);
        showWeatherError('Weather data could not be loaded at this time.');
    }
}

function shuffleArray(array) {
    const items = [...array];
    for (let i = items.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
}

function getMembershipLabel(level) {
    return level === 3 ? 'Gold' : 'Silver';
}

function renderSpotlights(members) {
    spotlightContainer.innerHTML = members.map((member) => {
        const website = member['company website'].startsWith('http')
            ? member['company website']
            : `https://${member['company website']}`;

        return `
            <article class="spotlight-card">
                <img src="${member['company image']}" alt="${member['company name']} logo" loading="lazy">
                <div class="spotlight-body">
                    <div class="spotlight-header">
                        <h3>${member['company name']}</h3>
                        <span class="membership-badge">${getMembershipLabel(member['company membership level'])}</span>
                    </div>
                    <p>${member.description}</p>
                    <p><strong>Phone:</strong> ${member['company phone number']}</p>
                    <p><strong>Address:</strong> ${member['company address']}</p>
                    <a href="${website}" target="_blank" rel="noopener noreferrer">Visit website</a>
                </div>
            </article>
        `;
    }).join('');
}

async function loadSpotlights() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error('Unable to load member data');
        }
        const members = await response.json();
        const eligible = members.filter((member) => [2, 3].includes(member['company membership level']));
        const shuffled = shuffleArray(eligible);
        const count = Math.min(3, Math.max(2, shuffled.length));
        renderSpotlights(shuffled.slice(0, count));
    } catch (error) {
        console.error(error);
        spotlightContainer.innerHTML = '<p class="status-message">Member spotlights could not be loaded right now.</p>';
    }
}

function updateFooter() {
    const currentYear = document.getElementById('currentyear');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    updateFooter();
    loadWeather();
    loadSpotlights();
});
