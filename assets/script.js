const APIKey = "96e6602198cf73c73eb7efc693fa0bdb";
const testCity = "Birmingham";
const currentWeatherElement = document.getElementById('current-weather-element');
const forecast0 = document.getElementById('forecast-0');
const forecast1 = document.getElementById('forecast-1');
const forecast2 = document.getElementById('forecast-2');
const forecast3 = document.getElementById('forecast-3');
const forecast4 = document.getElementById('forecast-4');

// Retrieve latitude and longitude for city input, using the Open Weather API.
function getOpenWeather(city) {
  const requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;
  fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const latitude = data.coord.lat;
      const longitude = data.coord.lon;
      getOneCallWeather(latitude, longitude);
    });
}

// Log all needed data from Open Call API.
function getOneCallWeather(latitude, longitude) {
  const requestURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts,minutely,hourly&appid=${APIKey}`;
  fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      const currentWeatherData = weatherForToday(data);
      displayCurrentWeather(currentWeatherData);
      const weatherForecastData = forecastWeatherData(data);
      displayWeatherForecast(weatherForecastData);
    });
}

function weatherForToday(data) {
  const icon = `${data.current.weather[0].icon}.png`;
  const temperature = getTemperature(data.current.temp);
  const humidity = `${data.current.humidity}%`;
  const windSpeed = getWindSpeed(data.current.wind_speed);
  const ultravioletIndex = Math.round(data.current.uvi);
  return { icon: icon, temperature: temperature, humidity: humidity, windSpeed: windSpeed, ultravioletIndex: ultravioletIndex};
}

// Function to take raw data of exact temp in Kelvin, and return rough temp in Celsius.
function getTemperature(kelvin) {
  const celsius = Math.round(kelvin - 273.15);
  return `${celsius}°C`
}

// Function to convert data to MPH, return to two decimal places.
function getWindSpeed(metersPerSecond) {
  const milesPerHour = Number.parseFloat(metersPerSecond / 0.44704).toFixed(2);
  return `${milesPerHour}mph`;
}

// jQuery form to retrieve user input, and get weather for location given by user.
const cityForm = $("#city-form");

cityForm.on("submit", submitCity);

function submitCity(event) {
  event.preventDefault();
  const city = $("input#city-input").val();
  console.log(city);
  getOpenWeather(city);
  $("input#city-input").val("");
}

// Function to write today's weather to the page. 
function displayCurrentWeather(collectedData) {
  currentWeatherElement.innerHTML =
    `<img id="today-img" src="icons/${collectedData.icon}" alt="An icon representing the weather conditions"><br/>
    Temperature: ${collectedData.temperature}<br/>
    Humidity: ${collectedData.humidity}<br/>
    Wind Speed: ${collectedData.windSpeed}<br/>
    UV Index: <span id="uv-element-${collectedData.ultravioletIndex}">${collectedData.ultravioletIndex}</span><br/>`;
}

// Function to collect forecast data for today and next 4 days
function forecastWeatherData(data) {
  let weatherForecastData = {
    day0: [],
    day1: [],
    day2: [],
    day3: [],
    day4: [],
  };
  const objectLocations = [weatherForecastData.day0, weatherForecastData.day1, weatherForecastData.day2, weatherForecastData.day3, weatherForecastData.day4];

  for (let i = 0; i < 5; i++) {
    const unixDate = data.daily[i].dt;
    const icon = `${data.daily[i].weather[0].icon}.png`;
    const temp = getTemperature(data.daily[i].temp.day);
    const humidity = `${data.daily[i].humidity}%`;
    const windSpeed = getWindSpeed(data.daily[i].wind_speed);

    const objectLocation = objectLocations[i];
    objectLocation.push(unixDate, icon, temp, humidity, windSpeed);
  }
  return weatherForecastData;
}

// Function to display forecast data for today and next 4 days
function displayWeatherForecast(weatherForecastData) {
  const forecastElements = [forecast0, forecast1, forecast2, forecast3, forecast4];
  const weatherData = [weatherForecastData.day0, weatherForecastData.day1, weatherForecastData.day2, weatherForecastData.day3, weatherForecastData.day4];
  for (let i = 0; i < forecastElements.length; i++) {
    const currentForecastElement = forecastElements[i];
    currentForecastElement.innerHTML =
    `<img class="forecast-img" src="icons/${weatherData[i][1]}" alt="An icon representing the weather conditions"><br>
    Temperature: ${weatherData[i][2]}<br/>
    Humidity: ${weatherData[i][3]}<br/>
    Wind Speed: ${weatherData[i][4]}<br/>`;
  };
}