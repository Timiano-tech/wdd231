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

const OPEN_WEATHER_API_KEY = '95a2166f72e15e0d2bec62152ea7f839';
const weatherLocation = {
    name: 'Lagos, NG',
    city: 'Lagos',
};
const homeWeatherElement = document.getElementById('home-weather');

function capitalize(text) {
    return text ? text[0].toUpperCase() + text.slice(1) : '';
}

function showHomeWeatherError(message) {
    if (homeWeatherElement) {
        homeWeatherElement.innerHTML = `<p class="status-message">${message}</p>`;
    }
}

function renderHomeWeather(data) {
    if (!homeWeatherElement) return;
    const description = capitalize(data.weather?.[0]?.description || 'No data');
    homeWeatherElement.innerHTML = `
        <div class="weather-heading">
            <span class="weather-location">${weatherLocation.name}</span>
            <span class="weather-temp">${Math.round(data.main.temp)}°C</span>
        </div>
        <p class="weather-description">${description}</p>
        <p class="weather-detail">Feels like ${Math.round(data.main.feels_like)}°C | Humidity ${data.main.humidity}%</p>
    `;
}

async function loadHomeWeather() {
    if (!OPEN_WEATHER_API_KEY) {
        showHomeWeatherError('Weather API key is needed to display live weather.');
        return;
    }

    const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(weatherLocation.city)}&units=metric&appid=${OPEN_WEATHER_API_KEY}`;

    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Weather service unavailable');
        const data = await response.json();
        renderHomeWeather(data);
    } catch (error) {
        console.error(error);
        showHomeWeatherError('Unable to load live weather at this time.');
    }
}


// Courses Data

const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        technology: ['Python'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        technology: ['HTML', 'CSS'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        technology: ['Python'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        technology: ['C#'],
        completed: false
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: false
    }
];

const courseList = document.getElementById('course-container');
const allBtn = document.getElementById('btn-all');
const cseBtn = document.getElementById('btn-cse');
const wddBtn = document.getElementById('btn-wdd');

// Function to display courses based on filter
function displayCourses(filter = 'all') {
    courseList.innerHTML = '';

    let filteredCourses = courses;
    let totalUnits = 0;

    if (filter === 'cse') {
        filteredCourses = courses.filter(course => course.subject === 'CSE');
        totalUnits = 6;
    } else if (filter === 'wdd') {
        filteredCourses = courses.filter(course => course.subject === 'WDD');
        totalUnits = 6;
    } else {
        totalUnits = 12;
    }

    filteredCourses.forEach(course => {
        const courseItem = document.createElement('div');
        courseItem.classList.add('course-item');
        courseItem.innerHTML = `
            <h3>${course.subject} ${course.number}: ${course.title}</h3>
            <p>Credits: ${course.credits}</p>
            <p>Technologies: ${course.technology.join(', ')}</p>
            <p>Status: ${course.completed ? 'Completed' : 'In Progress'}</p>
        `;
        courseList.appendChild(courseItem);
    });


    const unitsFooter = document.createElement('div');
    unitsFooter.classList.add('units-header');
    unitsFooter.innerHTML = `<p><strong>The total credit for courses listed above is ${totalUnits}</strong></p>`;
    courseList.appendChild(unitsFooter);
}

// Display all courses on page load
displayCourses('all');

// Add event listeners to buttons
allBtn.addEventListener('click', () => {
    displayCourses('all');
    updateButtonStyles('all');
});

cseBtn.addEventListener('click', () => {
    displayCourses('cse');
    updateButtonStyles('cse');
});

wddBtn.addEventListener('click', () => {
    displayCourses('wdd');
    updateButtonStyles('wdd');
});

// Function to update button styles
function updateButtonStyles(activeButton) {
    allBtn.classList.remove('active');
    cseBtn.classList.remove('active');
    wddBtn.classList.remove('active');

    if (activeButton === 'all') {
        allBtn.classList.add('active');
    } else if (activeButton === 'cse') {
        cseBtn.classList.add('active');
    } else if (activeButton === 'wdd') {
        wddBtn.classList.add('active');
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadHomeWeather();
});
