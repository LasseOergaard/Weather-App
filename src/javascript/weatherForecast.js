import { openWeatherMapKEY } from "./apiKeys";
import moment from "moment";
async function getForecastData() {
  try {
    let cityName;
    if (document.querySelector(".search-city").value != "") {
      cityName = document.querySelector(".search-city").value;
    } else {
      cityName = "Esbjerg";
    }

    let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${openWeatherMapKEY}`;
    let response = await fetch(apiUrl);
    let data = await response.json();
    let days = getDays(data.list);
    days.forEach((day, i) => {
      let dayName = moment(day.dt_txt).format("dddd")
      let dayTemperature = Math.round((day.main.temp - 273.15)*10)/10;
      let dayFeelsLike = Math.round((day.main.feels_like -273.15)*10)/10;
      let dayIconUrl = getIconUrl(day.weather[0].icon)
      renderForecastDay(i, dayName, dayTemperature, dayFeelsLike, dayIconUrl)
    })


  } catch (error) {
    console.log(error);
  }
}

function getDays(data) {
  let output = [];
  for (let day of data) {
    if (
      day.dt_txt.includes("12:00:00") &&
      !day.dt_txt.includes(moment().format("YYYY-MM-DD"))
    ) {
      output.push(day)
    }
  }
  return output
}

function getIconUrl(iconName) {
  let iconApiUrl = `https://openweathermap.org/img/wn/${iconName}@2x.png`
  return iconApiUrl;
}

function renderForecastDay(i, dayName, dayTemperature, dayFeelsLike, dayIconUrl) {
  let currentDayDiv = document.querySelector(`.day${i+1}`)

  let currentDayName = document.querySelector(`.day${i+1} > .day`)
  currentDayName.innerText = dayName

  let currentDayTemp = document.querySelector(`.day${i+1} .day-temp .day-real-temp`)
  currentDayTemp.innerText = `${dayTemperature} °C`

  let currentDayFeelsLike = document.querySelector(`.day${i+1} > .day-temp > .day-feels-like`)
  currentDayFeelsLike.innerText = `${dayFeelsLike} °C`

  let currentDayIcon = document.querySelector(`.day${i+1} > img `)
  currentDayIcon.src = dayIconUrl;






}

getForecastData();

export { getForecastData }