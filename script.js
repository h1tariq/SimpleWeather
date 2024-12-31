document.getElementById('city').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        getWeather(); // Trigger weather retrieval when the Enter key is pressed
    }
});

function getWeather() {
    const apiKey = 'c1a8b9caddfcc2ff7292b6d5f9627c9f';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city'); // Notify the user to input a city name
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    // Make a request for current weather data
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data); // Show the fetched current weather data
        })
        .catch(error => {
            console.error('Error occurred while fetching current weather:', error);
            alert('Unable to retrieve current weather data. Please try again.');
        });

    // Make a request for forecast data
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list); // Show the retrieved forecast details
        })
        .catch(error => {
            console.error('Error occurred while fetching forecast data:', error);
            alert('Unable to retrieve forecast data. Please try again.');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`; // Show error message if city not found
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert temperature from Kelvin to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        tempDivInfo.innerHTML = `<p>${temperature}°C</p>`; // Display temperature
        weatherInfoDiv.innerHTML = `
            <p>${cityName}</p>
            <p>${description}</p>
        `; // Display city and weather description
        weatherIcon.src = iconUrl; // Update the weather icon
        weatherIcon.alt = description;

        showImage(); // Ensure the weather icon is visible
    updateSunTimes(data);
    }
}

document.getElementById('home-button').addEventListener('click', function () {
    window.location.href = 'index.html'; // Redirect to home page when the button is clicked
});

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    hourlyForecastDiv.innerHTML = ''; // Clear existing forecast content

    const next24Hours = hourlyData.slice(0, 8); // Extract the forecast for the next 24 hours (8 intervals of 3 hours each)

    let hourlyForecastHtml = '';
    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert Unix timestamp to JavaScript Date object
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15); // Convert temperature from Kelvin to Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        hourlyForecastHtml += `
            <div class="hourly-item">
                <span>${hour}:00</span> <!-- Display time in hours -->
                <img src="${iconUrl}" alt="Hourly Weather Icon"> <!-- Show weather icon -->
                <span>${temperature}°C</span> <!-- Show temperature -->
            </div>
        `;
    });

    hourlyForecastDiv.innerHTML = hourlyForecastHtml; // Update the forecast section with new data
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; // Make the weather icon visible
}


function updateSunTimes(data) {
    const sunriseTimestamp = data.sys.sunrise;
    const sunsetTimestamp = data.sys.sunset;

    // Convert timestamps to local time
    const sunriseTime = new Date(sunriseTimestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunsetTime = new Date(sunsetTimestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Update DOM elements with sunrise and sunset times
    document.getElementById('Sunrise').textContent = sunriseTime;
    document.getElementById('sunset').textContent = sunsetTime;
}
