const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const errorMessage = document.getElementById('error-message');
const weatherCard = document.getElementById('weather-card');
const bgLayer = document.getElementById('background-layer');

const cityNameEl = document.getElementById('city-name');
const weatherDescEl = document.getElementById('weather-description');
const weatherIconEl = document.getElementById('weather-icon');
const tempValueEl = document.getElementById('temp-value');
const windSpeedEl = document.getElementById('wind-speed');
const humidityEl = document.getElementById('humidity');
const wittyCommentEl = document.getElementById('witty-comment');
const langToggleBtn = document.getElementById('lang-toggle');

let currentLang = 'en';
let lastWeatherCode = null;
let lastTemp = null;
let lastIsDay = null;

// Search Event Listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});
langToggleBtn.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'mz' : 'en';
    langToggleBtn.textContent = currentLang === 'en' ? 'EN / MZ' : 'MZ / EN';
    if (lastWeatherCode !== null) {
        wittyCommentEl.textContent = `"${getWittyComment(lastWeatherCode, lastTemp, lastIsDay)}"`;
    }
});

async function handleSearch() {
    const city = cityInput.value.trim();
    if (!city) {
        showError("Please enter a city name. I can't read your mind.");
        return;
    }

    try {
        setLoading(true);
        hideError();
        
        // 1. Get coordinates for the city
        const geoData = await fetchCoordinates(city);
        if (!geoData || !geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Did you make that up?");
        }
        
        const location = geoData.results[0];
        
        // 2. Get weather data using coordinates
        const weatherData = await fetchWeather(location.latitude, location.longitude);
        
        // 3. Update UI
        updateUI(location.name, weatherData.current);
        
    } catch (err) {
        showError(err.message);
        weatherCard.classList.add('hidden');
    } finally {
        setLoading(false);
    }
}

async function fetchCoordinates(city) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch location data.");
    return res.json();
}

async function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch weather data. The skies are not cooperating.");
    return res.json();
}

function updateUI(city, current) {
    // Show card
    weatherCard.classList.remove('hidden');
    
    // Set basic text
    cityNameEl.textContent = city;
    tempValueEl.textContent = Math.round(current.temperature_2m);
    windSpeedEl.textContent = `${current.wind_speed_10m} km/h`;
    humidityEl.textContent = `${current.relative_humidity_2m}%`;

    // Determine Weather info based on WMO code
    const weatherInfo = getWeatherInfo(current.weather_code, current.is_day);
    
    lastWeatherCode = current.weather_code;
    lastTemp = current.temperature_2m;
    lastIsDay = current.is_day;
    
    weatherDescEl.textContent = weatherInfo.description;
    weatherIconEl.innerHTML = `<i class="${weatherInfo.icon}"></i>`;
    
    // Set witty comment
    wittyCommentEl.textContent = `"${getWittyComment(current.weather_code, current.temperature_2m, current.is_day)}"`;

    // Set background
    bgLayer.className = weatherInfo.bgClass;
}

// WMO Weather interpretation codes
function getWeatherInfo(code, isDay) {
    // Default
    let info = { description: "Unknown", icon: "fa-solid fa-circle-question", bgClass: "bg-default" };

    if (code === 0) {
        info.description = "Clear sky";
        info.icon = isDay ? "fa-solid fa-sun" : "fa-solid fa-moon";
        info.bgClass = isDay ? "bg-clear" : "bg-clear-night";
    } else if (code >= 1 && code <= 3) {
        info.description = "Partly cloudy";
        info.icon = isDay ? "fa-solid fa-cloud-sun" : "fa-solid fa-cloud-moon";
        info.bgClass = "bg-clouds";
    } else if (code === 45 || code === 48) {
        info.description = "Fog";
        info.icon = "fa-solid fa-smog";
        info.bgClass = "bg-clouds";
    } else if ((code >= 51 && code <= 57) || (code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
        info.description = "Rain";
        info.icon = "fa-solid fa-cloud-rain";
        info.bgClass = "bg-rain";
    } else if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
        info.description = "Snow";
        info.icon = "fa-solid fa-snowflake";
        info.bgClass = "bg-snow";
    } else if (code >= 95 && code <= 99) {
        info.description = "Thunderstorm";
        info.icon = "fa-solid fa-cloud-bolt";
        info.bgClass = "bg-thunderstorm";
    }
    
    return info;
}

function getWittyComment(code, temp, isDay) {
    let comments = { en: [], mz: [] };

    // Temperature based comments (extreme)
    if (temp >= 35) {
        comments.en.push("The sun reminds us that all things must burn out eventually. Until then, enjoy sweating through your shirt.");
        comments.mz.push("Ni sa tak hian engkim a ral dawn tih min hriattir. Chu mi hma chu i thlan tla kha lo tuar hram hram rawh.");
    } else if (temp <= 0) {
        comments.en.push("In the freezing cold, we reflect on our own fragile existence. Also, on why we choose to live where the air hurts.");
        comments.mz.push("Khaw vawt ah hian kan derdep zia kan in hmu chhuak. Chu lo ah, engati nge thli in min chhem nat theihna hmunah kan awm reng le?");
    }

    // Weather condition based comments
    if (code === 0) { // Clear
        if (isDay) {
            comments.en.push("A clear sky offers boundless horizons, serving only to highlight your total lack of ambition today.");
            comments.mz.push("Van thengreng tak hian chinlem awmlo min hmuhtir a, vawiin a i that chhiat zia a rawn pholang chiang hle.");
        } else {
            comments.en.push("The infinite stars remind us of our complete insignificance. Try not to let it bruise your ego too much.");
            comments.mz.push("Arsi mawi tak tak te hian kan te zia min hriattir. I induhna kha a tih hniam phah lutuk loh nan fimkhur rawh.");
        }
    } else if (code >= 1 && code <= 3) { // Clouds
        comments.en.push("Even behind the darkest clouds, the sun still shines. It's just actively choosing to ignore you right now.");
        comments.mz.push("Chhum dum chhah tak karah pawh ni a la sa reng. Amah erawh chu tunah tak hi chuan a pehhel lui che a nih hi.");
    } else if ((code >= 51 && code <= 57) || (code >= 61 && code <= 67) || (code >= 80 && code <= 82)) { // Rain
        comments.en.push("Rain nourishes the earth, but mostly it just gives you a beautiful excuse to cancel all your plans and stay in bed.");
        comments.mz.push("Ruah in leilung a chawm nung a, mahse a tangkai ber chu chhuah loh chhuanlam tur tha tak min pe hi a ni.");
    } else if ((code >= 71 && code <= 77) || code === 85 || code === 86) { // Snow
        comments.en.push("Each snowflake is uniquely beautiful, just like everyone else. Which mathematically means none of us are special.");
        comments.mz.push("Vur tla tin te hi an mawi danglam bik theuh a, midang zawng zawng pawh. Chu chu tumah kan danglam bik lo tihna a ni.");
    } else if (code >= 95 && code <= 99) { // Thunderstorm
        comments.en.push("Chaos in the skies is a profound reflection of your life falling apart. Or maybe it's just a thunderstorm.");
        comments.mz.push("Van a khawpui ri dur dur te hi, i nun buai chuar mek zia tilang tu a ni. A nih loh pawhin khawpui a ri ve mai mai a niang.");
    }

    // Fallback if no specific comments match
    if (comments.en.length === 0) {
        comments.en.push("The weather simply is. Much like your problems, it's not going away just because you complain about it.");
        comments.mz.push("Khaw awmdan chu a thleng reng a ni. I buaina te ang chiah khan, i phun vang ringawt in a kiang dawn lo.");
    }

    // Pick a random comment from the applicable list
    const list = currentLang === 'en' ? comments.en : comments.mz;
    return list[Math.floor(Math.random() * list.length)];
}

function showError(msg) {
    errorMessage.textContent = msg;
}

function hideError() {
    errorMessage.textContent = "";
}

function setLoading(isLoading) {
    if (isLoading) {
        searchBtn.classList.add('loading');
        searchBtn.disabled = true;
    } else {
        searchBtn.classList.remove('loading');
        searchBtn.disabled = false;
    }
}

// Initial fetch based on user IP (optional, for now we just show default)
// For a wow effect, we could fetch weather for "London" by default, or just let them search.
cityInput.focus();
