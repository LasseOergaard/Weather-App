import { openWeatherMapKEY } from "./apiKeys";
import moment from "moment";
import { getForecastData } from "./weatherForecast";

/* Variables */

class CurrentWeatherDataObject {
  constructor(
    name,
    weather,
    temperature,
    feels_like,
    pressure,
    humidity,
    sunrise,
    sunset,
    windSpeed,
    timezone,
    windDirection
  ) {
    this.name = name;
    this.weather = weather;
    this.temperature = temperature;
    this.feels_like = feels_like;
    this.pressure = pressure;
    this.humidity = humidity;
    this.sunrise = sunrise;
    this.sunset = sunset;
    this.windSpeed = windSpeed;
    this.timezone = timezone;
    this.windDirection = windDirection;
  }
}

/* Elements */
const searchButton = document.querySelector(".submit-search-city");
searchButton.addEventListener("click", GetCityCurrentWeather);

async function GetCityCurrentWeather() {
  let searchError = document.querySelector(".search-error")

  try {

    let cityName;
    if (document.querySelector(".search-city").value != "") {
      cityName = document.querySelector(".search-city").value;
    } else {
      cityName = "Esbjerg";
    }

    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${openWeatherMapKEY}`;

    let response = await fetch(apiUrl);
    let data = await response.json();
    let currentWeather = new CurrentWeatherDataObject(
      data.name,
      data.weather,
      data.main.temp,
      data.main.feels_like,
      data.main.pressure,
      data.main.humidity,
      data.sys.sunrise,
      data.sys.sunset,
      data.wind.speed,
      data.timezone,
      data.wind.deg
    );

    loadWeatherBody(currentWeather);
    getForecastData();
    searchError.classList = "search-error-inactive search-error"
  } catch (error) {
    console.log(error);
    searchError.classList = "search-error-active search-error"
  }
}

function loadWeatherBody(WeatherData) {
  /* Weather Description */
  const weatherWeatherDiv = document.querySelector(".weather-weather");
  const weatherWeatherDescription = document.querySelector(
    ".weather-weather-description"
  );
  let descriptionString = WeatherData.weather[0].description;
  weatherWeatherDescription.innerText =
    descriptionString.charAt(0).toUpperCase() + descriptionString.slice(1);

  /* Weather Icon */
  let iconName = WeatherData.weather[0].icon;
  let iconUrl = `https://openweathermap.org/img/wn/${iconName}@2x.png`;
  const weatherIcon = document.querySelector(".weather-weather-icon");
  weatherIcon.src = iconUrl;

  /* City Name */
  const weatherName = document.querySelector(".weather-weather-name");
  weatherName.innerText = WeatherData.name;

  /* Date */
  let date = `${moment
    .utc(new Date().now)
    .add(WeatherData.timezone * 1000)
    .format("MMMM Do YYYY, h:mm:ss a")}`;
  const weatherDate = document.querySelector(".weather-weather-date");
  weatherDate.innerText = date;

  /* Temperature */
  const weatherTemp = document.querySelector(".weather-temp");

  const realTemp = document.querySelector(".real-temp");
  realTemp.innerText = `${Math.round((WeatherData.temperature - 273.15) * 10) / 10
  } °C`;


  const feelsLike = document.querySelector(".feels-like");
  feelsLike.innerText = `${
    Math.round((WeatherData.feels_like - 273.15) * 10) / 10
  } °C`;



  /* Pressure */
  const weatherPressure = document.querySelector(".weather-pressure");
  weatherPressure.innerText = `Pressure: ${WeatherData.pressure} hPa`;

  /* Humidity */
  const weatherHumidity = document.querySelector(".weather-humidity");
  weatherHumidity.innerText = `Humidity: ${WeatherData.humidity} %`;

  /* Sunrise */
  let sunriseDate = moment
    .utc(WeatherData.sunrise*1000)
    .add(WeatherData.timezone*1000)
    .format("HH:mm a");
  const weatherSunrise = document.querySelector(".weather-sunrise");
  weatherSunrise.innerText = `Sunrise: ${sunriseDate}`;

  /* Sunset */
  let sunsetDate = moment
    .utc(WeatherData.sunset*1000)
    .add(WeatherData.timezone*1000)
    .format("HH:mm a");
  const weatherSunset = document.querySelector(".weather-sunset");
  weatherSunset.innerText = `Sunset: ${sunsetDate}`;

  /* Wind */
  const weatherWind = document.querySelector(".weather-wind-speed");
  weatherWind.innerText = `Wind: ${WeatherData.windSpeed} m/s`;
  const weatherWindArrow = document.querySelector(".weather-wind-arrow ");
  weatherWindArrow.style = `transform: rotateZ(${WeatherData.windDirection}deg); display: block;`;
}

GetCityCurrentWeather();
