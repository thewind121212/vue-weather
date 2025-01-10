<script setup lang="tsx">
import { useTempUnitStore } from '../../store/tempUnit';
import { CurrentWeatherData, WeatherDailyData } from '../../types/weatherTypes';
import { convertFromCelciusToFahrenheit } from '../../utils/utils';

const unit = useTempUnitStore()



const props = defineProps({
    weatherCurrent: Object as () => CurrentWeatherData,
    currentDay: Object as () => WeatherDailyData
})


</script>




<template>

    <div class="flex flex-col gap-1">
        <p class="font-sfPro font-[400] text-[#FFFF] text-6xl">
            {{ convertFromCelciusToFahrenheit(props.weatherCurrent?.temperature_2m!, unit.$state.tempUnit) }}
        </p>
        <div class="w-full h-auto flex gap-6">
            <p class="font-sfPro font-[300] text-[#FFFF] text-xl w-[2.625rem]">
                Low {{ convertFromCelciusToFahrenheit(props.currentDay?.temperature_2m_min[0]!, unit.$state.tempUnit) }}
            </p>
            <p class="font-sfPro font-[300] text-[#FFFF] text-xl w-[2.625rem]">
                High {{ convertFromCelciusToFahrenheit(props.currentDay?.temperature_2m_max[0]!, unit.$state.tempUnit)
                }}
            </p>
        </div>

    </div>
</template>