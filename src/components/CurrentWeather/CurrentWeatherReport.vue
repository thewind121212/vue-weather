<script setup lang="ts">
import { defineProps, watch, } from 'vue';
import { CurrentWeatherData, WeatherDailyData, WeatherHourlyData } from '../../types/weatherTypes';
import { CurrentAirData, HourlyAirData } from '../../types/airTypes';
import CurrentWeather from './CurrentWeather.vue';
import CurrentTempature from './CurrentTempature.vue';
import CurrentAirQuality from './CurrentAirQuality.vue';
import { useAirQualityInfo } from '../../store/airInfo';


const props = defineProps({
    airCurrent: Object as () => CurrentAirData,
    weatherCurrent: Object as () => CurrentWeatherData,
    isError: Boolean,
    isFetching: Boolean,
    timeZone: String,
    currentDay: Object as () => WeatherDailyData,
    airHourly: Object as () => HourlyAirData,
    weatherHourly: Object as () => WeatherHourlyData
})

const airInfo = useAirQualityInfo()

watch(() => props.weatherCurrent, () => {
    if (props.weatherCurrent) {
        airInfo.setAirQuality(props.airCurrent?.us_aqi!, props.airCurrent?.pm2_5!, props.airCurrent?.pm10!)
    }
}, { immediate: true })


</script>


<template>
    <div class="bg-secondary rounded-2xl p-6 text-white flex-0 min-w-[620px]">
        <CurrentWeather :weatherCurrent="weatherCurrent" :time-zone="timeZone" />
        <div class="flex w-full h-auto mt-4">
            <div class="w-full flex flex-col justify-center items-start gap-1">
                <div class="flex justify-between items-start w-full">
                    <CurrentTempature :current-day="currentDay" :weather-current="weatherCurrent" />
                    <CurrentAirQuality :us-aqi="airCurrent?.us_aqi" :pm2_5="airCurrent?.pm2_5" :airHourly="airHourly" />
                </div>
            </div>
        </div>
    </div>
</template>