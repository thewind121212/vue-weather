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
    <div class="flex flex-wrap sm:flex-nowrap items-start justify-start relative w-full gap-y-3">
        <img class="w-[8rem] h-[8rem] sm:w-[10rem] sm:h-[10rem] absolute left-[-1rem] sm:left-[-1.25rem] top-[-1.5rem] sm:top-[-1.875rem]"
            :src="`${weatherCode?.[weatherCodeFetch][isDay ? 'image_day' : 'image_night']}`"
            :alt="`${weatherCode?.[weatherCodeFetch][isDay ? 'image_day' : 'image_night']}`" />
        <div class="w-[6rem] h-[5rem] sm:w-[7.5rem] sm:h-[6.25rem] shrink-0"></div>
        <div class="ml-2 sm:ml-3 h-auto sm:h-[6.25rem] flex flex-col justify-center items-start gap-1 min-w-0">
            <p class="text-2xl sm:text-3xl"> {{ weatherCode?.[weatherCodeFetch].category }}</p>
            <p class="text-lg sm:text-2xl font-light">Feel Like {{ weatherCurrent?.apparent_temperature }}</p>
        </div>
        <div class="w-full sm:w-auto h-auto sm:h-[5rem] flex flex-col justify-between items-start sm:items-end sm:ml-auto gap-2">
            <div class="flex gap-2 justify-center items-center">
                <span
                    class="animate-pulse w-4 h-4 min-w-4 min-h-4 rounded-full bg-green-400 -translate-y-[0.0313rem]"></span>
                <p class="text-[1rem] font-bold">Live Report</p>
            </div>
            <div
                class="w-auto max-w-full h-[2.5rem] rounded-[1.5625rem] bg-primary-h-color px-4 sm:px-6 text-white flex justify-start items-center gap-2 sm:ml-auto">
                <i class="pi pi-map-marker shrink-0" style="font-size: 1.2rem"></i>
                <p class="text-[0.875rem] cursor-default truncate">{{ locationStore.$state.location?.name &&
                    locationStore.$state.location?.name + ", " }}
                    {{ locationStore.$state.location?.country }}</p>
            </div>
        </div>
    </div>

</template>