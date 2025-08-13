<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, onMounted, onRenderTriggered, ref } from 'vue';
import { HourlyAirData } from '../../types/airTypes';
import TodayMoonPhase from './TodayMoonPhase.vue';
import WeatherCard from './WeatherCard.vue';
import AirQualityCard from './AirQualityCard.vue';
import PressureCard from './PressureCard.vue';
import { CurrentWeatherData, WeatherCodeType, WeatherDailyData, WeatherHourlyData } from '../../types/weatherTypes';
import { useSortedInfo } from '../../store/sortInfo';
import gsap from 'gsap';
import { genTheAirImage } from '../../utils/utils';
import { useAirQualityInfo } from '../../store/airInfo';


import weatherCodeJson from '../../data/wmoMap.json';
import { useTempUnitStore } from '../../store/tempUnit';
import { mountModalHander } from '../../utils/modal';
import { useModalStore } from '../../store/modal';
import { ModalName } from '../../types/appTypes';

const ForcastModalHr = defineAsyncComponent(() => import('../HourReport/ForcastModalHr.vue'))
const MoonPhaseModal = defineAsyncComponent(() => import('../../moon/MoonPhaseModal.vue'))

const airQuailtyInfo = useAirQualityInfo()

const weatherCode: Record<string, WeatherCodeType> = weatherCodeJson as Record<string, WeatherCodeType>;
const sortInfo = useSortedInfo()
const unit = useTempUnitStore()


const intervalRef = ref<ReturnType<typeof setTimeout> | null>(null)

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
    mountModalHander(id, gsapTLref, isResize.value, id === 'weatherCard' ? '#forcast-today-hr' : id === 'moon' ? '#modal-moon' : '#modal-today-hr')
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

// Computed properties for weather data
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

// Computed properties for child components
const humidityRange = computed(() => ({
    min: sortInfo.humiditySort[0],
    max: sortInfo.humiditySort[23]
}))

const cloudCoverRange = computed(() => ({
    min: sortInfo.cloudCoverSort[0],
    max: sortInfo.cloudCoverSort[23]
}))

const uvIndex = computed(() => sortInfo.uvIndexSort[23])



onBeforeMount(() => {
    if (intervalRef.value) {
        clearInterval(intervalRef.value)
    }
})

const faceRender = computed(() => {
    if (airQuailtyInfo.curentAQI) {
        const { color, type, imgSource } = genTheAirImage(airQuailtyInfo.curentAQI ?? 10)
        return {
            color: color || '#000000',
            type: type || 'unknown',
            imgSource: imgSource || ''
        }
    } else {
        const { color, type, imgSource } = genTheAirImage(0)
        return {
            color: color || '#000000',
            type: type || 'unknown',
            imgSource: imgSource || ''
        }
    }
})

</script>



<template>

    <div class="gradient-bg flex-auto rounded-2xl p-6 basis-3/5 max-w-[25.625rem] h-full flex flex-col">
        <div class="flex gap-[1.25rem] justify-start items-center ml-1 mb-4">
            <span class="w-4 h-4 min-w-4 min-h-4 rounded-full bg-blue-400 -translate-y-[0.0313rem]"></span>
            <p class="text-[1rem] font-bold text-white">Today Forcast</p>
        </div>
        <div class="grid grid-rows-3 gap-2 flex-auto">

            <div class="fixed top-0 left-0 z-[10002]">
                <ForcastModalHr :day="day" :hr="hr" :timeZone="timeZone"
                    :dataHr="weatherHourly?.weather_code.slice(0, 24)" :unit="''" :headerName="'Today Forcast'"
                    :weatherHourly="weatherHourly" :airHourly="airQualityHourly" />
            </div>
            <div class="fixed top-0 left-0 z-[10001]">
                <MoonPhaseModal :timeZone="timeZone" :hr="hr" :day="day" />
            </div>

            <WeatherCard 
                :weather-daily="weatherDaily"
                :weather-hourly="weatherHourly"
                :weather-code="weatherCode"
                :temp-unit="unit.tempUnit"
                :humidity-range="humidityRange"
                :cloud-cover-range="cloudCoverRange"
                :uv-index="uvIndex"
                :is-have-rain="isHaveRain"
                :is-day="isDay"
                :modal-mounted="modalStore.modalMounted"
                :time-zone="timeZone"
                :hr="hr"
                @open-modal="startTimeLine" />
            <TodayMoonPhase :startTimeLine="startTimeLine" :day="day!" />
            <div class="rounded-xl flex w-full h-full gap-2">
                <AirQualityCard 
                    :current-a-q-i="airQuailtyInfo.curentAQI"
                    :current-pm2_5="airQuailtyInfo.currentPm2_5"
                    :current-pm10="airQuailtyInfo.currentPm10"
                    :face-render="faceRender"
                    :modal-mounted="modalStore.modalMounted"
                    @open-modal="startTimeLine" />
                <PressureCard :surface-pressure="weatherCurrent?.surface_pressure || 0" />
            </div>
        </div>
    </div>
</template>