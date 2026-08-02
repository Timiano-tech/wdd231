const OPEN_WEATHER_API_KEY = '1bb53892b1e24f235003033b6bf14ec1';
const weatherLocation = {
    name: 'Lagos, NG',
    city: 'Lagos',
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
    forecastCardsElement.innerHTML = '<p class="status-message">Forecast unavailable.</p>';
}

function renderWeather(data) {
    const description = capitalize(data.weather[0]?.description || 'No data');
    currentWeatherElement.innerHTML = `
        <div class="weather-heading">
            <span class="weather-location">${weatherLocation.name}</span>
            <span class="weather-temp">${Math.round(data.main.temp)}°C</span>
        </div>
        <p class="weather-description">${description}</p>
        <p class="weather-detail">Feels like ${Math.round(data.main.feels_like)}°C | Humidity ${data.main.humidity}%</p>
    `;
}

function renderForecast(data) {
    const today = new Date().getDate();
    const daily = [];
    const daysSeen = new Set();

    for (const item of data.list) {
        const date = new Date(item.dt * 1000);
        const day = date.getDate();
        if (day === today) continue;
        if (date.getHours() === 12 && !daysSeen.has(day)) {
            daysSeen.add(day);
            daily.push(item);
        }
        if (daily.length === 3) break;
    }

    if (daily.length < 3) {
        for (const item of data.list) {
            const date = new Date(item.dt * 1000);
            const day = date.getDate();
            if (day === today || daysSeen.has(day)) continue;
            daysSeen.add(day);
            daily.push(item);
            if (daily.length === 3) break;
        }
    }

    if (!daily.length) {
        forecastCardsElement.innerHTML = '<p class="status-message">3-day forecast is unavailable.</p>';
        return;
    }

    forecastCardsElement.innerHTML = daily.map((item) => `
        <article class="forecast-item">
            <span>${formatDay(item.dt)}</span>
            <span>${Math.round(item.main.temp_max)}° / ${Math.round(item.main.temp_min)}°</span>
        </article>
    `).join('');
}

async function loadWeather() {
    if (!OPEN_WEATHER_API_KEY) {
        showWeatherError('Add your OpenWeatherMap API key in scripts/home.js to display live weather.');
        return;
    }

    const currentEndpoint = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(weatherLocation.city)}&units=metric&appid=${OPEN_WEATHER_API_KEY}`;
    const forecastEndpoint = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(weatherLocation.city)}&units=metric&appid=${OPEN_WEATHER_API_KEY}`;

    try {
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentEndpoint),
            fetch(forecastEndpoint),
        ]);

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error('Weather service unavailable');
        }

        const weatherData = await currentResponse.json();
        const forecastData = await forecastResponse.json();
        renderWeather(weatherData);
        renderForecast(forecastData);
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
