<script setup lang="tsx">
import { computed } from 'vue';
import { HourlyAirData } from '../../types/airTypes';
import { genTheAirImage } from '../../utils/utils';

const props = defineProps({
    usAqi: Number,
    pm2_5: Number,
    airHourly: Object as () => HourlyAirData,
})

const faceRender = computed(() => {
    const { color, type, imgSource } = genTheAirImage(props.usAqi ?? 0)
    return { color, type, imgSource }
})


const minMax = computed(() => {
    if (!props.airHourly?.us_aqi) {
        return {
            min: 0,
            max: 0
        }
    }
    const usAQI = props.airHourly.us_aqi.slice(0, 24)
    const min = Math.min(...usAQI)
    const max = Math.max(...usAQI)
    const colorMin = genTheAirImage(min).color
    const colorMax = genTheAirImage(max).color

    return {
        min,
        max,
        colorMin,
        colorMax
    };
});






</script>



<template>

    <div class="flex flex-col gap-1 justify-end items-start sm:items-end">
        <div class="w-auto sm:w-[15rem] h-[3.75rem] rounded-md flex justify-start sm:justify-end items-center gap-4">

            <div class="w-[3rem] h-[3rem] rounded-full flex justify-center items-center"
                :style="`background:${faceRender.color}`">
                <img v-if="faceRender.imgSource" :src="faceRender.imgSource" :alt="faceRender.imgSource"
                    class="w-[2.5rem] h-[2.5rem]">
            </div>

            <p class="font-sfPro font-[400] text-[#FFF] text-4xl md:text-6xl">
                {{ usAqi }}<span class="font-[200] text-xl inline-block -translate-y-[1.75rem]">AQI</span>
            </p>
        </div>
        <div class="w-full h-auto grid grid-cols-4 gap-6 justify-between">
            <p class="font-sfPro font-[300] text-[#FFFF] text-xl w-[2.625rem] block col-span-2">
                pm2.5
                <span class="block text-nowrap">{{ pm2_5 }} μg/m³</span>

            </p>
            <p class="font-sfPro font-[300] text-[#FFFF] text-xl w-[2.625rem] block col-span-1">
                Low <span :style="`color:${minMax.colorMin}`"> {{ minMax.min }}</span>
            </p>
            <p class="font-sfPro font-[300] text-[#FFFF] text-xl w-[2.625rem] block col-span-1">
                High <span :style="`color:${minMax.colorMax}`"> {{ minMax.max }}</span>
            </p>
        </div>

    </div>
</template>