document.addEventListener('DOMContentLoaded', function() {
  const weatherDetails = JSON.parse(localStorage.getItem('weatherDetails'));
  if (!weatherDetails) {
      document.getElementById('weather-details').innerHTML = '<p>No weather details available</p>';
      return;
  }

  const detailsDiv = document.getElementById('weather-details');
  const selectedDate = new Date(weatherDetails[0].dt_txt).toDateString();
  let detailsHtml = `<h2>Weather Details for ${selectedDate}</h2>`;

  weatherDetails.forEach(item => {
      const weatherIcon = `http://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
      detailsHtml += `
          <div class="weather-more-details">
              <p><strong>${new Date(item.dt_txt).toLocaleTimeString()}</strong></p>
              <img src="${weatherIcon}" alt="${item.weather[0].description}">
              <p>Temperature: ${item.main.temp} °C</p>
              <p>Weather: ${item.weather[0].description}</p>
              <p>Humidity: ${item.main.humidity}%</p>
              <p>Pressure: ${item.main.pressure} hPa</p>
              <p>Wind Speed: ${item.wind.speed} m/s</p>
          </div>
      `;
  });

  detailsDiv.innerHTML = detailsHtml;

  const times = weatherDetails.map(item => new Date(item.dt_txt).toLocaleTimeString());
  const temps = weatherDetails.map(item => item.main.temp);

  const ctx = document.createElement('canvas');
  ctx.id = 'weatherChart';
  detailsDiv.appendChild(ctx);

  new Chart(ctx, {
      type: 'line',
      data: {
          labels: times,
          datasets: [{
              label: 'Temperature (°C)',
              data: temps,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              x: {
                  beginAtZero: true
              },
              y: {
                  beginAtZero: true
              }
          }
      }
  });

  const style = document.createElement('style');
  style.innerHTML = `
      #weather-details {
          max-height: 600px;
          overflow-y: auto;
      }
      .weather-more-details {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
      }
      .weather-more-details img {
          margin-right: 20px;
      }
      .weather-more-details p {
          margin: 0 10px;
      }
      canvas#weatherChart {
          margin-top: 20px;
      }
  `;
  document.head.appendChild(style);
});
