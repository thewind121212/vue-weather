<script setup lang="ts">
import { computed, ComputedRef, defineProps } from 'vue';
import { WeatherDailyData, type CurrentWeatherData } from '../types/weatherTypes';
import weatherCodeJson from '../data/wmoMap.json';
import { useTempUnitStore } from '../store/tempUnit';


interface WeatherCodeType {
    category: string,
    description: string,
    image_day: string,
    image_night: string,
}

const unit = useTempUnitStore()

const weatherCode: Record<string, WeatherCodeType> = weatherCodeJson as Record<string, WeatherCodeType>;


const props = defineProps({
    data: Object as () => CurrentWeatherData,
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
    return Number(timeBaseOnTimeZone.split(':')[0]) > 18 ? false : true
})




const weatherCodeFetch: ComputedRef<string> = computed(() => {
    return props.data && props.data.weather_code ? props.data.weather_code.toString() : "0"
})

const currentTempature = computed(() => {
    if (unit.$state.tempUnit === 'C') {
        return props.data?.temperature_2m
    } else {
        return Number(props.data?.temperature_2m) * 9 / 5 + 32
    }
})


</script>


<template>
    <div class="col-span-2 row-span-2 bg-secondary rounded-2xl p-6 text-white">
        <div class="flex items-start justify-start relative w-full">
            <img class="w-[160px] h-[160px] absolute left-[-20px] top-[-30px]"
                :src="`${weatherCode?.[weatherCodeFetch][isDay ? 'image_day' : 'image_night']}`"
                :alt="`${weatherCode?.[weatherCodeFetch][isDay ? 'image_day' : 'image_night']}`" />
            <div class="w-[120px] h-[100px]"></div>
            <div class="ml-3 h-[100px] flex flex-col justify-center items-start gap-1">
                <p class="text-3xl"> {{ weatherCode?.[weatherCodeFetch].category }}</p>
                <p class="text-2xl font-light">Feel Like {{ data?.apparent_temperature }}</p>
            </div>
            <div
                class="w-auto h-[50px] rounded-[25px] bg-primary-h-color px-6 text-white flex justify-start items-center gap-2 ml-auto">
                <i class="pi pi-map-marker" style="font-size: 1.2rem"></i>
                <p>Ho Chi Minh, Viet Nam</p>
            </div>
        </div>
        <div class="flex w-full h-auto">
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
                <div class="flex relative gap-2 justify-start items-center">
                    <div class="w-[10px] h-[28px] pl-6"></div>
                    <p class="font-sfPro font-[300] text-[#FFFF] text-xl w-fit">
                        Humidity {{ data?.relative_humidity_2m }}
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
                        UV {{ currentDay?.uv_index_max[0] }}
                    </p>
                    <img class="w-[38px] h-[38px] absolute left-[-6px] top-[-6px]"
                        :src="`/public/weather_icons/uv-index-${Math.floor(Number(currentDay?.uv_index_max[0]! < 1 ? 1 : currentDay?.uv_index_max[0] ?? 5))}.svg`"
                        alt="Humidity_icon" />
                </div>
            </div>
        </div>
    </div>
</template>