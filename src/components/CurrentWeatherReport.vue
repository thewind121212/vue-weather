<script setup lang="ts">
import { computed, ComputedRef, defineProps } from 'vue';
import { CurrentWeatherData, WeatherDailyData } from '../types/weatherTypes';
import weatherCodeJson from '../data/wmoMap.json';
import { useTempUnitStore } from '../store/tempUnit';
import { useLocationStore } from '../store/location';
import { CurrentAirData } from '../types/airTypes';


interface WeatherCodeType {
    category: string,
    description: string,
    image_day: string,
    image_night: string,
}

const unit = useTempUnitStore()
const locationStore = useLocationStore()

const weatherCode: Record<string, WeatherCodeType> = weatherCodeJson as Record<string, WeatherCodeType>;


const props = defineProps({
    airCurrent: Object as () => CurrentAirData,
    weatherCurrent: Object as () => CurrentWeatherData,
    isError: Boolean,
    isFetching: Boolean,
    timeZone: String,
    currentDay: Object as () => WeatherDailyData
})




const isDay = computed(() => {
    const timeBaseOnTimeZone = new Date().toLocaleString("en-US", {
        timeZone: props.timeZone, hourCycle: "h23", hour: "2-digit",
        minute: "2-digit",
    });
    return Number(timeBaseOnTimeZone.split(':')[0]) < 18
})







const weatherCodeFetch: ComputedRef<string> = computed(() => {
    return props.weatherCurrent && props.weatherCurrent.weather_code ? props.weatherCurrent.weather_code.toString() : "0"
})

const currentTempature = computed(() => {
    if (unit.$state.tempUnit === 'C') {
        return props.weatherCurrent?.temperature_2m
    } else {
        return (Number(props.weatherCurrent?.temperature_2m) * 9 / 5 + 32).toFixed(1)
    }
})

console.log(weatherCodeFetch.value)

</script>


<template>
    <div class="col-span-3 row-span-2 bg-secondary rounded-2xl p-6 text-white min-w-[600px]">
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
        <div class="flex w-full h-auto mt-4">
            <div class="w-full flex flex-col justify-center items-start gap-1">
                <p class="font-sfPro font-[400] text-[#FFFF] text-6xl">
                    {{ currentTempature }}{{ unit.$state.tempUnit === 'C' ? '°C' : "°F" }}
                </p>
                <div class="w-full h-auto flex gap-6">
                    <p class="font-sfPro font-[300] text-[#FFFF] text-xl w-[42px]">
                        Low: {{ currentDay?.temperature_2m_min[0] }}{{ unit.$state.tempUnit === 'C' ? '°C' : "°F" }}
                    </p>
                    <p class="font-sfPro font-[300] text-[#FFFF] text-xl w-[42px]">
                        High: {{ currentDay?.temperature_2m_max[0] }}{{ unit.$state.tempUnit === 'C' ? '°C' : "°F" }}
                    </p>
                </div>
                <div class="flex relative gap-2 justify-start items-center mt-6">
                    <div class="w-[10px] h-[28px] pl-6"></div>
                    <p class="font-sfPro font-[300] text-[#FFFF] text-xl w-fit">
                        Humidity {{ weatherCurrent?.relative_humidity_2m }}
                    </p>
                    <img class="w-[50px] h-[50px] absolute left-[-12px]" :src="'/public/weather_icons/humidity.svg'"
                        alt="Humidity_icon" />
                </div>
                <div class="flex relative gap-2 justify-start items-center">
                    <div class="w-[10px] h-[28px] pl-6"></div>
                    <p class="font-sfPro font-[300] text-[#FFFF] text-xl w-fit">
                        Change of Rain {{ currentDay?.precipitation_probability_max[0] }}%
                    </p>
                    <img class="w-[38px] h-[38px] absolute left-[-6px] top-[-6px]"
                        :src="'/public/weather_icons/rain.svg'" alt="Humidity_icon" />
                </div>
                <div class="flex relative gap-2 justify-start items-center">
                    <div class="w-[10px] h-[28px] pl-6"></div>
                    <p class="font-sfPro font-[300] text-[#FFFF] text-xl w-fit">
                        UV {{ airCurrent?.uv_index }}
                    </p>
                    <img class="w-[38px] h-[38px] absolute left-[-6px] top-[-6px]"
                        :src="`/public/weather_icons/uv-index-${Math.min(Math.floor(Number(airCurrent?.uv_index! < 1 ? 0 : airCurrent?.uv_index ?? 0)), 11)}.svg`"
                        alt="Humidity_icon" />
                </div>
                <div class="flex relative gap-2 justify-start items-center">
                    <div class="w-[10px] h-[28px] pl-6"></div>
                    <p class="font-sfPro font-[300] text-[#FFFF] text-xl w-fit">
                        Wind Speed {{ weatherCurrent?.wind_speed_10m }} km/h
                    </p>
                    <img class="w-[38px] h-[38px] absolute left-[-6px] top-[-6px]"
                        :src="`/public/weather_icons/wind-beaufort-${Math.min(Math.floor(Number(weatherCurrent?.wind_speed_10m! < 1 ? 0 : weatherCurrent?.wind_speed_10m! ?? 0)), 12)}.svg`"
                        alt="Humidity_icon" />
                </div>
            </div>
        </div>
    </div>
</template>