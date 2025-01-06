<script setup lang="tsx">
import { computed } from 'vue';
import { useTempUnitStore } from '../../store/tempUnit';
import { CurrentWeatherData, WeatherDailyData } from '../../types/weatherTypes';

const unit = useTempUnitStore()



const props = defineProps({
    weatherCurrent: Object as () => CurrentWeatherData,
    currentDay: Object as () => WeatherDailyData
})


const currentTempature = computed(() => {
    if (unit.$state.tempUnit === 'C') {
        return props.weatherCurrent?.temperature_2m
    } else {
        return (Number(props.weatherCurrent?.temperature_2m) * 9 / 5 + 32).toFixed(1)
    }
})
</script>




<template>

    <div class="flex flex-col gap-1">
        <p class="font-sfPro font-[400] text-[#FFFF] text-6xl">
            {{ currentTempature }}{{ unit.$state.tempUnit === 'C' ? '°C' : "°F" }}
        </p>
        <div class="w-full h-auto flex gap-6">
            <p class="font-sfPro font-[300] text-[#FFFF] text-xl w-[42px]">
                Low: {{ currentDay?.temperature_2m_min[0] }}{{ unit.$state.tempUnit === 'C' ? '°C' : "°F" }}
            </p>
            <p class="font-sfPro font-[300] text-[#FFFF] text-xl w-[42px]">
                High: {{ currentDay?.temperature_2m_max[0] }}{{ unit.$state.tempUnit === 'C' ? '°C' : "°F"
                }}
            </p>
        </div>

    </div>
</template>