<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { HourlyAirData } from '../../types/airTypes';
import { WeatherDailyData, WeatherHourlyData } from '../../types/weatherTypes';
import ProgressCircle from '../svg/ProgressCircle.vue';
import HrModal from '../HourReport/ModalHr.vue';
import gsap from 'gsap';
import { useSortedInfo } from '../../store/sortInfo';
import { returnModalType } from '../../utils/modal';

type ModalName = 'uv' | 'rain' | 'cloud' | 'humidity' | null

const sortedInfo = useSortedInfo()



const modalMounted = ref<ModalName>(null)
const gsapTLref = gsap.timeline({
    paused: true,
    onReverseComplete: () => {
        modalMounted.value = null
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


    let element: HTMLElement | null = null



    switch (id) {
        case 'uv':
            element = document.getElementById('uv-placeholder')
            break;
        case 'rain':
            element = document.getElementById('rain-placeholder')
            break;
        case 'humidity':
            element = document.getElementById('humidity-placeholder')
            break;
        case 'cloud':
            element = document.getElementById('cloud-placeholder')
            break;
    }


    if (gsapTLref.isActive() || !element) return



    const { x, y, width, height } = element.parentElement?.getBoundingClientRect() as DOMRect
    const remValue = parseFloat(getComputedStyle(document.documentElement).fontSize)


    if (!gsapTLref.reversed() && !gsapTLref.paused()) {
        if (gsapTLref.getChildren().length === 0) {
            gsap.to(
                `#${id}-placeholder`,
                {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "transparent",
                    opacity: 0,
                    zIndex: 10,
                    duration: 0.2,
                    borderRadius: "0.75rem",
                }
            )
            gsap.to(
                `#$modal-today-hr`, {
                display: "none",
                opacity: 0,
                duration: 0,
            })
            gsapTLref.reverse()
            return
        }
        gsapTLref.reverse()
        return
    }

    gsapTLref.clear()
    const idE = `#${id}-placeholder`
    gsapTLref.
        to(idE, {
            position: "fixed",
            top: `${y / remValue}rem`,
            left: `${x / remValue}rem`,
            width: `${width / remValue}rem`,
            cursor: "default",
            height: `${height / remValue}rem`,
            duration: 0,
            opacity: 0,
            zIndex: 1000,
        }, '<')
        .to(idE, {
            backgroundColor: "rgba(0,0,0,0.9)",
            duration: 0.4,
            opacity: 0.8,
        }, '>')
        .to(idE, {
            top: 0,
            left: 0,
            width: "100vw",
            opacity: 1,
            height: "100vh",
            borderRadius: "0",
            duration: 0.5,
            animation: "power2.inOut",
        }, '>')
        .fromTo(`#modal-today-hr`, {
            duration: 0.4,
            display: "none",
            opacity: 0,
            visibility: "hidden",
            y: -50,
        }, {
            opacity: 1,
            display: "flex",
            duration: 0.3,
            visibility: "visible",
            animation: "power2.inOut",
            y: 0,
        }, '>')

    gsapTLref.play()
    modalMounted.value = id

}


onMounted(() => {
    console.log("he")
    window.addEventListener("resize", () => {
        if (!gsapTLref.isActive()) {
            gsapTLref.clear()
        }
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

        return returnModalType(modalMounted.value!,
            props.airQualityHourly?.uv_index.slice(0, 24)!,
            props.weatherHourly?.precipitation_probability.slice(0, 24)!,
            props.weatherHourly?.cloud_cover.slice(0, 24)!,
            props.weatherHourly?.relative_humidity_2m.slice(0, 24)!,
        )
    })


</script>




<template>
    <div class="grid grid-cols-3 grid-rows-2 h-[12.25rem] gap-2 max-[1870px]:grid-cols-2">

        <div class="fixed top-0 left-0 z-[10002]">
            <HrModal :day="day" :hr="hr" :timeZone="timeZone" :dataHr="modalMountObject.dataHr"
                :modalMounted="modalMounted!" :unit="modalMountObject.unit" :headerName="modalMountObject.headerName" />
        </div>
        <div v-for="(item, index) in todayData" :key="index"
            class="bg-[#0D1321] rounded-xl flex justify-center items-center flex-col relative overflow-hidden"
            :class="item.order">
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