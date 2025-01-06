<script setup lang="tsx">
import { computed, ComputedRef } from 'vue';
import weatherCodeJson from '../../data/wmoMap.json';
import { CurrentWeatherData, WeatherCodeType } from '../../types/weatherTypes';
import { useLocationStore } from '../../store/location';



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


console.log(weatherCodeFetch.value)

</script>



<template>
    <div class="flex items-start justify-start relative w-full">
        <img class="w-[160px] h-[160px] absolute left-[-20px] top-[-30px]"
            :src="`${weatherCode?.[weatherCodeFetch][isDay ? 'image_day' : 'image_night']}`"
            :alt="`${weatherCode?.[weatherCodeFetch][isDay ? 'image_day' : 'image_night']}`" />
        <div class="w-[120px] h-[100px]"></div>
        <div class="ml-3 h-[100px] flex flex-col justify-center items-start gap-1">
            <p class="text-3xl"> {{ weatherCode?.[weatherCodeFetch].category }}</p>
            <p class="text-2xl font-light">Feel Like {{ weatherCurrent?.apparent_temperature }}</p>
        </div>
        <div class="w-auto h-[80px] ml-auto flex flex-col justify-between items-end">
            <div class="flex gap-2 justify-center items-center">
                <span
                    class="animate-pulse w-4 h-4 min-w-4 min-h-4 rounded-full bg-green-400 -translate-y-[0.5px]"></span>
                <p class="text-[16px] font-bold">Live Weather </p>
            </div>
            <div
                class="w-auto h-[48px] rounded-[25px] bg-primary-h-color px-6 text-white flex justify-start items-center gap-2 ml-auto">
                <i class="pi pi-map-marker" style="font-size: 1.2rem"></i>
                <p class="text-[14px] cursor-default">{{ locationStore.$state.location?.name &&
                    locationStore.$state.location?.name + ", " }}
                    {{ locationStore.$state.location?.country }}</p>
            </div>
        </div>
    </div>

</template>