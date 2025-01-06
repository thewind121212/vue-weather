<script setup lang="tsx">
import { watch } from 'vue';
import { CurrentAirData } from '../../types/airTypes';
import { CurrentWeatherData, WeatherDailyData } from '../../types/weatherTypes';

const props = defineProps({
    weatherCurrent: Object as () => CurrentWeatherData,
    currentDay: Object as () => WeatherDailyData,
    airCurrent: Object as () => CurrentAirData,
})



let renderList: {
    staticName: string,
    dynamicValue: string | number,
    iconSrc: string,
    alt: string,
    imgElementClasss: string
}[] = []

watch(() => props.weatherCurrent, () => {
    renderList = [{
        staticName: 'Humidity',
        dynamicValue: props.weatherCurrent?.relative_humidity_2m ?? '',
        iconSrc: '/public/weather_icons/humidity.svg',
        imgElementClasss: 'w-[50px] h-[50px] absolute left-[-12px]',
        alt: 'humidity_icon',
    },
    {
        staticName: 'Change of Rain',
        dynamicValue: props.currentDay?.precipitation_probability_max[0] ?? '' + '%',
        iconSrc: '/public/weather_icons/rain.svg',
        imgElementClasss: 'w-[38px] h-[38px] absolute left-[-6px] top-[-6px]',
        alt: 'rain_icon'
    },
    {
        staticName: 'UV',
        dynamicValue: props.airCurrent?.uv_index ?? '',
        iconSrc: `/public/weather_icons/uv-index-${Math.min(Math.floor(Number(props.airCurrent?.uv_index! < 1 ? 0 : props.airCurrent?.uv_index ?? 0)), 11)}.svg`,
        imgElementClasss: 'w-[38px] h-[38px] absolute left-[-6px] top-[-6px]',
        alt: 'uv_icon'
    },
    {
        staticName: 'Wind Speed',
        dynamicValue: props.weatherCurrent?.wind_speed_10m ?? '' + ' km/h',
        iconSrc: `/public/weather_icons/wind-beaufort-${Math.min(Math.floor(Number(props.weatherCurrent?.wind_speed_10m! < 1 ? 0 : props.weatherCurrent?.wind_speed_10m! ?? 0)), 12)}.svg`,
        imgElementClasss: 'w-[38px] h-[38px] absolute left-[-6px] top-[-6px]',
        alt: 'wind_icon'
    }
    ]
}, { immediate: true })


</script>



<template>

    <div class="flex justify-start items-start flex-col gap-1 mt-6">
        <div v-for="item of renderList" class="flex relative gap-2 justify-start items-center">
            <div class="flex relative gap-2 justify-start items-center">
                <div class="w-[10px] h-[28px] pl-6"></div>
                <p class="font-sfPro font-[300] text-[#FFFF] text-xl w-fit">
                    {{ item.staticName }} {{ item.dynamicValue }}
                </p>
                <img :class="item.imgElementClasss" :src="item.iconSrc" alt="Humidity_icon" />
            </div>
        </div>
    </div>


</template>