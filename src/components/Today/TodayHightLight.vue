<script setup lang="ts">
import { computed } from 'vue';
import { HourlyAirData } from '../../types/airTypes';
import { WeatherDailyData, WeatherHourlyData } from '../../types/weatherTypes';
import ProgressCircle from '../svg/ProgressCircle.vue';
import { cosineDistance } from 'drizzle-orm';



const props = defineProps({
    weatherDaily: Object as () => WeatherDailyData,
    weatherHourly: Object as () => WeatherHourlyData,
    airQualityHourly: Object as () => HourlyAirData,
    timeZone: String,
})


const todayData = computed<{
    title: string
    value: number
    order: string
    max: number
    unit: string
}[]>(() => {
    const rainChance = props.weatherDaily?.precipitation_probability_max[0] ?? 0;
    const humidity = (
        (props.weatherHourly?.relative_humidity_2m?.slice(0, 24).reduce((acc, curr) => acc + curr, 0) ?? 0) / 24
    ).toFixed(0);
    const cloudCover = (
        (props.weatherHourly?.cloud_cover?.slice(0, 24).reduce((acc, curr) => acc + curr, 0) ?? 0) / 24
    ).toFixed(0);

    const uv = Math.max(...props.airQualityHourly?.uv_index?.slice(0, 24) ?? [0]);


    return [{
        title: 'UV index max',
        order: 'order-1',
        value: uv ?? 5,
        max: 11,
        unit: '',
    },
    {
        title: 'Rain Chance',
        order: 'order-2',
        value: Number(rainChance),
        max: 100,
        unit: '%',
    },
    {
        title: 'Humidity',
        order: 'order-4',
        max: 100,
        value: Number(humidity),
        unit: '%',
    },
    {
        title: 'Cloud Cover',
        order: 'order-5',
        max: 100,
        value: Number(cloudCover),
        unit: '%',
    }
        ,]
});




const sunCalc = computed<{
    sunrise: string
    sunset: string
}>(() => {

    const sunrise = props.weatherDaily?.sunrise[0].split("T")[1] as string
    const sunset = props.weatherDaily?.sunset[0].split("T")[1] as string


    return {
        sunrise,
        sunset
    }
})


</script>




<template>
    <div class="grid grid-cols-3 grid-rows-2 h-[12.25rem] gap-2 max-[1870px]:grid-cols-2">
        <div v-for="(item, index) in todayData" :key="index"
            class="bg-[#0D1321] rounded-xl flex justify-center items-center flex-col relative" :class="item.order">
            <h3 class="text-white text-[0.875rem] text-left font-light">{{ item.title }}</h3>
            <p class="absolute text-white font-semibold bottom-2 text-xl">{{ item.value }} {{ item.unit }}</p>

            <ProgressCircle :bg-stroke-color="'#fff'" :stroke-width=0.3 :svg-width="5.625" :svg-height="3.125"
                :current-value="item.value" :radius="2.5" :max-value="item.max" :rounded-cap="true" />
        </div>
        <div
            class="bg-[#0D1321] rounded-xl flex justify-end items-center flex-col relative max-[1880px]:hidden order-3">
            <img src="/weather_icons/sunrise.svg" alt="sunrise" class="w-[6.25rem] translate-y-[1.4rem]">
            <h3 class="text-white text-[0.875rem] text-left font-semibold -translate-y-2 animate-pulse">{{
                sunCalc.sunrise }}</h3>
        </div>
        <div
            class="bg-[#0D1321] rounded-xl flex justify-end items-center flex-col relative max-[1880px]:hidden order-6">
            <img src="/weather_icons/sunset.svg" alt="sunrise" class="w-[6.25rem] translate-y-[1.2rem]">
            <h3 class="text-white text-[0.875rem] text-left font-semibold -translate-y-2 animate-pulse">{{
                sunCalc.sunset }}</h3>
        </div>
    </div>
</template>