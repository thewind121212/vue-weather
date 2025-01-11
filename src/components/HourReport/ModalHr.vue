<script setup lang="ts">
import { Swiper, SwiperSlide, } from 'swiper/vue';
import { computed, onMounted, ref, watch, } from 'vue';
import { Swiper as SwiperInstance } from 'swiper/types';
import HeaderHr from './HeaderHr.vue';
import { getUVIndexRiskText, genTimeFn, getRainAdvice, getHumidityAdvice, genCloudyCoverImage, genRainChangeImage, genTheAirImage, getAQIRiskText } from '../../utils/utils';
import { useModalStore } from '../../store/modal';
import { HourlyAirData } from '../../types/airTypes';



const modalStore = useModalStore()

const hrSelected = ref<number>(0)


const slideRef = ref<SwiperInstance | null>(null)
const toggleActive = ref<boolean>(true)



const props = defineProps({
    timeZone: String,
    hr: String,
    day: String,
    dataHr: Array<number>,
    airHourly: Object as () => HourlyAirData,
    unit: String,
    headerName: String,
})

function getRef(swiperInstanceHere: SwiperInstance) {
    slideRef.value = swiperInstanceHere
}


const toogleSlider = () => {
    toggleActive.value = !toggleActive.value
    localStorage.setItem("sliderHour", JSON.stringify(toggleActive.value))
}

onMounted(() => {
    const sliderHour = localStorage.getItem("sliderHour")
    if (sliderHour) {
        toggleActive.value = JSON.parse(sliderHour)
    }
})





watch(() => [props.hr, modalStore.modalMounted], () => {
    if (!toggleActive.value) return
    if (props.hr && modalStore.modalMounted) {
        const hour = props.hr.split(":")[0]
        hrSelected.value = Number(hour)
        if (slideRef.value) {
            setTimeout(() => {
                if (slideRef.value) {
                    slideRef.value.slideTo(Number(hour), 1200, false)
                }
            }, 1000)
        }
    }
})


const advice = computed(() => {
    if (modalStore.modalMounted === 'uv') {
        return getUVIndexRiskText(props.dataHr?.[hrSelected.value] ?? 0)
    }
    if (modalStore.modalMounted === 'rain') {
        return getRainAdvice(props.dataHr?.[hrSelected.value] ?? 0)
    }
    if (modalStore.modalMounted === 'humidity') {
        return getHumidityAdvice(props.dataHr?.[hrSelected.value] ?? 0)
    }
    if (modalStore.modalMounted === 'air') {
        return getAQIRiskText(props.airHourly?.us_aqi[hrSelected.value] ?? 0)
    }
    return getUVIndexRiskText(props.dataHr?.[hrSelected.value] ?? 0)
})



const faceRender = computed(() => {
    if (modalStore.modalMounted === 'air') {
        const { color, type, imgSource } = genTheAirImage(props.airHourly?.us_aqi[hrSelected.value] ?? 10)
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
    <div class="w-[60.25rem] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001] rounded-2xl pt-2 flex-col gap-4 invisible opacity-0 select-none"
        id="modal-today-hr">
        <HeaderHr :day="day" :hr="hr" :timeZone="timeZone" />
        <div class="w-full h-auto bg-primary rounded-2xl flex justify-start items-center p-12 pt-6 flex-col gap-6">
            <div class="w-full flex justify-between items-start gap-2">
                <div class="header">
                    <div class="w-auto h-auto flex justify-start gap-2 items-center relative">
                        <img v-if="modalStore.modalMounted === 'uv'" src="/weather_icons/clear-day.svg" alt="uv-icon"
                            class="w-12 h-auto absolute">
                        <img v-if="modalStore.modalMounted === 'rain'" src="/weather_icons/raindrops.svg" alt="uv-icon"
                            class="w-14 h-auto absolute left-[-0.875rem]">
                        <img v-if="modalStore.modalMounted === 'humidity'" src="/weather_icons/humidity.svg"
                            alt="uv-icon" class="w-14 h-auto absolute left-[-0.875rem]">
                        <img v-if="modalStore.modalMounted === 'cloud'" src="/weather_icons/cloudy.svg" alt="uv-icon"
                            class="w-12 h-auto absolute left-[-0.25rem]">
                        <div v-if="modalStore.modalMounted === 'uv'" class="w-10 h-9"></div>
                        <div v-if="modalStore.modalMounted === 'rain'" class="w-8 h-9"></div>
                        <div v-if="modalStore.modalMounted === 'humidity'" class="w-6 h-9"></div>
                        <div v-if="modalStore.modalMounted === 'cloud'" class="w-9 h-9"></div>
                        <h1 class="text-white text-2xl">{{ headerName }}</h1>
                    </div>
                    <div class="w-auto">
                        <p v-if="modalStore.modalMounted !== 'air'"
                            class="font-sfPro font-[300] text-[#777b84] text-md block col-span-1 mt-1">
                            Highest Today <span v-if="dataHr"> {{ Math.max(...dataHr!) }} {{ unit }}</span>
                        </p>
                        <div v-else class="flex flex-col leading-[1rem]">
                            <p class="font-sfPro font-[300] text-[#777b84] text-md block col-span-1 mt-1">
                                pm2.5: <span v-if="dataHr" class="text-white"> {{ airHourly?.pm2_5[hrSelected] }} μg/m³
                                </span>
                            </p>
                            <p class="font-sfPro font-[300] text-[#777b84] text-md block col-span-1 mt-1">
                                pm.10 <span v-if="dataHr" class="text-white"> {{ airHourly?.pm2_5[hrSelected] ?? 0 }}
                                    μg/m³ </span>
                            </p>
                        </div>
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
                    @swiper="getRef" :free-mode="true" :pagination="{ clickable: true }" class="mySwiper h-[11.5rem]">
                    <swiper-slide v-for="(item, index) in dataHr?.slice(0, 24)" :key="index"
                        class="h-[11.5rem] w-[2.9375rem] rounded-[1.2rem] p-[0.1rem]">
                        <div class="w-full h-[11.5rem]" v-on:click="hrSelected = index">
                            <div class="rounded-[1.2rem] gradient-bg h-[11.3rem] relative flex flex-col justify-between items-center py-4 duration-200"
                                :class="{ 'hour-card': index === hrSelected }">
                                <h2 class="text-[#9a9ca1]">{{ genTimeFn(index) }}</h2>
                                <img v-if="modalStore.modalMounted === 'uv'"
                                    :src="`/weather_icons/uv-index-${Math.min(Math.floor(Number(item < 1 ? 0 : item ?? 0)), 11)}.svg`"
                                    loading="lazy" alt="uv-icon" class="w-[3.7rem] h-auto my-6">
                                <img v-if="modalStore.modalMounted === 'rain'" :src="genRainChangeImage(item, index)"
                                    alt="uv-icon" loading="lazy" class="w-[3.7rem] h-auto my-6">
                                <img v-if="modalStore.modalMounted === 'humidity'" loading="lazy"
                                    :src="item > 50 ? '/weather_icons/raindrops.svg' : '/weather_icons/raindrop.svg'"
                                    alt="uv-icon" class="w-[3.7rem] h-auto my-6">
                                <img v-if="modalStore.modalMounted === 'cloud'" :src="genCloudyCoverImage(item, index)"
                                    loading="lazy" alt="uv-icon" class="w-[3.7rem] h-auto my-6">

                                <div v-if="modalStore.modalMounted == 'air'"
                                    class="w-[2.5em] h-[2.5rem] rounded-full flex justify-center items-center"
                                    :style="`background:${faceRender.color}`">
                                    <img v-if="faceRender.imgSource" :src="faceRender.imgSource"
                                        :alt="faceRender.imgSource" class="w-[2rem] h-[2rem]">
                                </div>

                                <p v-if="modalStore.modalMounted !== 'air'" class="text-white">{{ item }} {{ unit }}</p>
                                <p v-else class="text-white">{{ item }} <span
                                        class="text-[10px] inline-block -translate-y-[0.25rem]">AQI</span></p>
                            </div>
                        </div>
                    </swiper-slide>
                </swiper>

                <p v-if="modalStore.modalMounted !== 'cloud'"
                    class="font-sfPro font-[600] text-white text-md block col-span-1 mt-4">
                    Advice: <span class="font-[300] translate-y-[0.0625rem] inline-block"
                        :style="{ color: advice.color }"> {{ advice.advice }}</span>
                </p>
            </div>
        </div>
    </div>
</template>