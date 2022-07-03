import React, { useEffect, useState } from 'react';
import axios from "axios";
import ErrorNotice from './components/UI/ErrorNotice/ErrorNotice';

function App() {
  const HIDE_ERR_TIME = 5000
  const [tempMin, setTempMin] = useState('')
  const [tempMax, setTempMax] = useState('уточняется')
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const [cities, setCities] = useState([])
  const [city, setCity] = useState({
    name: 'Moscow',
    country: 'Russia',
    countryCode: 'RU',
  })
  const [isCitiesLoading, setIsCitiesLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [errorTimeout, setErrorTimeout] = useState()

  const saveCityToStorage = function () {
    Object.keys(city).forEach(key => {
      if (city[key]) {
        localStorage.setItem(key, city[key])
      }
    })
  }

  const setStartedPlace = async function () {
    let startedCity = {
      name: localStorage.getItem('city'),
      country: localStorage.getItem('country'),
      countryCode: localStorage.getItem('countryCode'),
    }
    if (!startedCity.name || !startedCity.country || !startedCity.countryCode) {
      startedCity = await getPlaceByIp()
    }
    setCity(startedCity)
  }

  const getPlaceByIp = async function () {
    try {
      const response = await axios.get('http://ip-api.com/json/')
      return { name: response.data?.city, country: response.data?.country, countryCode: response.data?.countryCode }
    } catch (e) {
      showError()
    }
  }

  const getWeather = async function () {
    try {
      const response = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
        params: {
          q: `${city.name},${city.country}`,
          appid: "f07469a72d6c0229d76ce7b76a2ed11e",
          units: "metric",
          lang: 'ru',
        }
      });
      setTempMax(response.data?.main?.temp_max);
      setTempMin(response.data?.main?.temp_min);
    } catch (error) {
      showError()
    }
  }
  
  const showError = function () {
    if (errorTimeout) {
      window.clearTimeout(errorTimeout)
    }
    setErrorTimeout(window.setTimeout(() => { setIsError(false) }, HIDE_ERR_TIME))
    setIsError(true)
  }

  useEffect(() => {
    saveCityToStorage()
  }, [city.country, city.countryCode, city.name])

  useEffect(() => {
    async function fetchMyApp() {
      await setStartedPlace()
      getWeather()
    }
    fetchMyApp()
  }, [])

  return (
    <div className="App">
      <div>Ваш город "{city.name}, {city.country}"</div>
      <div>Температура сегодня: {tempMin} - {tempMax} °C</div>
      <button onClick={getWeather}>Выбрать другой город {city.country}</button>
      {isError === true &&
        <ErrorNotice>
          Что-то пошло не так, попробуйте повторить позже.
        </ErrorNotice>
      }
    </div>
  );
}

export default App;
