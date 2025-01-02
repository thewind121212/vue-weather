<script setup lang="ts">
import { computed, ComputedRef, defineProps } from 'vue';
import { type CurrentWeatherData } from '../types/weatherTypes';
import weatherCodeJson from '../data/wmoMap.json';


interface WeatherCodeType {
    category: string,
    description: string,
    image_day: string,
    image_night: string,
}


const weatherCode: Record<string, WeatherCodeType> = weatherCodeJson as Record<string, WeatherCodeType>;

const props = defineProps({
    data: Object as () => CurrentWeatherData,
    isError: Boolean,
    isFetching: Boolean
})


const weatherCodeFetch: ComputedRef<string> = computed(() => {
    return props.data && props.data.weather_code ? props.data.weather_code.toString() : "0"
})



</script>


<template>
    <div className="col-span-2 row-span-1 bg-[#222239] rounded-2xl text-[#FFFF] text-5xl p-6">
        {{ data?.temperature_2m }}°C
        <img className="w-20 h-20" :src="`${weatherCode?.[weatherCodeFetch].image_day}`"
            :alt="`${weatherCode?.[weatherCodeFetch].image_day}`" />
    </div>
</template>