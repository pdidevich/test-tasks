<!-- TODO LIST
1. Add countries
2. Add error component
3. Check the population of cities to show small amount of cities buttons
4. Divide into more components
 -->
<template>
  <Popup v-model:show="isPopupVisible">
      <h1>Выберете город</h1>
      <MyLoader v-model:show="isCitiesLoading"/>
      <div v-if="cities.length > 0 && isCityPopup">
        <input type="text" placeholder="Укажите ваш город" list="cities" @change="setCity"/>
        <datalist id="cities">
          <option v-for="(city, index) in cities" :key="index">{{city}}</option>
        </datalist>
      </div>
  </Popup>  
  <div>Ваш город "{{city.name}}, {{city.country}}"</div>
  <div>Температура сегодня: {{this.tempMin}} - {{this.tempMax}} °C</div>
  <button @click="showCityPopup">Выбрать другой город {{city.country}}</button>
</template>

<script>
  import axios from 'axios';
  import Popup from './components/UI/Popup.vue';
  import MyLoader from './components/UI/MyLoader.vue';

  export default {
    data() {
        return {
            tempMin: "",
            tempMax: "уточняется",
            isPopupVisible: false,
            cities: [],
            countries: [],
            city: {
              name: 'Moscow',
              country: 'Russia',
              countryCode: 'RU',
           },
           country: {name: 'Russia', code: 'RU'},
           isCityPopup: true,
           isCitiesLoading: true,
        };
    },
    watch: {
      city(newVal, oldVal) {
        this.getWeather()
      }
    },
    methods: {
      async setStartedPlace() {
          let city = {
              name: localStorage.getItem('city'),
              country: localStorage.getItem('country'),
              countryCode: localStorage.getItem('countryCode'),
          }
          if (!city.name || !city.country || !city.countryCode) {
            city = await this.getPlaceByIp()
          }

          if (city.name) {
              localStorage.setItem('city', city.name)
          }

          if (city.country) {
              localStorage.setItem('country', city.country)
          }

          if (city.countryCode) {
              localStorage.setItem('countryCode', city.countryCode)
          }
          this.city = city
      },
      async getPlaceByIp() {
          try {
              const response = await axios.get('http://ip-api.com/json/')
              return {name: response.data?.city, country: response.data?.country, countryCode: this.response.data?.countryCode}
            } catch (e) {
              //TODO error component
              console.error(e)
            }
      },
      setCity(evt) {
        this.city = {name: evt.target.value, country:  this.city.country, countryCode: this.city.countryCode}
      },
      showCityPopup() {
        this.isPopupVisible = true
        this.isCityPopup = true
        this.getCitiesByCountry()
      },
      async getCitiesByCountry() {
        try {
          const response = await axios.post('https://countriesnow.space/api/v0.1/countries/cities', {country: this.city.country})
          this.cities = response.data?.data
          this.isCitiesLoading = false
        } catch(error) {
          //TODO error component
          console.error(error)
        }
        
      },
      async getWeather() {
          try {
             const response = await axios.get("https://api.openweathermap.org/data/2.5/weather", { params: {
                  q: `${this.city.name},${this.city.country}`,
                  appid: "f07469a72d6c0229d76ce7b76a2ed11e",
                  units: "metric",
                  lang: 'ru',
              } });
            this.tempMax = response.data?.main?.temp_max;
            this.tempMin = response.data?.main?.temp_min;
          } catch(error) {
          //TODO error component
          console.error(error)
        }
      }
    },
    async mounted() {
        await this.setStartedPlace()
        await this.getWeather()
    },
    components: { Popup, MyLoader }
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
