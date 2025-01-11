<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { AxiosResponse } from 'axios';
import { type WeatherDataRes } from './types/weatherTypes';
import CurrentWeatherReport from './components/CurrentWeather/CurrentWeatherReport.vue';
import { AxiosCLient } from './lib/axios';
import { defineAsyncComponent, onBeforeMount, reactive, watch } from 'vue';
import { useTempUnitStore } from './store/tempUnit';
import { useSortedInfo } from './store/sortInfo';
import 'swiper/swiper-bundle.css';


import { Location } from './types/geoTypes';
import { useLocationStore } from './store/location';
import { throttle } from 'lodash';
import { AirQualityRes } from './types/airTypes';
import CurrentWeatherInfo from './components/CurrentWeather/CurrentWeatherInfo.vue';
import { timeImgGen } from './utils/utils';
import CurrentAirStatistics from './components/CurrentWeather/CurrentAirStatistics.vue';
import TodayHightLight from './components/Today/TodayHightLight.vue';
import TodayForcast from './components/Today/TodayForcast.vue';


const LoadingHome = defineAsyncComponent(() => import('./components/Loading/HomeLoading.vue'))
const SearchModal = defineAsyncComponent(() => import('./components/SearchModal.vue'))


const time = reactive<{
  day: string,
  hr: string
  imgTime: string | null
}>({
  day: "",
  hr: "",
  imgTime: null
})


const unit = useTempUnitStore()
const sortedInfo = useSortedInfo()
const locationStore = useLocationStore()

const currentWeatherFetch = async (): Promise<{
  weather: WeatherDataRes
  air: AirQualityRes
} | null> => {


  try {
    const locationLocalStore = localStorage.getItem('location')

    let locationParams: Location | null = locationStore.$state.location



    locationParams = locationParams ? locationParams : locationLocalStore ? JSON.parse(locationLocalStore) : null


    if (!locationParams) {
      throw new Error('Location not found')
    }


    const weatherFetch = AxiosCLient.get('/weather', {
      params: {
        manualTimezone: locationParams.timezone ? locationParams.timezone : 'Asia/Ho_Chi_Minh',
        locationIdRequest: locationParams.id,
        latitudeRequest: locationParams.latitude,
        longitudeRequest: locationParams.longitude
      }
    })

    const airFetch = AxiosCLient.get('/air-quality', {
      params: {
        manualTimezone: locationParams.timezone ? locationParams.timezone : 'Asia/Ho_Chi_Minh',
        locationIdRequest: locationParams.id,
        latitudeRequest: locationParams.latitude,
        longitudeRequest: locationParams.longitude
      }
    })

    const promiseArray: [Promise<AxiosResponse<WeatherDataRes>>, Promise<AxiosResponse<AirQualityRes>>] = [weatherFetch, airFetch]

    const [weatherRes, airRes] = await Promise.all(promiseArray)




    const timeBaseOnTimeZone = new Date().toLocaleString("en-US", {
      timeZone: weatherRes.data.data.timezone,
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hourCycle: "h23",
      hour: "2-digit",
      minute: "2-digit",
    });

    time.hr = timeBaseOnTimeZone.split(',')[3]
    time.day = timeBaseOnTimeZone.split(',').slice(0, 3).join(',')
    time.imgTime = timeImgGen(Number(timeBaseOnTimeZone.split(',')[3].split(":")[0])) ?? null


    return {
      weather: weatherRes.data,
      air: airRes.data
    }


  } catch (error) {
    console.log('Error', error)
    console.error(error);
    return null
  }
}

const { isLoading, isError, data, isFetching, refetch } = useQuery({
  queryKey: ['currentWeather'],
  queryFn: currentWeatherFetch,
})

watch(locationStore.$state, () => {
  refetch()
})

const handerChangeTempUnitDebounce = throttle((payload: "C" | "F",) => {
  unit.setTempUnit(unit.$state.tempUnit = payload)
}, 1000)



onBeforeMount(() => {
  handerChangeTempUnitDebounce.cancel()
})


watch(data, () => {
  if (data.value?.air && data.value?.weather) {
    const weatherHourly = data.value.weather.data.hourly
    const airHourly = data.value.air.data.hourly
    const humidity = weatherHourly.relative_humidity_2m.slice(0, 24).sort((a, b) => a - b)
    const uv = airHourly.uv_index.slice(0, 24).sort((a, b) => a - b)
    const pm2_5 = airHourly.pm2_5.slice(0, 24).sort((a, b) => a - b)
    const cloudCover = weatherHourly.cloud_cover.slice(0, 24).sort((a, b) => a - b)

    sortedInfo.setSortInfo(humidity, cloudCover, pm2_5, uv)
  }
})

</script>

<template>
  <KeepAlive>
    <div
      class="w-svw h-svh bg-primary dark font-sfPro font-[500] bg-[url('/bg.png')] bg-cover bg-center overflow-hidden">
      <div class="w-full h-full backdrop-blur-lg p-10">
        <LoadingHome v-if="(isLoading || isFetching)" />

        <div class="top-bar p-2 flex justify-start items-center">
          <img src="/logo.webp" alt="logo" class="w-20 h-20 scale-125 min-w-20 min-h-20 -translate-y-[0.03125rem]" />
          <div class="w-auto h-[4rem] flex justify-center items-star flex-col">
            <div class="w-auto h-auto flex justify-start items-center text-[#dae2eb] relative">
              <p class="text-2xl">
                {{ time.hr }}
                <span class="text-xl font-light text-[#dae2eba1] inline-block -translate-y-[0.1875rem]">
                  ({{ data?.weather.data.timezone }})
                </span>
              </p>
            </div>
            <p class="text-white text-4xl">
              {{ time.day }}
            </p>
          </div>


          <div class="w-[8.75rem] h-24 relative">
            <img v-if="time.imgTime !== null" :src="time.imgTime" :alt="time.imgTime"
              class="w-24 h-auto absolute left-0 top-[-0.313rem]">
          </div>
          <div class="w-[25rem] h-16 ml-auto flex justify-start items-center gap-6">
            <!-- location find  -->
            <SearchModal />
            <div
              class="bg-secondary w-[6.6875rem] h-[3.1875rem] rounded-[1.6875rem] flex justify-center items-center relative"
              v-on:click="handerChangeTempUnitDebounce(unit.$state.tempUnit === 'C' ? 'F' : 'C')">
              <div
                class="size-[2.625rem] aspect-square rounded-[1.3125rem] text-black flex justify-center items-center duration-300 bg-[#7068FF] absolute z-10"
                :class="unit.$state.tempUnit === 'C' ? '!left-[0.5rem]' : 'left-[50%]'">
              </div>
              <div
                class="size-[2.625rem] aspect-square bg-transparent font-semibold rounded-[1.3125rem] flex justify-center items-center translate-x-[0.125rem] translate-y-[0.0625rem] relative z-20 cursor-pointer"
                :class="unit.$state.tempUnit === 'C' ? 'text-white' : 'text-[#676B73]'">
                C°
              </div>
              <div
                class="size-[2.625rem] aspect-square bg-transparent font-semibold rounded-[1.3125rem] flex justify-center items-center translate-x-[0.125rem] translate-y-[0.0625rem] relative z-20 cursor-pointer"
                :class="unit.$state.tempUnit === 'F' ? 'text-white' : 'text-[#676B73]'">
                F°
              </div>
            </div>
          </div>
        </div>
        <div class="h-[calc(100vh-11.5rem)] w-full gap-4 flex flex-col">

          <!-- row 1 -->
          <div class="flex h-auto items-start justify-center">
            <div class="flex h-auto  w-full gap-4 p-2 rounded-lg max-h-[18.75rem]">
              <!-- col 1 -->
              <CurrentWeatherReport :weatherCurrent="data?.weather.data.current" :isError="isError"
                :airCurrent="data?.air.data.current" :currentDay="data?.weather.data.daily"
                :timeZone="data?.weather.data.timezone" :airHourly="data?.air.data.hourly"
                :weatherHourly="data?.weather.data.hourly" :isFetching="isFetching" />
              <!-- col 2 -->
              <div class="gradient-bg rounded-2xl flex flex-col items-start justify-start p-6 flex-0 min-w-[20rem]">
                <div class="flex gap-2 justify-center items-center ml-1 mb-4">
                  <span
                    class="animate-pulse w-4 h-4 min-w-4 min-h-4 rounded-full bg-green-400 -translate-y-[0.0313rem]"></span>
                  <p class="text-[1rem] font-bold text-white">Live Weather Statistics </p>
                </div>
                <CurrentWeatherInfo :weather-current="data?.weather.data.current"
                  :current-day="data?.weather.data.daily" :air-current="data?.air.data.current"
                  :weatherHourly="data?.weather.data.hourly" />
              </div>
              <!-- col 3 -->
              <div class="flex gap-4 flex-1 rounded-2xl">
                <div class="gradient-bg h-full flex-1 rounded-2xl p-6 basis-2/5 flex-col min-w-[17.75rem]">
                  <div class="flex gap-2 justify-start items-center mb-4">
                    <span
                      class="animate-pulse w-4 h-4 min-w-4 min-h-4 rounded-full bg-green-400 -translate-y-[0.0313rem]"></span>
                    <p class="text-[1rem] font-bold text-white">Live Air Statistics</p>
                  </div>
                  <CurrentAirStatistics :air-current="data?.air.data.current" />
                </div>
                <div class="gradient-bg h-full flex-1 rounded-2xl p-6 basis-3/5 min-w-[20.625rem]">
                  <div class="flex gap-2 justify-start items-center ml-1 mb-4">
                    <span class="w-4 h-4 min-w-4 min-h-4 rounded-full bg-blue-400 -translate-y-[0.0313rem]"></span>
                    <p class="text-[1rem] font-bold text-white">Today Hightlight</p>
                  </div>
                  <TodayHightLight :weatherDaily="data?.weather.data.daily" :weatherHourly="data?.weather.data.hourly"
                    :airQualityHourly="data?.air.data.hourly" :timeZone="data?.weather.data.timezone" :hr="time.hr"
                    :day="time.day" />
                </div>
              </div>
            </div>
          </div>
          <!-- row 2 -->
          <div class="flex w-full gap-4 p-2 rounded-lg flex-auto pt-0">
            <div class="w-full h-full min-h-[26.625rem] max-h-[26.625rem]">

              <div class="flex gap-4 rounded-2xl h-full">
                <div class="gradient-bg flex-auto rounded-2xl p-6 basis-3/5 max-w-[25.625rem] h-full flex flex-col">
                  <div class="flex gap-2 justify-start items-center ml-1 mb-4">
                    <span class="w-4 h-4 min-w-4 min-h-4 rounded-full bg-blue-400 -translate-y-[0.0313rem]"></span>
                    <p class="text-[1rem] font-bold text-white">Today Forcast</p>
                  </div>
                  <TodayForcast :weatherDaily="data?.weather.data.daily" :weatherHourly="data?.weather.data.hourly"
                    :airQualityHourly="data?.air.data.hourly" :timeZone="data?.weather.data.timezone" :hr="time.hr"
                    :weatherCurrent="data?.weather.data.current" :day="time.day" />

                </div>
              </div>

            </div>

          </div>

        </div>


      </div>
    </div>
  </KeepAlive>
</template>
