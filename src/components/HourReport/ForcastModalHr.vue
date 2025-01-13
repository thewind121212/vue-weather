<script setup lang="ts">
import { Swiper, SwiperSlide, } from 'swiper/vue';
import { computed, onMounted, ref, watch, } from 'vue';
import { Swiper as SwiperInstance } from 'swiper/types';
import HeaderHr from './HeaderHr.vue';
import { genTimeFn, convertFromCelciusToFahrenheit } from '../../utils/utils';
import { useTempUnitStore } from '../../store/tempUnit';
import weatherCodeJson from '../../data/wmoMap.json';
import { WeatherCodeType, WeatherHourlyData } from '../../types/weatherTypes';
import { HourlyAirData } from '../../types/airTypes';

import { useModalStore } from '../../store/modal';

const weatherCode: Record<string, WeatherCodeType> = weatherCodeJson as Record<string, WeatherCodeType>;


const hrSelected = ref<number>(0)
const modalStore = useModalStore()


const slideRef = ref<SwiperInstance | null>(null)
const toggleActive = ref<boolean>(true)
const unit = useTempUnitStore()


const props = defineProps({
    timeZone: String,
    hr: String,
    day: String,
    dataHr: Array<Number>,
    weatherHourly: Object as () => WeatherHourlyData,
    airHourly: Object as () => HourlyAirData,
    unit: String,
    headerName: String,
})

function getRef(swiperInstanceHere: SwiperInstance) {
    slideRef.value = swiperInstanceHere
}



const toogleSlider = () => {
    toggleActive.value = !toggleActive.value
    //set to local
    localStorage.setItem("sliderHour", JSON.stringify(toggleActive.value))
}

onMounted(() => {
    const sliderHour = localStorage.getItem("sliderHour")
    if (sliderHour) {
        toggleActive.value = JSON.parse(sliderHour)
    }
})





watch(() => [props.hr, modalStore.modalMounted, slideRef.value], () => {
    if (!toggleActive.value) return
    if (props.hr && modalStore.modalMounted && slideRef.value
    ) {
        const hour = props.hr.split(":")[0]
        hrSelected.value = Number(hour)
        if (slideRef.value) {
            setTimeout(() => {
                if (slideRef.value) {
                    slideRef.value.slideTo(Number(hour), 1200, false)
                }
            }, 1000)
        }
    } else {
        if (slideRef.value && !modalStore.modalMounted && slideRef.value) {
            if (slideRef.value) {
                slideRef.value.slideTo(Number(0), 0, false)
            }
        }
    }

})


const renderList = computed(() => {

    return [{
        staticName: ' Humidity',
        dynamicValue: (props.weatherHourly?.relative_humidity_2m[hrSelected.value]) + '%',
        iconSrc: '/weather_icons/humidity.svg',
        imgElementClasss: 'w-[3.125rem] h-[3.125rem] absolute left-[-0.75rem] top-[-0.875rem]',
        alt: 'humidity_icon',
    },
    {
        staticName: ' Rain Chance',
        dynamicValue: (props.weatherHourly?.precipitation_probability[hrSelected.value]) + '%',
        iconSrc: '/weather_icons/rain.svg',
        imgElementClasss: 'w-[2.375rem] h-[2.375rem] absolute left-[-0.375rem] top-[-0.375rem]',
        alt: 'rain_icon'
    },
    {
        staticName: 'Wind Speed',
        dynamicValue: (props.weatherHourly?.wind_speed_10m[hrSelected.value] ?? '') + 'km/h',
        iconSrc: `/weather_icons/wind.svg`,
        imgElementClasss: 'w-[2.5rem] h-[2.5rem] absolute left-[-0.375rem] top-[-0.475rem]',
        alt: 'wind_icon'
    },
    {
        staticName: 'UV index',
        dynamicValue: (props.airHourly?.uv_index[hrSelected.value] ?? ''),
        iconSrc: `/weather_icons/clear-day.svg`,
        imgElementClasss: 'w-[2.5rem] h-[2.5rem] absolute left-[-0.375rem] top-[-0.475rem]',
        alt: 'wind_icon'
    },
    {
        staticName: 'Cloudy Cover',
        dynamicValue: (props.weatherHourly?.cloud_cover[hrSelected.value] ?? '') + '%',
        iconSrc: `/weather_icons/cloudy.svg`,
        imgElementClasss: 'w-[2.5rem] h-[2.5rem] absolute left-[-0.375rem] top-[-0.475rem]',
        alt: 'wind_icon'
    },
    {
        staticName: 'Rain Flow',
        dynamicValue: (props.weatherHourly?.rain[hrSelected.value] ?? '') + 'mm',
        iconSrc: `/weather_icons/raindrop-measure.svg`,
        imgElementClasss: 'w-[3rem] h-[3rem] absolute left-[-0.675rem] top-[-0.775rem]',
        alt: 'wind_icon'
    },
    {
        staticName: 'Snow Flow',
        dynamicValue: (props.weatherHourly?.snowfall[hrSelected.value] ?? '') + 'cm',
        iconSrc: `/weather_icons/snowman.svg`,
        imgElementClasss: 'w-[2.5rem] h-[2.5rem] absolute left-[-0.375rem] top-[-0.475rem]',
        alt: 'wind_icon'
    },
    ]


})

</script>




<template>

    <div class="w-screen h-screen flex justify-center mt-[20rem] items-start fixed top-0 left-0 z-[1001] select-none
    invisible opacity-1">
        <div class="w-auto rounded-2xl pt-2 flex-col gap-4 select-none" id="forcast-today-hr">
            <HeaderHr :day="day" :hr="hr" :timeZone="timeZone" />
            <div v-if="modalStore.modalMounted === 'weatherCard'"
                class="grid w-full grid-flow-col grid-rows-1 gap-4 overflow-hidden rounded-2xl -translate-y-1/2">
                <div class="bg-primary rounded-2xl p-6  w-full h-auto flex-col aspect-square relative">
                    <div class="w-full flex justify-start items-center relative h-[3.7rem]">
                        <img :src="(hrSelected < 18 && hrSelected > 6) && weatherHourly?.weather_code[hrSelected ?? 0] ? weatherCode?.[weatherHourly?.weather_code[hrSelected ?? 0]]?.image_day : weatherCode?.[weatherHourly?.weather_code[hrSelected] ?? 0]?.image_night"
                            loading="lazy" alt="uv-icon" class="w-[3.7rem] h-auto my-6 absolute left-[-0.75rem]">

                        <p class="text-white text-bold text-xl ml-12">
                            {{ weatherCode?.[weatherHourly?.weather_code[hrSelected] ?? 0]?.category }}
                        </p>
                    </div>
                    <div class="absolute">
                        <div v-for="item of renderList" class="flex relative gap-2 justify-start items-center">
                            <div class="flex relative gap-2 justify-start items-center6">
                                <div class="w-[0.625rem] h-[1.75rem] pl-6"></div>
                                <p class="font-sfPro font-light text-[#9a9ca1] text-md w-fit">
                                    {{ item.staticName }} {{ item.dynamicValue }}
                                </p>
                                <img :class="item.imgElementClasss" :src="item.iconSrc" alt="Humidity_icon" />
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="w-[60.25rem] h-auto bg-primary rounded-2xl flex justify-start items-center p-12 pt-6 flex-col gap-6">
                    <div class="w-full flex justify-between items-start gap-2">
                        <div class="header">
                            <div class="w-auto h-auto flex justify-start gap-2 items-center relative">
                                <img src="/weather_icons/cloudy.svg" alt="uv-icon" class="w-12 h-auto absolute">
                                <div class="w-10 h-9"></div>
                                <h1 class="text-white text-2xl">{{ headerName }}</h1>
                            </div>
                        </div>
                        <div class="controler flex justify-center items-center gap-2">
                            <div class="w-8 h-5 flex items-center bg-gray-400 rounded-full p-[0.125rem] duration-300 ease-in-out"
                                v-on:click="toogleSlider" :class="{ '!bg-green-400': toggleActive }">
                                <div class="bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out"
                                    :class="{ 'translate-x-3': toggleActive, }"></div>
                            </div>
                            <p class="text-[#777b84]">Slider {{ toggleActive ? 'On' : 'Off' }} </p>
                        </div>
                    </div>
                    <div class="w-full h-auto">
                        <swiper :slides-per-view="10" :centered-slides="false" :space-between="12" :grab-cursor="true"
                            @swiper="getRef" :free-mode="true" :pagination="{ clickable: true }"
                            class="mySwiper h-[11.5rem]">
                            <swiper-slide v-for="(item, index) in dataHr?.slice(0, 24)" :key="index"
                                class="h-[11.5rem] w-[2.9375rem] rounded-[1.2rem] p-[0.1rem]">
                                <div class="w-full h-[11.5rem]" v-on:click="hrSelected = index">
                                    <div class="rounded-[1.2rem] gradient-bg h-[11.3rem] relative flex flex-col justify-start items-center py-4 duration-200"
                                        :class="{ 'hour-card': index === hrSelected }">
                                        <h2 class="text-[#9a9ca1]">{{ genTimeFn(index) }}</h2>
                                        <img :src="(index < 18 && index > 6) ? weatherCode?.[item.toString()!]?.image_day : weatherCode?.[item.toString()!]?.image_night"
                                            loading="lazy" alt="uv-icon" class="w-[3.7rem] h-auto my-6">
                                        <p class="text-white">{{ convertFromCelciusToFahrenheit(
                                            weatherHourly?.temperature_2m[index]!, unit.tempUnit) }}</p>
                                    </div>
                                </div>
                            </swiper-slide>
                        </swiper>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
