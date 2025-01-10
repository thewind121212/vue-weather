<script setup lang="ts">
import { computed, ComputedRef, onBeforeMount, onMounted, onRenderTriggered, ref } from 'vue';
import { HourlyAirData } from '../../types/airTypes';
import { CurrentWeatherData, WeatherCodeType, WeatherDailyData, WeatherHourlyData } from '../../types/weatherTypes';
import { useSortedInfo } from '../../store/sortInfo';
import gsap from 'gsap';
import { convertFromCelciusToFahrenheit, genTheAirImage } from '../../utils/utils';
import { useAirQualityInfo } from '../../store/airInfo';


import weatherCodeJson from '../../data/wmoMap.json';
import { useTempUnitStore } from '../../store/tempUnit';
const airQuailtyInfo = useAirQualityInfo()

const weatherCode: Record<string, WeatherCodeType> = weatherCodeJson as Record<string, WeatherCodeType>;
const sortInfo = useSortedInfo()
const unit = useTempUnitStore()

type ModalName = 'weatherCard' | 'moon' | 'air' | 'pm2_5' | null

//need a ref from element for gsap
const weatherCardPlaceholder = ref<HTMLElement | null>(null)
const moonphasePlaceholder = ref<HTMLElement | null>(null)
const airQualityPlaceholder = ref<HTMLElement | null>(null)
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
const startTimeLine = (id: ModalName) => {

    let element: HTMLElement | null = null

    if (!weatherCardPlaceholder.value) return


    switch (id) {
        case 'weatherCard':
            element = weatherCardPlaceholder.value
            break;
        case 'moon':
            element = moonphasePlaceholder.value
            break;
        case 'air':
            element = airQualityPlaceholder.value
            break;
        default:
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
// const modalMountObject = computed<
//     {
//         dataHr: number[] | undefined,
//         unit: string,
//         headerName: string,
//     }>(() => {

//         return {
//             dataHr: [1],
//             unit: '°C',
//             headerName: 'Temperature'
//         }

//     })

const weatherCodeFetch: ComputedRef<string> = computed(() => {
    return props.weatherDaily && props.weatherDaily.weather_code[0] ? props.weatherDaily.weather_code[0].toString() : "0"
})


const isHaveRain = computed(() => {
    if (props.hr && props.weatherHourly) {
        const hr = props.hr.split(":")[0]
        return props.weatherHourly?.precipitation_probability[Number(hr)] > 0
    }
    return false
})


const isDay = computed(() => {
    const timeBaseOnTimeZone = new Date().toLocaleString("en-US", {
        timeZone: props.timeZone, hourCycle: "h23", hour: "2-digit",
        minute: "2-digit",
    });
    const hr = Number(timeBaseOnTimeZone.split(':')[0])
    return (6 < hr && hr < 18)
})



onBeforeMount(() => {
    if (intervalRef.value) {
        clearInterval(intervalRef.value)
    }
})

const faceRender = computed(() => {
    if (airQuailtyInfo.curentAQI) {
        const { color, type, imgSource } = genTheAirImage(airQuailtyInfo.curentAQI ?? 10)
        return {
            color,
            type,
            imgSource
        }
    } else {
        const { color, type, imgSource } = genTheAirImage(0)
        return {
            color,
            type,
            imgSource
        }
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
            <div class="bg-transparent w-full h-full absolute left-0 top-0 z-10 rounded-xl opacity-1 backdrop-blur-[2px] cursor-pointer opacity-0"
                :class="{ 'pointer-events-none': modalMounted === null }" ref="weatherCardPlaceholder"
                v-on:click="modalMounted === 'weatherCard' ? startTimeLine('weatherCard') : null"
                id="weatherCard-placeholder">
            </div>
            <div
                class="w-full h-full bg-[#0d132180] grid grid-cols-2 gap-2 p-2 backdrop-blur-[1px] cursor-default select-none">
                <div class="flex justify-center items-start flex-col">
                    <div class="w-full h-[1.3125rem] duration-500 flip-content" id="flip-card-weather">
                        <div class="font-light text-white text-[0.875rem] block front top-0 left-0 absolute">Tempature:
                            {{ `${convertFromCelciusToFahrenheit(weatherDaily?.temperature_2m_min[0]!, unit.tempUnit)}
                            to
                            ${convertFromCelciusToFahrenheit(weatherDaily?.temperature_2m_max[0]!, unit.tempUnit)}` }}
                        </div>
                        <div class="font-light text-white text-[0.875rem] block back top-0 left-0 absolute">Feel Like:
                            {{ `${convertFromCelciusToFahrenheit(weatherDaily?.apparent_temperature_min[0]!,
                                unit.tempUnit)} to
                            ${convertFromCelciusToFahrenheit(weatherDaily?.apparent_temperature_max[0]!,
                                    unit.tempUnit)}` }} </div>
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

                    <p class="font-light text-gray-300 text-[0.875rem] underline cursor-pointer"
                        v-on:click="startTimeLine('weatherCard')">See More</p>
                </div>
                <div class="relative flex justify-center items-center">
                    <img class="w-[8.5rem] h-[8.5rem] absolute"
                        :src="`${weatherCode?.[weatherCodeFetch][isDay ? 'image_day' : 'image_night']}`"
                        :alt="`${weatherCode?.[weatherCodeFetch][isDay ? 'image_day' : 'image_night']}`" />
                </div>
            </div>
        </div>
        <div
            class="bg-[#0D1321] rounded-xl flex justify-end items-center flex-col relative bg-[url('/image.png')] bg-cover bg-center overflow-hidden">
            <div class="bg-transparent w-full h-full absolute left-0 top-0 z-10 rounded-xl opacity-1 backdrop-blur-[2px] cursor-pointer opacity-0"
                :class="{ 'pointer-events-none': modalMounted === null }"
                v-on:click="modalMounted === 'moon' ? startTimeLine('moon') : null" ref="moonphasePlaceholder"
                id="moon-placeholder">
            </div>
            <div
                class="w-full h-full bg-[#0d132180] grid grid-cols-2 gap-2 p-2 backdrop-blur-[1px] cursor-default select-none">
                <div class="flex justify-center items-start flex-col">

                    <div class="w-full h-[1.3125rem]">
                        <div class="font-light text-white text-[0.875rem] block">Waxing Gibbous </div>
                    </div>
                    <div class="w-full h-[1.3125rem]">
                        <div class="font-light text-white text-[0.875rem] block">Full Moon in 3 day</div>
                    </div>
                    <div class="w-full h-[1.3125rem]">
                        <div class="font-light text-white text-[0.875rem] block">New Moon in 14 day</div>
                    </div>
                    <p class="font-light text-gray-300 text-[0.875rem] underline cursor-pointer"
                        v-on:click="startTimeLine('moon')">See More</p>
                </div>
                <div class="relative flex justify-center items-center">
                    <img class="size-[4.5rem] absolute" src="/moon/waxing-gibbous.svg" alt="waxing-gibbous" />
                </div>
            </div>
        </div>
        <div class="rounded-xl flex w-full h-full gap-2">
            <div
                class="bg-[#0D1321] rounded-xl bg-[url('/air.png')] bg-cover bg-center h-full overflow-hidden flex-auto">
                <div class="bg-transparent w-full h-full absolute left-0 top-0 z-10 rounded-xl opacity-1 backdrop-blur-[2px] cursor-pointer opacity-0"
                    :class="{ 'pointer-events-none': modalMounted === null }"
                    v-on:click="modalMounted === 'air' ? startTimeLine('air') : null" ref="airQualityPlaceholder"
                    id="air-placeholder">
                </div>
                <div class="bg-[#0d132163] w-full h-full flex p-2 justify-between items-center">
                    <div class="w-auto leading-[1.3125rem]">
                        <div class="text-white text-[0.875rem] font-light">{{ airQuailtyInfo.curentAQI }} AQI</div>
                        <div class="text-white text-[0.875rem] font-light">pm2.5: {{ airQuailtyInfo.currentPm2_5 }}
                            μg/m³</div>
                        <div class="text-white text-[0.875rem] font-light">pm10: {{ airQuailtyInfo.currentPm10 }} μg/m³
                        </div>
                        <p class="font-light text-gray-300 text-[0.875rem] underline cursor-pointer"
                            v-on:click="startTimeLine('air')">See More</p>
                    </div>

                    <div class="w-[3.5rem] h-[3.5rem] rounded-full flex justify-center items-center mr-4"
                        :style="`background:${faceRender.color}`">
                        <img v-if="faceRender.imgSource" :src="faceRender.imgSource" :alt="faceRender.imgSource"
                            class="w-[2.8rem] h-[2.8rem]">
                    </div>
                </div>
            </div>
            <div class="bg-[#0D1321] rounded-xl aspect-square flex-1"></div>
        </div>
    </div>
</template>