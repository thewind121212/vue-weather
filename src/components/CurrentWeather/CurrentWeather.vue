<script setup lang="tsx">
import { computed, ComputedRef } from 'vue';
import { CurrentWeatherData, WeatherCodeType } from '../../types/weatherTypes';
import { useLocationStore } from '../../store/location';
import weatherCodeJson from '../../data/wmoMap.json';

const weatherCode: Record<string, WeatherCodeType> = weatherCodeJson as Record<string, WeatherCodeType>;


const locationStore = useLocationStore()

const props = defineProps({
    weatherCurrent: Object as () => CurrentWeatherData,
    timeZone: String,
})

const isDay = computed(() => {
    const timeBaseOnTimeZone = new Date().toLocaleString("en-US", {
        timeZone: props.timeZone, hourCycle: "h23", hour: "2-digit",
        minute: "2-digit",
    });
    const hr = Number(timeBaseOnTimeZone.split(':')[0])
    return (6 < hr && hr < 18)
})







const weatherCodeFetch: ComputedRef<string> = computed(() => {
    return props.weatherCurrent && props.weatherCurrent.weather_code ? props.weatherCurrent.weather_code.toString() : "0"
})



</script>



<template>
    <div class="flex items-start justify-start relative w-full">
        <img class="w-[10rem] h-[10rem] absolute left-[-1.25rem] top-[-1.875rem]"
            :src="`${weatherCode?.[weatherCodeFetch][isDay ? 'image_day' : 'image_night']}`"
            :alt="`${weatherCode?.[weatherCodeFetch][isDay ? 'image_day' : 'image_night']}`" />
        <div class="w-[7.5rem] h-[6.25rem]"></div>
        <div class="ml-3 h-[6.25rem] flex flex-col justify-center items-start gap-1">
            <p class="text-3xl"> {{ weatherCode?.[weatherCodeFetch].category }}</p>
            <p class="text-2xl font-light">Feel Like {{ weatherCurrent?.apparent_temperature }}</p>
        </div>
        <div class="w-auto h-[5rem] flex flex-col justify-between items-end ml-auto">
            <div class="flex gap-2 justify-center items-center">
                <span
                    class="animate-pulse w-4 h-4 min-w-4 min-h-4 rounded-full bg-green-400 -translate-y-[0.0313rem]"></span>
                <p class="text-[1rem] font-bold">Live Report</p>
            </div>
            <div
                class="w-auto h-[2.5rem] rounded-[1.5625rem] bg-primary-h-color px-6 text-white flex justify-start items-center gap-2 ml-auto">
                <i class="pi pi-map-marker" style="font-size: 1.2rem"></i>
                <p class="text-[0.875rem] cursor-default">{{ locationStore.$state.location?.name &&
                    locationStore.$state.location?.name + ", " }}
                    {{ locationStore.$state.location?.country }}</p>
            </div>
        </div>
    </div>

</template>