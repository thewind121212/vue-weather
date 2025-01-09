<script setup lang="ts">
import { computed, ComputedRef, onBeforeMount, onMounted, onRenderTriggered, reactive, ref, watch } from 'vue';
import { HourlyAirData } from '../../types/airTypes';
import { CurrentWeatherData, WeatherCodeType, WeatherDailyData, WeatherHourlyData } from '../../types/weatherTypes';
import { useSortedInfo } from '../../store/sortInfo';
import gsap from 'gsap';


import weatherCodeJson from '../../data/wmoMap.json';

const weatherCode: Record<string, WeatherCodeType> = weatherCodeJson as Record<string, WeatherCodeType>;
const sortInfo = useSortedInfo()

type ModalName = 'uv' | 'rain' | 'cloud' | 'humidity' | null

//need a ref from element for gsap
const uvElement = ref<HTMLElement[] | null>(null)
const intervalRef = ref<NodeJS.Timeout | null>(null)

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
    weatherCurrent: Object as () => CurrentWeatherData,
    airQualityHourly: Object as () => HourlyAirData,
    timeZone: String,
    hr: String,
    day: String
})



//logic start mount modal
const startTimeLine = (id: 'uv' | 'rain' | 'cloud' | 'humidity') => {

    let element: HTMLElement | null = null

    if (!uvElement.value) return


    element = uvElement.value[0]


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
                `#$forcast-today-hr`, {
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
    modalMounted.value = id
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
        .fromTo(`#forcast-today-hr`, {
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

}


//clerat timeline on resize keep unchange
onMounted(() => {
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

    const flipCard = document.querySelectorAll('#flip-card-weather') as NodeListOf<HTMLElement>

    intervalRef.value = setInterval(() => {
        flipCard.forEach((card) => {
            card.classList.toggle('fliped')
        })
    }, 2500)

})

onRenderTriggered(() => {
    if (!intervalRef.value) {
        const flipCard = document.querySelectorAll('#flip-card-weather') as NodeListOf<HTMLElement>
        intervalRef.value = setInterval(() => {
            flipCard.forEach((card) => {
                card.classList.toggle('fliped')
            })
        }, 2500)
    }
})

//compute for premodal
const modalMountObject = computed<
    {
        dataHr: number[] | undefined,
        unit: string,
        headerName: string,
    }>(() => {

        return {
            dataHr: [1],
            unit: '°C',
            headerName: 'Temperature'
        }

    })

const weatherCodeFetch: ComputedRef<string> = computed(() => {
    return props.weatherCurrent && props.weatherCurrent.weather_code ? props.weatherCurrent.weather_code.toString() : "0"
})


const isHaveRain = computed(() => {
    if (props.hr && props.weatherHourly) {
        const hr = props.hr.split(":")[0]
        return props.weatherHourly?.precipitation_probability[Number(hr)] > 0
    }
    return false
})




onBeforeMount(() => {
    if (intervalRef.value) {
        clearInterval(intervalRef.value)
    }
})


</script>




<template>
    <div class="grid grid-rows-3 gap-2 flex-auto">

        <!-- modal render here -->

        <!-- render card dynamic here -->

        <!-- render card static here -->

        <div class="bg-[#0D1321] rounded-xl flex justify-end items-center flex-col relative bg-cover bg-center overflow-hidden"
            :class="isHaveRain ? `bg-[url('/image-rain.png')]` : `bg-[url('/image-day.png')]`">
            <div class="w-full h-full bg-[#0d132180] grid grid-cols-2 gap-2 p-2 backdrop-blur-[1px]">
                <div class="flex justify-center items-start flex-col">
                    <div class="w-full h-[1.3125rem] duration-500 flip-content" id="flip-card-weather">
                        <div class="font-light text-white text-[0.875rem] block front top-0 left-0 absolute">Tempature:
                            {{ `${weatherDaily?.temperature_2m_min[0]}°C - ${weatherDaily?.temperature_2m_max[0]}°C` }}
                        </div>
                        <div class="font-light text-white text-[0.875rem] block back top-0 left-0 absolute">Feel Like:
                            {{ `${weatherDaily?.apparent_temperature_min[0]}°C - ${weatherDaily?.apparent_temperature_max[0]}°C` }} </div>
                    </div>
                    <div class="w-full h-[1.3125rem] duration-500 flip-content" id="flip-card-weather">
                        <div class="font-light text-white text-[0.875rem] block front top-0 left-0 absolute">Humidity:
                            {{ `${sortInfo.humiditySort[0]}% - ${sortInfo.humiditySort[23]}%` }}
                        </div>
                        <div class="font-light text-white text-[0.875rem] block back top-0 left-0 absolute">RainChance:
                            {{ weatherDaily?.precipitation_probability_max[0] }}%
                        </div>
                    </div>
                    <div class="w-full h-[1.3125rem] duration-500 flip-content" id="flip-card-weather">
                        <div class="font-light text-white text-[0.875rem] block front top-0 left-0 absolute">UV index:
                            {{ `${sortInfo.uvIndexSort[23]}` }}
                        </div>
                        <div class="font-light text-white text-[0.875rem] block back top-0 left-0 absolute">Cloud Cover:
                            {{ `${sortInfo.cloudCoverSort[0]}% - ${sortInfo.cloudCoverSort[23]}%` }}
                        </div>
                    </div>

                    <p class="font-light text-gray-300 text-[0.875rem] underline">See More </p>
                </div>
                <div class="relative flex justify-center items-center">
                    <img class="w-[8.5rem] h-[8.5rem] absolute"
                        :src="`${weatherCode?.[weatherCodeFetch][false ? 'image_day' : 'image_night']}`"
                        :alt="`${weatherCode?.[weatherCodeFetch][false ? 'image_day' : 'image_night']}`" />
                </div>
            </div>
        </div>
        <div
            class="bg-[#0D1321] rounded-xl flex justify-end items-center flex-col relative bg-[url('/image.png')] bg-cover bg-center overflow-hidden">
            <div class="w-full h-full bg-[#0d132180]">
                <h1 class="text-white">Moon Phase</h1>

            </div>
        </div>
        <div class="rounded-xl grid grid-flow-col relative gap-2">
            <div class="bg-[#0D1321] rounded-xl"></div>
            <div class="bg-[#0D1321] rounded-xl"></div>
        </div>
    </div>
</template>