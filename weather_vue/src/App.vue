<!-- TODO LIST
1. Add countries
2. Check the population of cities to show small amount of cities buttons
3. Divide into more components
 -->
<template>
  <Popup v-model:show="isPopupVisible">
    <h1>Выберете город</h1>
    <MyLoader v-model:show="isCitiesLoading" />
    <div v-if="cities.length > 0">
      <input type="text" placeholder="Укажите ваш город" list="cities" @change="setCity" />
      <datalist id="cities">
        <option v-for="(city, index) in cities" :key="index">{{ city }}</option>
      </datalist>
    </div>
  </Popup>
  <ErrorNotice v-model:show="isError"></ErrorNotice>
  <div>Ваш город "{{ city.name }}, {{ city.country }}"</div>
  <div>Температура сегодня: {{ this.tempMin }} - {{ this.tempMax }} °C</div>
  <button @click="showCityPopup">Выбрать другой город {{ city.country }}</button>
</template>

<script>
import axios from 'axios';
import Popup from './components/UI/Popup.vue';
import ErrorNotice from './components/UI/ErrorNotice.vue';
import MyLoader from './components/UI/MyLoader.vue';

export default {
  data() {
    return {
      tempMin: '',
      tempMax: 'уточняется',
      isPopupVisible: false,
      cities: [],
      countries: [],
      city: {
        name: 'Moscow',
        country: 'Russia',
        countryCode: 'RU',
      },
      country: {
        name: 'Russia',
        code: 'RU'
      },
      isCitiesLoading: true,
      isError: false,
    };
  },
  watch: {
    city(newVal) {
      this.getWeather()
      this.saveCityToLocalStorage(newVal)
    }
  },
  methods: {
    saveCityToLocalStorage(city) {
      Object.keys(city).forEach(key => {
        if (city[key]) {
          localStorage.setItem(key, city[key])
        }
      })
    },
    showError() {
      this.isError = true
      window.setTimeout(() => { this.isError = false }, 5000)
    },
    async getStartedPlace() {
      let city = {
        name: localStorage.getItem('city'),
        country: localStorage.getItem('country'),
        countryCode: localStorage.getItem('countryCode'),
      }

      if (!city.name || !city.country || !city.countryCode) {
        city = await this.getCityByIp()
      }

      this.city = city
    },
    async getCityByIp() {
      try {
        const response = await axios.get('http://ip-api.com/json/')
        return { name: response.data.city, country: response.data.country, countryCode: response.data.countryCode }
      } catch (e) {
        this.showError()
      }
    },
    setCity(evt) {
      this.city = { name: evt.target.value, country: this.city.country, countryCode: this.city.countryCode }
    },
    showCityPopup() {
      this.isPopupVisible = true
      this.getCitiesByCountry()
    },
    async getCitiesByCountry() {
      try {
        const response = await axios.post('https://countriesnow.space/api/v0.1/countries/cities', { country: this.city.country })
        this.cities = response.data.data
        this.isCitiesLoading = false
      } catch (error) {
        this.showError()
      }

    },
    async getWeather() {
      try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: {
            q: `${this.city.name},${this.city.country}`,
            appid: 'f07469a72d6c0229d76ce7b76a2ed11e',
            units: 'metric',
            lang: 'ru',
          }
        });
        this.tempMax = response.data.main.temp_max;
        this.tempMin = response.data.main.temp_min;
      } catch (error) {
        this.showError()
      }
    }
  },
  async mounted() {
    await this.getStartedPlace()
    await this.getWeather()
  },
  components: { Popup, MyLoader, ErrorNotice }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
