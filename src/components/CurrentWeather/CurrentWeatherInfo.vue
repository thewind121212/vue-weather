<script setup lang="tsx">
import { watch } from 'vue';
import { CurrentAirData } from '../../types/airTypes';
import { CurrentWeatherData, WeatherDailyData, WeatherHourlyData } from '../../types/weatherTypes';

const props = defineProps({
    weatherCurrent: Object as () => CurrentWeatherData,
    currentDay: Object as () => WeatherDailyData,
    airCurrent: Object as () => CurrentAirData,
    weatherHourly: Object as () => WeatherHourlyData,
})



let renderList: {
    staticName: string,
    dynamicValue: string | number,
    iconSrc: string,
    alt: string,
    imgElementClasss: string
}[] = []

watch(() => props.weatherCurrent, () => {

    const currentHr = props.weatherCurrent?.time ? Number(props.weatherCurrent?.time.split("T")[1].split(":")[0]) : 0



    const maxPrecipitaionHr = props.weatherHourly ? props.weatherHourly.precipitation_probability[currentHr] : 0
    const snowFallHr = props.weatherHourly ? props.weatherHourly.snowfall[currentHr] : 0
    const rain = props.weatherHourly ? props.weatherHourly.rain[currentHr] : 0


    renderList = [{
        staticName: 'Now Humidity',
        dynamicValue: (props.weatherCurrent?.relative_humidity_2m ?? '') + '%',
        iconSrc: '/weather_icons/humidity.svg',
        imgElementClasss: 'w-[3.125rem] h-[3.125rem] absolute left-[-0.75rem]',
        alt: 'humidity_icon',
    },
    {
        staticName: 'Now Rain Chance',
        dynamicValue: (maxPrecipitaionHr) + '%',
        iconSrc: '/weather_icons/sleet.svg',
        imgElementClasss: 'w-[2.375rem] h-[2.375rem] absolute left-[-0.375rem] top-[-0.375rem]',
        alt: 'rain_icon'
    },
    {
        staticName: 'Now UV',
        dynamicValue: props.airCurrent?.uv_index ?? '',
        iconSrc: `/weather_icons/uv-index-${Math.min(Math.floor(Number(props.airCurrent?.uv_index! < 1 ? 0 : props.airCurrent?.uv_index ?? 0)), 11)}.svg`,
        imgElementClasss: 'w-[2.375rem] h-[2.375rem] absolute left-[-0.375rem] top-[-0.375rem]',
        alt: 'uv_icon'
    },
    {
        staticName: 'Now Wind Speed',
        dynamicValue: (props.weatherCurrent?.wind_speed_10m ?? '') + ' km/h',
        iconSrc: `/weather_icons/wind-beaufort-${Math.min(Math.floor(Number(props.weatherCurrent?.wind_speed_10m! < 1 ? 0 : props.weatherCurrent?.wind_speed_10m! ?? 0)), 12)}.svg`,
        imgElementClasss: 'w-[2.5rem] h-[2.5rem] absolute left-[-0.375rem] top-[-0.375rem]',
        alt: 'wind_icon'
    },
    {
        staticName: 'Now Snow Fall',
        dynamicValue: snowFallHr + ' cm',
        iconSrc: `/weather_icons/snowflake.svg`,
        imgElementClasss: 'w-[2.625rem] h-[2.625rem] absolute left-[-0.375rem] top-[-0.375rem]',
        alt: 'snow_icon'
    },
    {
        staticName: 'Now Rain Fall',
        dynamicValue: rain + ' mm',
        iconSrc: `/weather_icons/raindrops.svg`,
        imgElementClasss: 'w-[2.5rem] h-[2.5rem] absolute left-[-0.375rem] top-[-0.375rem]',
        alt: 'rain_icon'
    }
    ]




}, { immediate: true })








</script>



<template>

    <div class="flex justify-start items-start flex-col gap-1 flex-wrap">
        <div v-for="item of renderList" class="flex relative gap-2 justify-start items-center">
            <div class="flex relative gap-2 justify-start items-center">
                <div class="w-[0.625rem] h-[1.75rem] pl-6"></div>
                <p class="font-sfPro font-[300] text-[#FFFF] text-xl w-fit">
                    {{ item.staticName }} {{ item.dynamicValue }}
                </p>
                <img :class="item.imgElementClasss" :src="item.iconSrc" alt="Humidity_icon" />
            </div>
        </div>
    </div>


</template>