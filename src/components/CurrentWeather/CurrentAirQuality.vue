<script setup lang="tsx">
import { computed, reactive, watch } from 'vue';
import { HourlyAirData, FaceType } from '../../types/airTypes';
import { genTheAirImage } from '../../utils/utils';

const props = defineProps({
    usAqi: Number,
    pm2_5: Number,
    airHourly: Object as () => HourlyAirData,
})



const faceRender = reactive<
    {
        color: string | null,
        type: FaceType
        imgSource: string | null
    }
>({
    color: null,
    type: "good",
    imgSource: null
})




watch(() => props.usAqi, () => {
    const { color, type, imgSource } = genTheAirImage(props.usAqi ?? 0)

    faceRender.color = color
    faceRender.type = type as FaceType
    faceRender.imgSource = imgSource

}, { immediate: true })


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

    <div class="flex flex-col gap-1 justify-end items-end">
        <div class="w-[15rem] h-[3.75rem] rounded-md flex justify-end items-center gap-4">

            <div class="w-[3.375rem] h-[3.375rem] rounded-full flex justify-center items-center"
                :style="`background:${faceRender.color}`">
                <img v-if="faceRender.imgSource" :src="faceRender.imgSource" :alt="faceRender.imgSource"
                    class="w-[3rem] h-[3rem]">
            </div>

            <p class="font-sfPro font-[400] text-[#FFF] text-6xl">
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