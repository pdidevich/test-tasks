import React, { useEffect, useState } from 'react';
import axios from "axios";
import ErrorNotice from './components/UI/ErrorNotice/ErrorNotice';
import Popup from './components/UI/Popup/Popup';
import Loader from './components/UI/Loader/Loader';

function App() {
  const HIDE_ERR_TIME = 5000
  const [tempMin, setTempMin] = useState('')
  const [tempMax, setTempMax] = useState('уточняется')
  const [cities, setCities] = useState([])
  const [city, setCity] = useState({ city: undefined, country: undefined, countryCode: undefined })
  const [isCitiesLoading, setIsCitiesLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorTimeout, setErrorTimeout] = useState()
  const [isCityPopup, setIsCityPopup] = useState(false)
  const [lastAjaxCountry, setLastAjaxCountry] = useState('')

  const saveCityToStorage = function () {
    Object.keys(city).forEach(key => {
      if (city[key]) {
        localStorage.setItem(key, city[key])
      }
    })
  }

  const setStartedPlace = async function () {
    let startedCity = {}
    Object.keys(city).forEach(key => {
      startedCity[key] = localStorage.getItem(key)
    })

    if (!startedCity.city || !startedCity.country || !startedCity.countryCode) {
      startedCity = await getPlaceByIp()
    }
    setCity(startedCity)
  }

  const getPlaceByIp = async function () {
    try {
      const response = await axios.get('http://ip-api.com/json/')
      return { city: response.data.city, country: response.data.country, countryCode: response.data.countryCode }
    } catch (e) {
      showError()
    }
  }

  const getCitiesByCountry = async function () {
    if (lastAjaxCountry === city.country) {
      return
    }
    setIsCitiesLoading(true)
    try {
      const response = await axios.post('https://countriesnow.space/api/v0.1/countries/cities', { country: city.country })
      setCities(response.data.data)
      setLastAjaxCountry(city.country)
    } catch (error) {
      showError(error)
    } finally {
      setIsCitiesLoading(false)
    }
  }

  const getWeather = async function () {
    if (city.city === undefined || city.country === undefined) {
      return null
    }
    try {
      const response = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
        params: {
          q: `${city.city},${city.country}`,
          appid: "f07469a72d6c0229d76ce7b76a2ed11e",
          units: "metric",
          lang: 'ru',
        }
      });
      setTempMax(response.data.main.temp_max);
      setTempMin(response.data.main.temp_min);
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

  const showCityPopup = function () {
    setIsCityPopup(true)
    getCitiesByCountry()
  }

  const selectNewCity = function (evt) {
    if (cities.includes(evt.target.value)) {
      setCity({ city: evt.target.value, country: city.country, countryCode: city.countryCode })
      setIsCityPopup(false)
    }
  }

  useEffect(() => {
    saveCityToStorage()
    getWeather()
  }, [city.country, city.countryCode, city.city])

  useEffect(() => {
    setStartedPlace()
  }, [])

  return (
    <div className="App">
      <div>Ваш город "{city.city}, {city.country}"</div>
      <div>Температура сегодня: {tempMin} - {tempMax} °C</div>
      <button onClick={showCityPopup}>Выбрать другой город {city.country}</button>
      {isError === true &&
        <ErrorNotice>
          Что-то пошло не так, попробуйте повторить позже.
        </ErrorNotice>
      }
      {isCityPopup === true &&
        <Popup hide={() => setIsCityPopup(false)}>
          <input type="text" placeholder="Укажите ваш город" list="countryCities" onChange={selectNewCity} />
          <datalist id="countryCities">
            {cities.map(city =>
              <option key={city} value={city} />
            )}
          </datalist>
          {isCitiesLoading && <Loader />}
        </Popup>
      }
    </div>
  );
}

export default App;
