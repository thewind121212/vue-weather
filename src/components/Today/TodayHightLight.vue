<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref } from 'vue';
import { HourlyAirData } from '../../types/airTypes';
import { WeatherDailyData, WeatherHourlyData } from '../../types/weatherTypes';
import ProgressCircle from '../svg/ProgressCircle.vue';
import gsap from 'gsap';
import { useSortedInfo } from '../../store/sortInfo';
import { mountModalHander, returnModalType } from '../../utils/modal';
import { useModalStore } from '../../store/modal';


const HrModal = defineAsyncComponent(() => import('../HourReport/ModalHr.vue'))


const sortedInfo = useSortedInfo()



const isResize = ref<boolean>(false)
const modalStore = useModalStore()
const gsapTLref = gsap.timeline({
    paused: true,
    onReverseComplete: () => {
        modalStore.setModalMounted(null)
    }
})

const props = defineProps({
    weatherDaily: Object as () => WeatherDailyData,
    weatherHourly: Object as () => WeatherHourlyData,
    airQualityHourly: Object as () => HourlyAirData,
    timeZone: String,
    hr: String,
    day: String
})


const todayData = computed<{
    id: string
    title: string
    value: number
    order: string
    max: number
    linkColor: "progressGradient" | "humidity" | "cloud"
    unit: string
}[]>(() => {
    const rainChance = props.weatherDaily?.precipitation_probability_max[0] ?? 0;
    const humidity = (
        (sortedInfo.$state.humiditySort.reduce((acc, curr) => acc + curr, 0) ?? 0) / 24
    ).toFixed(0);
    const cloudCover = (
        (sortedInfo.$state.cloudCoverSort.reduce((acc, curr) => acc + curr, 0) ?? 0) / 24
    ).toFixed(0);

    return [{
        id: "uv",
        title: 'UV index Max',
        order: 'order-1',
        value: sortedInfo.uvIndexSort[23] ?? 5,
        linkColor: "progressGradient",
        max: 13,
        unit: '',
    },
    {
        id: "rain",
        title: 'Rain Chance Max',
        order: 'order-2',
        value: Number(rainChance),
        linkColor: "progressGradient",
        max: 100,
        unit: '%',
    },
    {
        id: "humidity",
        title: 'Humidity Avg',
        order: 'order-4',
        max: 100,
        linkColor: "humidity",
        value: Number(humidity),
        unit: '%',
    },
    {
        id: "cloud",
        title: 'Cloud Cover Avg',
        order: 'order-5',
        linkColor: "cloud",
        max: 100,
        value: Number(cloudCover),
        unit: '%',
    }
        ,]
});


const sunCalc = computed<{
    sunrise: string
    sunset: string
}>(() => {

    const sunrise = props.weatherDaily?.sunrise[0].split("T")[1] as string
    const sunset = props.weatherDaily?.sunset[0].split("T")[1] as string

    return {
        sunrise,
        sunset
    }
})


const startTimeLine = (id: 'uv' | 'rain' | 'cloud' | 'humidity') => {

    mountModalHander(id, gsapTLref, isResize.value)
    modalStore.setModalMounted(id)
    if (isResize.value) {
        isResize.value = false
    }
}


onMounted(() => {
    window.addEventListener("resize", () => {
        isResize.value = true
    })
    window.addEventListener("keydown", (e) => {
        if (e.code === 'Escape') {
            if (!gsapTLref.isActive()) {
                gsapTLref.reverse()
            }
        }
    })
})

const modalMountObject = computed<
    {
        dataHr: number[] | undefined,
        unit: string,
        headerName: string,
    }>(() => {

        return returnModalType(modalStore.modalMounted!,
            props.airQualityHourly?.uv_index.slice(0, 24)!,
            props.weatherHourly?.precipitation_probability.slice(0, 24)!,
            props.weatherHourly?.cloud_cover.slice(0, 24)!,
            props.weatherHourly?.relative_humidity_2m.slice(0, 24)!,
            props.airQualityHourly?.us_aqi.slice(0, 24)!,
        )
    })


</script>




<template>
    <div class="grid grid-cols-3 grid-rows-2 h-[12.25rem] gap-2 max-[1870px]:grid-cols-2">

        <div class="fixed top-0 left-0 z-[10002]">
            <HrModal :day="day" :hr="hr" :timeZone="timeZone" :dataHr="modalMountObject.dataHr"
                :unit="modalMountObject.unit" :headerName="modalMountObject.headerName"
                :air-hourly="airQualityHourly" />
        </div>
        <div v-for="(item, index) in todayData" :key="index"
            class="bg-[#0D1321] rounded-xl flex justify-center items-center flex-col relative overflow-hidden"
            :class="item.order"
            :style="{ pointerEvents: (modalStore.modalMounted === item.id || modalStore.modalMounted === null) ? 'auto' : 'none' }">

            <div class="bg-transparent w-full h-full absolute left-0 top-0 z-[1000] rounded-xl opacity-0 backdrop-blur-[2px] cursor-pointer"
                v-on:click="startTimeLine(item.id as 'uv' | 'rain' | 'cloud' | 'humidity')"
                :id="(item.id.toLowerCase()) + '-placeholder'">
            </div>
            <h3 class="text-white text-[0.875rem] text-left font-light">{{ item.title }}</h3>
            <p class="absolute text-white font-semibold bottom-2 text-xl">{{ item.value }} {{ item.unit }}</p>

            <ProgressCircle :bg-stroke-color="'#fff'" :stroke-width=0.3 :svg-width="5.625" :svg-height="3.125"
                :stroke-width-bg="0.15" :current-value="item.value" :radius="2.5" :max-value="item.max"
                :rounded-cap="true" :link-color="item.linkColor" />
        </div>

        <div
            class="bg-[#0D1321] rounded-xl flex justify-end items-center flex-col relative max-[1880px]:hidden order-3">
            <img src="/weather_icons/sunrise.svg" alt="sunrise" class="w-[6.25rem] translate-y-[1.4rem]">
            <h3 class="text-white text-[0.875rem] text-left font-semibold -translate-y-2 animate-pulse">{{
                sunCalc.sunrise }}</h3>
        </div>
        <div
            class="bg-[#0D1321] rounded-xl flex justify-end items-center flex-col relative max-[1880px]:hidden order-6">
            <img src="/weather_icons/sunset.svg" alt="sunrise" class="w-[6.25rem] translate-y-[1.2rem]">
            <h3 class="text-white text-[0.875rem] text-left font-semibold -translate-y-2 animate-pulse">{{
                sunCalc.sunset }}</h3>
        </div>
    </div>
</template>