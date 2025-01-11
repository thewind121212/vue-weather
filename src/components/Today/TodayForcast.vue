<script setup lang="ts">
import { computed, ComputedRef, defineAsyncComponent, onBeforeMount, onMounted, onRenderTriggered, ref } from 'vue';
import { HourlyAirData } from '../../types/airTypes';
import { CurrentWeatherData, WeatherCodeType, WeatherDailyData, WeatherHourlyData } from '../../types/weatherTypes';
import { useSortedInfo } from '../../store/sortInfo';
import gsap from 'gsap';
import { convertFromCelciusToFahrenheit, genTheAirImage } from '../../utils/utils';
import { useAirQualityInfo } from '../../store/airInfo';


import weatherCodeJson from '../../data/wmoMap.json';
import { useTempUnitStore } from '../../store/tempUnit';
import { mountModalHander } from '../../utils/modal';
import { ModalName } from './TodayHightLight.vue';
import { useModalStore } from '../../store/modal';

const ForcastModalHr = defineAsyncComponent(() => import('../HourReport/ForcastModalHr.vue'))

const airQuailtyInfo = useAirQualityInfo()

const weatherCode: Record<string, WeatherCodeType> = weatherCodeJson as Record<string, WeatherCodeType>;
const sortInfo = useSortedInfo()
const unit = useTempUnitStore()


const intervalRef = ref<NodeJS.Timeout | null>(null)

const modalStore = useModalStore()

const isResize = ref<boolean>(false)

const gsapTLref = gsap.timeline({
    paused: true,
    onReverseComplete: () => {
        modalStore.setModalMounted(null)
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
    mountModalHander(id, gsapTLref, isResize.value, id === 'weatherCard' ? '#forcast-today-hr' : '#modal-today-hr')
    modalStore.setModalMounted(id)
    if (isResize.value) {
        isResize.value = false
    }

}


//clerat timeline on resize keep unchange
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

        <div class="fixed top-0 left-0 z-[10002]">
            <ForcastModalHr :day="day" :hr="hr" :timeZone="timeZone" :dataHr="weatherHourly?.weather_code.slice(0, 24)"
                :unit="''" :headerName="'Today Forcast'" :weatherHourly="weatherHourly" :airHourly="airQualityHourly" />
        </div>

        <div class="bg-[#0D1321] rounded-xl flex justify-end items-center flex-col relative bg-cover bg-center overflow-hidden"
            :class="isHaveRain ? `bg-[url('/image-rain.png')]` : `bg-[url('/image-day.png')]`">
            <div class="bg-transparent w-full h-full absolute left-0 top-0 z-10 rounded-xl opacity-1 backdrop-blur-[2px] cursor-pointer opacity-0 pointer-events-none"
                :class="{ '!pointer-events-auto': modalStore.modalMounted === 'weatherCard' }"
                v-on:click="startTimeLine('weatherCard')" id="weatherCard-placeholder">
            </div>
            <div
                class="w-full h-full bg-[#0d132180] grid grid-cols-2 gap-2 px-4 backdrop-blur-[1px] cursor-default select-none">
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

                    <p class="font-light text-gray-300 text-[0.875rem] underline cursor-pointer pointer-events-none"
                        :class="{ '!pointer-events-auto': !modalStore.modalMounted }"
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
            <div class="bg-transparent w-full h-full absolute left-0 top-0 z-10 rounded-xl opacity-1 backdrop-blur-[2px] cursor-pointer opacity-0 pointer-events-none"
                :class="{ '!pointer-events-auto': modalStore.modalMounted === 'moon' }"
                v-on:click="startTimeLine('moon')" id="moon-placeholder">
            </div>
            <div
                class="w-full h-full bg-[#0d132180] grid grid-cols-2 gap-2 px-4 backdrop-blur-[1px] cursor-default select-none">
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
                    <p class="font-light text-gray-300 text-[0.875rem] underline cursor-pointer pointer-events-none"
                        v-on:click="startTimeLine('moon')" :class="{ '!pointer-events-auto': !modalStore.modalMounted }">
                        See More</p>
                </div>
                <div class="relative flex justify-center items-center ml-2">
                    <img class="size-[4.5rem] absolute" src="/moon/waxing-gibbous.svg" alt="waxing-gibbous" />
                </div>
            </div>
        </div>
        <div class="rounded-xl flex w-full h-full gap-2">
            <div
                class="bg-[#0D1321] rounded-xl bg-[url('/air.png')] bg-cover bg-center h-full overflow-hidden flex-auto">
                <div class="bg-transparent w-full h-full absolute left-0 top-0 z-10 rounded-xl opacity-1 backdrop-blur-[2px] cursor-pointer opacity-0 pointer-events-none"
                    :class="{ '!pointer-events-auto': modalStore.modalMounted === 'air' }"
                    v-on:click="startTimeLine('air')" id="air-placeholder">
                </div>
                <div class="bg-[#0d132163] w-full h-full flex px-4 justify-between items-center">
                    <div class="w-auto leading-[1.3125rem]">
                        <div class="text-white text-[0.875rem] font-light">{{ airQuailtyInfo.curentAQI }} AQI</div>
                        <div class="text-white text-[0.875rem] font-light">pm2.5: {{ airQuailtyInfo.currentPm2_5 }}
                            μg/m³</div>
                        <div class="text-white text-[0.875rem] font-light">pm10: {{ airQuailtyInfo.currentPm10 }} μg/m³
                        </div>
                        <p class="font-light text-gray-300 text-[0.875rem] underline cursor-pointer pointer-events-none"
                            :class="{ '!pointer-events-auto': !modalStore.modalMounted }"
                            v-on:click="startTimeLine('air')">See More</p>
                    </div>

                    <div class="w-[3.5rem] h-[3.5rem] rounded-full flex justify-center items-center"
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