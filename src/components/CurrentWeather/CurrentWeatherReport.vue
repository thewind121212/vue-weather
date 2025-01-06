<script setup lang="ts">
import { defineProps, } from 'vue';
import { CurrentWeatherData, WeatherDailyData } from '../../types/weatherTypes';
import { CurrentAirData } from '../../types/airTypes';
import CurrentWeather from './CurrentWeather.vue';
import CurrentTempature from './CurrentTempature.vue';
import CurrentWeatherInfo from './CurrentWeatherInfo.vue';


const props = defineProps({
    airCurrent: Object as () => CurrentAirData,
    weatherCurrent: Object as () => CurrentWeatherData,
    isError: Boolean,
    isFetching: Boolean,
    timeZone: String,
    currentDay: Object as () => WeatherDailyData
})


const uiAqi = 30

</script>


<template>
    <div class="col-span-3 row-span-2 bg-secondary rounded-2xl p-6 text-white min-w-[600px]">
        <CurrentWeather :weatherCurrent="weatherCurrent" :time-zone="timeZone" />
        <div class="flex w-full h-auto mt-4">
            <div class="w-full flex flex-col justify-center items-start gap-1">
                <div class="flex justify-between items-center">
                    <CurrentTempature :current-day="currentDay" :weather-current="weatherCurrent" />
                </div>


                <div class="flex justify-start items-start">
                    <CurrentWeatherInfo :weather-current="weatherCurrent" :current-day="currentDay"
                        :air-current="airCurrent" />
                </div>
            </div>
        </div>
    </div>
</template>