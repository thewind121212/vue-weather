<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { AxiosResponse } from 'axios';
import { type WeatherDataRes } from '../types/weatherTypes';
import { AxiosCLient } from '../lib/axios';
import { defineAsyncComponent, onUnmounted, reactive, watch } from 'vue';
import { useTempUnitStore } from '../store/tempUnit';
import { useSortedInfo } from '../store/sortInfo';
import 'swiper/swiper-bundle.css';


import { Location } from '../types/geoTypes';
import { useLocationStore } from '../store/location';
import { throttle } from 'lodash';
import { AirQualityRes } from '../types/airTypes';
import { timeImgGen } from '../utils/utils';

const CurrentWeatherReport = defineAsyncComponent(() => import('../components/CurrentWeather/CurrentWeatherReport.vue'))
const CurrentWeatherInfo = defineAsyncComponent(() => import('../components/CurrentWeather/CurrentWeatherInfo.vue'))
const CurrentAirStatistics = defineAsyncComponent(() => import('../components/CurrentWeather/CurrentAirStatistics.vue'))
const TodayHightLight = defineAsyncComponent(() => import('../components/Today/TodayHightLight.vue'))
const TodayForcast = defineAsyncComponent(() => import('../components/Today/TodayForcast.vue'))
import Weekly from '../components/Weekly/Weekly.vue'
const LoadingHome = defineAsyncComponent(() => import('../components/Loading/HomeLoading.vue'))
const SearchModal = defineAsyncComponent(() => import('../components/SearchModal.vue'))


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
    const locationParams: Location = locationStore.$state.location!


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



onUnmounted(() => {
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
      class="w-svw min-h-svh bg-primary dark font-sfPro font-[500] bg-[url('/bg.webp')] bg-cover bg-center bg-fixed relative overflow-x-hidden" id="main-layout">
      <div class="fixed inset-0 backdrop-blur-lg z-0"></div>
      <div class="w-full h-auto p-4 sm:p-6 lg:p-10 relative z-20" id="main-app-render">
        <LoadingHome v-if="(isLoading || isFetching)" />

        <div class="top-bar p-2 flex flex-wrap gap-y-3 justify-start items-center">
          <img src="/logo.webp" alt="logo" class="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 lg:scale-125 -translate-y-[0.03125rem] shrink-0" />
          <div class="w-auto h-auto sm:h-[4rem] flex justify-center items-start flex-col ml-2 lg:ml-0">
            <div class="w-auto h-auto flex justify-start items-center text-[#dae2eb] relative">
              <p class="text-sm sm:text-xl lg:text-2xl">
                {{ time.hr }}
                <span class="hidden sm:inline-block text-xs sm:text-base lg:text-xl font-light text-[#dae2eba1] lg:-translate-y-[0.1875rem]">
                  ({{ data?.weather.data.timezone }})
                </span>
              </p>
            </div>
            <p class="text-white text-base sm:text-2xl lg:text-4xl text-nowrap">
              {{ time.day }}
            </p>
          </div>


          <div class="hidden xl:block w-[8.75rem] h-24 relative">
            <img v-if="time.imgTime !== null" :src="time.imgTime" :alt="time.imgTime"
              class="w-24 h-auto absolute left-0 top-[-0.313rem]">
          </div>
          <div class="w-auto h-12 sm:h-16 ml-auto flex flex-nowrap justify-end items-center gap-2 sm:gap-4 lg:gap-6">
            <!-- location find  -->
            <SearchModal />
            <div
              class="bg-secondary w-[5rem] h-[2.5rem] sm:w-[6.6875rem] sm:h-[3.1875rem] rounded-[1.6875rem] flex justify-center items-center relative shrink-0"
              v-on:click="handerChangeTempUnitDebounce(unit.$state.tempUnit === 'C' ? 'F' : 'C')">
              <div
                class="size-8 sm:size-[2.625rem] aspect-square rounded-full text-black flex justify-center items-center duration-300 bg-[#7068FF] absolute z-10"
                :class="unit.$state.tempUnit === 'C' ? '!left-[0.375rem] sm:!left-[0.5rem]' : 'left-[50%]'">
              </div>
              <div
                class="size-8 sm:size-[2.625rem] aspect-square bg-transparent font-semibold rounded-full flex justify-center items-center relative z-20 cursor-pointer leading-none text-sm sm:text-base"
                :class="unit.$state.tempUnit === 'C' ? 'text-white' : 'text-[#676B73]'">
                C°
              </div>
              <div
                class="size-8 sm:size-[2.625rem] aspect-square bg-transparent font-semibold rounded-full flex justify-center items-center relative z-20 cursor-pointer leading-none text-sm sm:text-base"
                :class="unit.$state.tempUnit === 'F' ? 'text-white' : 'text-[#676B73]'">
                F°
              </div>
            </div>
            <a href="https://github.com/thewind121212/vue-weather" target="_blank" rel="noopener noreferrer"
              class="text-white flex justify-center items-center hover:text-[#7068FF] duration-200 shrink-0">
              <i class="pi pi-github" style="font-size: 1.5rem"></i>
            </a>
          </div>
        </div>
        <div class="h-auto w-full gap-4 flex flex-col">

          <!-- row 1 -->
          <div class="flex h-auto items-start justify-center">
            <div class="grid grid-cols-1 lg:grid-cols-2 2xl:flex h-auto w-full gap-4 p-2 rounded-lg 2xl:max-h-[18.75rem]">
              <!-- col 1 -->
              <CurrentWeatherReport :weatherCurrent="data?.weather.data.current" :isError="isError"
                :airCurrent="data?.air.data.current" :currentDay="data?.weather.data.daily"
                :timeZone="data?.weather.data.timezone" :airHourly="data?.air.data.hourly"
                :weatherHourly="data?.weather.data.hourly" :isFetching="isFetching" />
              <!-- col 2 -->
              <div class="gradient-bg rounded-2xl flex flex-col items-start justify-start p-6 2xl:flex-0 2xl:min-w-[20rem]">
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
              <div class="grid grid-cols-1 sm:grid-cols-2 2xl:flex gap-4 2xl:flex-1 rounded-2xl lg:col-span-2 2xl:col-auto">
                <div class="gradient-bg h-full 2xl:flex-1 rounded-2xl p-6 2xl:basis-2/5 flex-col 2xl:min-w-[17.75rem]">
                  <div class="flex gap-2 justify-start items-center mb-4">
                    <span
                      class="animate-pulse w-4 h-4 min-w-4 min-h-4 rounded-full bg-green-400 -translate-y-[0.0313rem]"></span>
                    <p class="text-[1rem] font-bold text-white">Live Air Statistics</p>
                  </div>
                  <CurrentAirStatistics :air-current="data?.air.data.current" />
                </div>
                <div class="gradient-bg h-full 2xl:flex-1 rounded-2xl p-6 2xl:basis-3/5 2xl:min-w-[20.625rem]">
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
            <div class="w-full h-full 2xl:min-h-[26.625rem] 2xl:max-h-[26.625rem]">
              <div class="grid grid-cols-1 lg:flex gap-4 rounded-2xl h-full justify-between">
                <TodayForcast :weatherDaily="data?.weather.data.daily" :weatherHourly="data?.weather.data.hourly"
                  :airQualityHourly="data?.air.data.hourly" :timeZone="data?.weather.data.timezone" :hr="time.hr"
                  :weatherCurrent="data?.weather.data.current" :day="time.day" />
                <Weekly :weatherDaily="data?.weather.data.daily" :weatherHourly="data?.weather.data.hourly"
                  :hr="time.hr" :day="time.day"
                 :airQualityHourly="data?.air.data.hourly" :timeZone="data?.weather.data.timezone" />
              </div>

            </div>

          </div>

        </div>


      </div>
    </div>
  </KeepAlive>
</template>
