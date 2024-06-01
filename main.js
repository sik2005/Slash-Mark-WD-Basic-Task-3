const API_KEY = '13bd76c72eb560bf85bf54ba7e50c9bd'; // Replace with your API key

document.getElementById('location-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const location = document.getElementById('location').value;
    getWeatherData(location);
});

document.getElementById('detect-location').addEventListener('click', function() {
    detectLocation();
});

function getWeatherData(location) {
    fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=metric`)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            document.getElementById('weather-result').innerHTML = `<p>Could not retrieve weather data</p>`;
        });
}

function displayWeather(data) {
    const resultDiv = document.getElementById('weather-result');
    if (data.cod !== "200") {
        resultDiv.innerHTML = `<p>${data.message}</p>`;
        return;
    }

    let output = `<h2>Weather Forecast for ${data.city.name}</h2>`;
    const todayData = data.list.find(item => new Date(item.dt_txt).getDate() === new Date().getDate());

    if (todayData) {
        const todayIcon = `http://openweathermap.org/img/wn/${todayData.weather[0].icon}.png`;
        const todayWeather = `
            <div class="weather-today">
                <h3>Today's Weather</h3>
                <p><strong>${new Date(todayData.dt_txt).toLocaleDateString()}</strong></p>
                <img src="${todayIcon}" alt="${todayData.weather[0].description}">
                <p>Temperature: ${todayData.main.temp} °C</p>
                <p>Weather: ${todayData.weather[0].description}</p>
                <p>Humidity: ${todayData.main.humidity}%</p>
            </div>
        `;
        output += todayWeather;
    }

    const filteredData = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 6);

    let row = '';
    filteredData.forEach((item, index) => {
        const weatherIcon = `http://openweathermap.org/img/wn/${item.weather[0].icon}.png`;

        const container = `
            <div class="weather-item" onclick="navigateToDetails('${item.dt_txt.split(' ')[0]}')">
                <p><strong>${new Date(item.dt_txt).toLocaleDateString()}</strong></p>
                <img src="${weatherIcon}" alt="${item.weather[0].description}">
                <p>Temperature: ${item.main.temp} °C</p>
                <p>Weather: ${item.weather[0].description}</p>
                <p>Humidity: ${item.main.humidity}%</p>
            </div>
        `;

        row += container;
    });

    output += `<div class="weather-row">${row}</div>`;
    resultDiv.innerHTML = output;

    window.weatherData = data.list;
}

function navigateToDetails(date) {
    const data = window.weatherData.filter(item => item.dt_txt.includes(date));
    localStorage.setItem('weatherDetails', JSON.stringify(data));
    window.location.href = 'details.html';
}

function detectLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
                .then(response => response.json())
                .then(data => {
                    const location = data.name;
                    document.getElementById('location').value = location;
                    getWeatherData(location);
                })
                .catch(error => {
                    console.error('Error detecting location:', error);
                });
        });
    } else {
        console.log('Geolocation is not supported by this browser.');
    }
}
