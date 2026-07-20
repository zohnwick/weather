/* ───────────────────────────────────────────────
   Witty Weather — app.js
   Refactored: state object, lookup tables, debounce,
   AbortController, geolocation, localStorage, typewriter,
   quote dedup, unit toggle, error categorization.
   ─────────────────────────────────────────────── */

// ── DOM Elements ──────────────────────────────
const dom = {
    cityInput:    document.getElementById('city-input'),
    searchBtn:    document.getElementById('search-btn'),
    geoBtn:       document.getElementById('geo-btn'),
    errorMessage: document.getElementById('error-message'),
    weatherCard:  document.getElementById('weather-card'),
    bgLayer:      document.getElementById('background-layer'),
    cityName:     document.getElementById('city-name'),
    weatherDesc:  document.getElementById('weather-description'),
    weatherIcon:  document.getElementById('weather-icon'),
    tempValue:    document.getElementById('temp-value'),
    unitLabel:    document.getElementById('unit-label'),
    unitToggle:   document.getElementById('unit-toggle'),
    windSpeed:    document.getElementById('wind-speed'),
    humidity:     document.getElementById('humidity'),
    wittyComment: document.getElementById('witty-comment'),
    langToggle:   document.getElementById('lang-toggle'),
    particles:    document.getElementById('weather-particles'),
    cycleQuoteBtn:document.getElementById('cycle-quote-btn'),
};

// ── Application State ─────────────────────────
const LANG_MODES = ['en', 'mz', 'lit'];

const state = {
    lang:            localStorage.getItem('ww-lang') || 'en',
    unit:            localStorage.getItem('ww-unit') || 'C',
    lastCity:        localStorage.getItem('ww-city') || '',
    weatherCode:     null,
    tempC:           null,       // always store Celsius
    isDay:           null,
    lastQuoteIndex:  -1,
    abortController: null,
    typewriterTimer: null,
};

// Restore persisted lang toggle label
dom.langToggle.textContent = state.lang.toUpperCase();
dom.unitLabel.textContent = state.unit === 'F' ? '°F' : '°C';

// ── Weather Lookup Table (WMO codes) ──────────
const WEATHER_MAP = {
    0:  { description: 'Clear sky',       iconDay: 'fa-solid fa-sun',        iconNight: 'fa-solid fa-moon',       bgDay: 'bg-clear',    bgNight: 'bg-clear-night' },
    1:  { description: 'Mainly clear',    iconDay: 'fa-solid fa-cloud-sun',  iconNight: 'fa-solid fa-cloud-moon', bgDay: 'bg-clouds',   bgNight: 'bg-clouds' },
    2:  { description: 'Partly cloudy',   iconDay: 'fa-solid fa-cloud-sun',  iconNight: 'fa-solid fa-cloud-moon', bgDay: 'bg-clouds',   bgNight: 'bg-clouds' },
    3:  { description: 'Overcast',        iconDay: 'fa-solid fa-cloud',      iconNight: 'fa-solid fa-cloud',      bgDay: 'bg-clouds',   bgNight: 'bg-clouds' },
    45: { description: 'Fog',             iconDay: 'fa-solid fa-smog',       iconNight: 'fa-solid fa-smog',       bgDay: 'bg-fog',      bgNight: 'bg-fog' },
    48: { description: 'Rime fog',        iconDay: 'fa-solid fa-smog',       iconNight: 'fa-solid fa-smog',       bgDay: 'bg-fog',      bgNight: 'bg-fog' },
    51: { description: 'Light drizzle',   iconDay: 'fa-solid fa-cloud-rain', iconNight: 'fa-solid fa-cloud-rain', bgDay: 'bg-rain',     bgNight: 'bg-rain' },
    53: { description: 'Drizzle',         iconDay: 'fa-solid fa-cloud-rain', iconNight: 'fa-solid fa-cloud-rain', bgDay: 'bg-rain',     bgNight: 'bg-rain' },
    55: { description: 'Dense drizzle',   iconDay: 'fa-solid fa-cloud-rain', iconNight: 'fa-solid fa-cloud-rain', bgDay: 'bg-rain',     bgNight: 'bg-rain' },
    56: { description: 'Freezing drizzle',iconDay: 'fa-solid fa-cloud-rain', iconNight: 'fa-solid fa-cloud-rain', bgDay: 'bg-rain',     bgNight: 'bg-rain' },
    57: { description: 'Heavy freezing drizzle', iconDay: 'fa-solid fa-cloud-rain', iconNight: 'fa-solid fa-cloud-rain', bgDay: 'bg-rain', bgNight: 'bg-rain' },
    61: { description: 'Slight rain',     iconDay: 'fa-solid fa-cloud-rain', iconNight: 'fa-solid fa-cloud-rain', bgDay: 'bg-rain',     bgNight: 'bg-rain' },
    63: { description: 'Moderate rain',   iconDay: 'fa-solid fa-cloud-rain', iconNight: 'fa-solid fa-cloud-rain', bgDay: 'bg-rain',     bgNight: 'bg-rain' },
    65: { description: 'Heavy rain',      iconDay: 'fa-solid fa-cloud-showers-heavy', iconNight: 'fa-solid fa-cloud-showers-heavy', bgDay: 'bg-rain', bgNight: 'bg-rain' },
    66: { description: 'Freezing rain',   iconDay: 'fa-solid fa-cloud-rain', iconNight: 'fa-solid fa-cloud-rain', bgDay: 'bg-rain',     bgNight: 'bg-rain' },
    67: { description: 'Heavy freezing rain', iconDay: 'fa-solid fa-cloud-showers-heavy', iconNight: 'fa-solid fa-cloud-showers-heavy', bgDay: 'bg-rain', bgNight: 'bg-rain' },
    71: { description: 'Slight snow',     iconDay: 'fa-solid fa-snowflake',  iconNight: 'fa-solid fa-snowflake',  bgDay: 'bg-snow',     bgNight: 'bg-snow' },
    73: { description: 'Moderate snow',   iconDay: 'fa-solid fa-snowflake',  iconNight: 'fa-solid fa-snowflake',  bgDay: 'bg-snow',     bgNight: 'bg-snow' },
    75: { description: 'Heavy snow',      iconDay: 'fa-solid fa-snowflake',  iconNight: 'fa-solid fa-snowflake',  bgDay: 'bg-snow',     bgNight: 'bg-snow' },
    77: { description: 'Snow grains',     iconDay: 'fa-solid fa-snowflake',  iconNight: 'fa-solid fa-snowflake',  bgDay: 'bg-snow',     bgNight: 'bg-snow' },
    80: { description: 'Light showers',   iconDay: 'fa-solid fa-cloud-rain', iconNight: 'fa-solid fa-cloud-rain', bgDay: 'bg-rain',     bgNight: 'bg-rain' },
    81: { description: 'Moderate showers',iconDay: 'fa-solid fa-cloud-rain', iconNight: 'fa-solid fa-cloud-rain', bgDay: 'bg-rain',     bgNight: 'bg-rain' },
    82: { description: 'Violent showers', iconDay: 'fa-solid fa-cloud-showers-heavy', iconNight: 'fa-solid fa-cloud-showers-heavy', bgDay: 'bg-rain', bgNight: 'bg-rain' },
    85: { description: 'Slight snow showers', iconDay: 'fa-solid fa-snowflake', iconNight: 'fa-solid fa-snowflake', bgDay: 'bg-snow',   bgNight: 'bg-snow' },
    86: { description: 'Heavy snow showers',  iconDay: 'fa-solid fa-snowflake', iconNight: 'fa-solid fa-snowflake', bgDay: 'bg-snow',   bgNight: 'bg-snow' },
    95: { description: 'Thunderstorm',    iconDay: 'fa-solid fa-cloud-bolt', iconNight: 'fa-solid fa-cloud-bolt', bgDay: 'bg-thunderstorm', bgNight: 'bg-thunderstorm' },
    96: { description: 'Thunderstorm with hail', iconDay: 'fa-solid fa-cloud-bolt', iconNight: 'fa-solid fa-cloud-bolt', bgDay: 'bg-thunderstorm', bgNight: 'bg-thunderstorm' },
    99: { description: 'Thunderstorm with heavy hail', iconDay: 'fa-solid fa-cloud-bolt', iconNight: 'fa-solid fa-cloud-bolt', bgDay: 'bg-thunderstorm', bgNight: 'bg-thunderstorm' },
};

const DEFAULT_WEATHER = { description: 'Unknown', iconDay: 'fa-solid fa-circle-question', iconNight: 'fa-solid fa-circle-question', bgDay: 'bg-default', bgNight: 'bg-default' };

function getWeatherInfo(code, isDay) {
    const entry = WEATHER_MAP[code] || DEFAULT_WEATHER;
    return {
        description: entry.description,
        icon:    isDay ? entry.iconDay : entry.iconNight,
        bgClass: isDay ? entry.bgDay   : entry.bgNight,
    };
}

// ── Quote Category Resolver ───────────────────
function getQuoteCategory(code, temp, isDay) {
    if (temp >= 35) return 'hot';
    if (temp <= 0)  return 'cold';
    if (code === 0)                                                         return isDay ? 'clearDay' : 'clearNight';
    if (code >= 1  && code <= 3)                                            return 'clouds';
    if (code === 45 || code === 48)                                         return 'fog';
    if ((code >= 51 && code <= 57) || (code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
    if ((code >= 71 && code <= 77) || code === 85 || code === 86)           return 'snow';
    if (code >= 95 && code <= 99)                                           return 'thunderstorm';
    return 'fallback';
}

// ── Date / Time Context ───────────────────────
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function getDateContext() {
    const now = new Date();
    const month = MONTH_NAMES[now.getMonth()];
    const period = now.getDate() <= 15 ? 'early in' : 'late in';
    const hour = now.getHours();
    let timeOfDay;
    if      (hour >= 5  && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
    else                              timeOfDay = 'night';
    return { month, period, timeOfDay };
}

// ── Witty Comment Generator (with dedup) ──────
function getWittyComment(code, temp, isDay) {
    const category = getQuoteCategory(code, temp, isDay);
    const pool     = QUOTES[category];
    if (!pool) return 'The weather defies description. Much like your fashion choices.';

    const lang = state.lang;
    const { month, period, timeOfDay } = getDateContext();

    if (lang === 'lit') {
        const litPool = pool.lit;
        if (!litPool || litPool.length === 0) return 'No literary wisdom for this weather. How pedestrian.';
        // Deduplicate: avoid last shown index
        let idx;
        if (litPool.length === 1) {
            idx = 0;
        } else {
            do { idx = Math.floor(Math.random() * litPool.length); }
            while (idx === state.lastQuoteIndex);
        }
        state.lastQuoteIndex = idx;
        return litPool[idx](month, period, timeOfDay);
    }

    // EN or MZ — plain string arrays
    const list = pool[lang] || pool.en;
    if (!list || list.length === 0) return 'The weather simply is.';
    let idx;
    if (list.length === 1) {
        idx = 0;
    } else {
        do { idx = Math.floor(Math.random() * list.length); }
        while (idx === state.lastQuoteIndex);
    }
    state.lastQuoteIndex = idx;
    return list[idx];
}

// ── Typewriter Effect ─────────────────────────
function typewriterDisplay(text, element) {
    // Clear any running typewriter
    if (state.typewriterTimer) {
        clearInterval(state.typewriterTimer);
        state.typewriterTimer = null;
    }

    if (state.lang !== 'lit') {
        element.textContent = `"${text}"`;
        element.classList.remove('typewriter-cursor');
        return;
    }

    // Typewriter for literary mode
    const fullText = `"${text}"`;
    element.textContent = '';
    element.classList.add('typewriter-cursor');
    let charIndex = 0;

    state.typewriterTimer = setInterval(() => {
        charIndex++;
        element.textContent = fullText.slice(0, charIndex);
        if (charIndex >= fullText.length) {
            clearInterval(state.typewriterTimer);
            state.typewriterTimer = null;
            // Remove cursor after a short pause
            setTimeout(() => element.classList.remove('typewriter-cursor'), 1500);
        }
    }, 28);
}

// ── Temperature Conversion ────────────────────
function displayTemp(tempC) {
    if (state.unit === 'F') {
        return Math.round((tempC * 9 / 5) + 32);
    }
    return Math.round(tempC);
}

// ── Debounce ──────────────────────────────────
function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

// ── API Fetchers ──────────────────────────────
async function fetchCoordinates(city, signal) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    try {
        const res = await fetch(url, { signal });
        if (!res.ok) throw { type: 'api', message: 'Location service returned an error. Try again.' };
        return res.json();
    } catch (err) {
        if (err.name === 'AbortError') throw err;
        if (err.type === 'api') throw err;
        throw { type: 'network', message: "Can't reach the location service. Check your internet connection." };
    }
}

async function fetchWeather(lat, lon, signal) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&timezone=auto`;
    try {
        const res = await fetch(url, { signal });
        if (!res.ok) throw { type: 'api', message: 'Weather service returned an error. The skies are not cooperating.' };
        return res.json();
    } catch (err) {
        if (err.name === 'AbortError') throw err;
        if (err.type === 'api') throw err;
        throw { type: 'network', message: "Can't reach the weather service. Check your internet connection." };
    }
}

// ── Reverse Geocoding (coordinates → city) ────
async function fetchCityFromCoords(lat, lon, signal) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=&latitude=${lat}&longitude=${lon}&count=1&language=en&format=json`;
    try {
        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`, { signal });
        if (res.ok) {
            const data = await res.json();
            return data.city || data.locality || data.principalSubdivision || 'Your Location';
        }
    } catch (_) { /* silently fall back */ }
    return 'Your Location';
}

// ── Core Search Handler ───────────────────────
async function handleSearch(cityOverride) {
    const city = cityOverride || dom.cityInput.value.trim().replace(/[<>]/g, '');
    if (!city) {
        showError("Please enter a city name. I can't read your mind.");
        return;
    }

    // Abort any in-flight request
    if (state.abortController) {
        state.abortController.abort();
    }
    state.abortController = new AbortController();
    const { signal } = state.abortController;

    try {
        setLoading(true);
        hideError();

        const geoData = await fetchCoordinates(city, signal);
        if (!geoData || !geoData.results || geoData.results.length === 0) {
            throw { type: 'api', message: "City not found. Did you make that up?" };
        }

        const location = geoData.results[0];
        const weatherData = await fetchWeather(location.latitude, location.longitude, signal);

        updateUI(location.name, weatherData.current);

        // Persist last city
        state.lastCity = location.name;
        localStorage.setItem('ww-city', location.name);

    } catch (err) {
        if (err.name === 'AbortError') return; // silently ignore aborted requests
        showError(err.message || 'Something went wrong.');
        dom.weatherCard.classList.add('hidden');
    } finally {
        setLoading(false);
    }
}

const debouncedSearch = debounce(() => handleSearch(), 300);

// ── Particle Generator ────────────────────────
function createParticles(weatherType, isDay) {
    const container = dom.particles;
    container.innerHTML = ''; // clear old particles

    if (weatherType === 'rain' || weatherType === 'thunderstorm') {
        // Raindrops — thin vertical lines falling at staggered intervals
        const count = weatherType === 'thunderstorm' ? 25 : 18;
        for (let i = 0; i < count; i++) {
            const drop = document.createElement('div');
            drop.className = 'particle-rain';
            drop.style.left     = `${Math.random() * 100}%`;
            drop.style.height   = `${12 + Math.random() * 20}px`;
            drop.style.opacity  = `${0.3 + Math.random() * 0.5}`;
            drop.style.animationDuration = `${1.5 + Math.random() * 1.5}s`;
            drop.style.animationDelay    = `${Math.random() * 3}s`;
            container.appendChild(drop);
        }
        // Lightning flashes for thunderstorm
        if (weatherType === 'thunderstorm') {
            for (let i = 0; i < 2; i++) {
                const flash = document.createElement('div');
                flash.className = 'particle-lightning';
                flash.style.animationDelay    = `${i * 3.5 + Math.random() * 2}s`;
                flash.style.animationDuration = `${5 + Math.random() * 4}s`;
                container.appendChild(flash);
            }
        }
    }

    else if (weatherType === 'snow') {
        // Snowflakes — small circles drifting diagonally
        for (let i = 0; i < 20; i++) {
            const flake = document.createElement('div');
            flake.className = 'particle-snow';
            const size = 3 + Math.random() * 5;
            flake.style.width  = `${size}px`;
            flake.style.height = `${size}px`;
            flake.style.left   = `${Math.random() * 100}%`;
            flake.style.opacity = `${0.4 + Math.random() * 0.5}`;
            flake.style.animationDuration = `${6 + Math.random() * 8}s`;
            flake.style.animationDelay    = `${Math.random() * 8}s`;
            container.appendChild(flake);
        }
    }

    else if (weatherType === 'clear' && isDay) {
        // Sun — glow orb + radiating rays
        const glow = document.createElement('div');
        glow.className = 'particle-sun-glow';
        container.appendChild(glow);

        for (let i = 0; i < 8; i++) {
            const ray = document.createElement('div');
            ray.className = 'particle-sunray';
            ray.style.transform = `rotate(${i * 22.5 - 10}deg)`;
            ray.style.opacity = `${0.1 + Math.random() * 0.2}`;
            ray.style.animationDelay = `${i * 0.8}s`;
            container.appendChild(ray);
        }
    }

    else if (weatherType === 'clear-night') {
        // Moon glow
        const moon = document.createElement('div');
        moon.className = 'particle-moon';
        container.appendChild(moon);

        // Twinkling stars
        for (let i = 0; i < 15; i++) {
            const star = document.createElement('div');
            star.className = 'particle-star';
            const size = 1.5 + Math.random() * 3;
            star.style.width  = `${size}px`;
            star.style.height = `${size}px`;
            star.style.top  = `${5 + Math.random() * 90}%`;
            star.style.left = `${5 + Math.random() * 90}%`;
            star.style.animationDuration = `${1.5 + Math.random() * 3}s`;
            star.style.animationDelay    = `${Math.random() * 3}s`;
            container.appendChild(star);
        }
    }

    else if (weatherType === 'clouds') {
        // Drifting cloud blobs
        for (let i = 0; i < 4; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'particle-cloud';
            const size = 60 + Math.random() * 80;
            cloud.style.width  = `${size}px`;
            cloud.style.height = `${size * 0.5}px`;
            cloud.style.top = `${10 + Math.random() * 60}%`;
            cloud.style.animationDuration = `${25 + Math.random() * 35}s`;
            cloud.style.animationDelay    = `${i * 8 + Math.random() * 5}s`;
            container.appendChild(cloud);
        }
    }

    else if (weatherType === 'fog') {
        // Horizontal fog bands drifting slowly
        for (let i = 0; i < 5; i++) {
            const band = document.createElement('div');
            band.className = 'particle-fog';
            band.style.height = `${20 + Math.random() * 30}px`;
            band.style.top = `${i * 20 + Math.random() * 10}%`;
            band.style.opacity = `${0.3 + Math.random() * 0.3}`;
            band.style.animationDuration = `${15 + Math.random() * 20}s`;
            band.style.animationDelay    = `${Math.random() * 8}s`;
            container.appendChild(band);
        }
    }
}

// ── UI Update ─────────────────────────────────
function updateUI(city, current) {
    dom.weatherCard.classList.remove('hidden');

    dom.cityName.textContent = city;
    state.tempC = current.temperature_2m;
    dom.tempValue.textContent = displayTemp(state.tempC);
    dom.unitLabel.textContent = state.unit === 'F' ? '°F' : '°C';
    dom.windSpeed.textContent = `${current.wind_speed_10m} km/h`;
    dom.humidity.textContent  = `${current.relative_humidity_2m}%`;

    const weatherInfo = getWeatherInfo(current.weather_code, current.is_day);

    state.weatherCode = current.weather_code;
    state.isDay       = current.is_day;

    dom.weatherDesc.textContent = weatherInfo.description;
    dom.weatherIcon.innerHTML   = `<i class="${weatherInfo.icon}"></i>`;

    // Witty comment
    const comment = getWittyComment(current.weather_code, current.temperature_2m, current.is_day);
    dom.wittyComment.classList.toggle('lit-mode', state.lang === 'lit');
    typewriterDisplay(comment, dom.wittyComment);

    // Background
    dom.bgLayer.className = weatherInfo.bgClass;

    // Card classes: base + palette
    dom.weatherCard.className = 'weather-card';
    const baseClass = weatherInfo.bgClass.replace('bg-', '');
    dom.weatherCard.classList.add(`palette-${baseClass}`);

    // Generate weather particles
    createParticles(baseClass, current.is_day);
}

// ── Geolocation ───────────────────────────────
async function handleGeolocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser.');
        return;
    }

    dom.geoBtn.classList.add('locating');

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            if (state.abortController) state.abortController.abort();
            state.abortController = new AbortController();
            const { signal } = state.abortController;

            try {
                setLoading(true);
                hideError();

                const { latitude, longitude } = position.coords;
                const [cityName, weatherData] = await Promise.all([
                    fetchCityFromCoords(latitude, longitude, signal),
                    fetchWeather(latitude, longitude, signal),
                ]);

                dom.cityInput.value = cityName;
                updateUI(cityName, weatherData.current);

                state.lastCity = cityName;
                localStorage.setItem('ww-city', cityName);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    showError(err.message || 'Failed to fetch weather for your location.');
                }
            } finally {
                setLoading(false);
                dom.geoBtn.classList.remove('locating');
            }
        },
        (err) => {
            dom.geoBtn.classList.remove('locating');
            if (err.code === err.PERMISSION_DENIED) {
                showError('Location access denied. Please search manually.');
            } else {
                showError('Unable to determine your location.');
            }
        },
        { enableHighAccuracy: false, timeout: 10000 }
    );
}

// ── UI Helpers ────────────────────────────────
function showError(msg) {
    dom.errorMessage.textContent = msg;
}

function hideError() {
    dom.errorMessage.textContent = '';
}

function setLoading(isLoading) {
    if (isLoading) {
        dom.searchBtn.classList.add('loading');
        dom.searchBtn.disabled = true;
    } else {
        dom.searchBtn.classList.remove('loading');
        dom.searchBtn.disabled = false;
    }
}

// ── Event Listeners ───────────────────────────

// Search
dom.searchBtn.addEventListener('click', debouncedSearch);
dom.cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') debouncedSearch();
});

// Geolocation
dom.geoBtn.addEventListener('click', handleGeolocation);

// Language toggle — cycles through array
dom.langToggle.addEventListener('click', () => {
    const currentIdx = LANG_MODES.indexOf(state.lang);
    const nextIdx = (currentIdx + 1) % LANG_MODES.length;
    state.lang = LANG_MODES[nextIdx];
    dom.langToggle.textContent = state.lang.toUpperCase();
    localStorage.setItem('ww-lang', state.lang);

    if (state.weatherCode !== null) {
        state.lastQuoteIndex = -1;
        const comment = getWittyComment(state.weatherCode, state.tempC, state.isDay);
        dom.wittyComment.classList.toggle('lit-mode', state.lang === 'lit');
        typewriterDisplay(comment, dom.wittyComment);
    }
});

// Temperature unit toggle
dom.unitToggle.addEventListener('click', () => {
    state.unit = state.unit === 'C' ? 'F' : 'C';
    dom.unitLabel.textContent = state.unit === 'F' ? '°F' : '°C';
    localStorage.setItem('ww-unit', state.unit);

    if (state.tempC !== null) {
        dom.tempValue.textContent = displayTemp(state.tempC);
    }
});

// Cycle quote button
dom.cycleQuoteBtn.addEventListener('click', () => {
    if (state.weatherCode !== null) {
        // We don't reset lastQuoteIndex here, so getWittyComment will naturally
        // pick a different one (since it has logic to avoid lastQuoteIndex)
        const comment = getWittyComment(state.weatherCode, state.tempC, state.isDay);
        
        // Add a small animation effect
        dom.wittyComment.style.opacity = '0';
        setTimeout(() => {
            typewriterDisplay(comment, dom.wittyComment);
            dom.wittyComment.style.opacity = '1';
        }, 200);
    }
});

// ── Initialization ────────────────────────────
(function init() {
    dom.cityInput.focus();

    // If we have a saved city, auto-load it
    if (state.lastCity) {
        dom.cityInput.value = state.lastCity;
        handleSearch(state.lastCity);
    } else {
        // Try geolocation on first visit
        if (navigator.geolocation) {
            handleGeolocation();
        }
    }
})();
