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

const closeModal = () => {
    const id = modalStore.modalMounted
    if (!id) return
    const placeholder = document.getElementById(id + '-placeholder') as HTMLElement | null
    placeholder?.click()
}

const onPopState = () => {
    if (modalStore.modalMounted && modalStore.modalMounted !== 'weatherCard' && modalStore.modalMounted !== 'moon') {
        closeModal()
    }
}

const isMobile = ref<boolean>(typeof window !== 'undefined' ? window.innerWidth < 1024 : false)
const onResize = () => { isMobile.value = window.innerWidth < 1024 }

import { onUnmounted } from 'vue'
onMounted(() => {
    const sliderHour = localStorage.getItem("sliderHour")
    if (sliderHour) {
        toggleActive.value = JSON.parse(sliderHour)
    }
    window.addEventListener('popstate', onPopState)
    window.addEventListener('resize', onResize)
})

onUnmounted(() => {
    window.removeEventListener('popstate', onPopState)
    window.removeEventListener('resize', onResize)
})





watch(() => [props.hr, modalStore.modalMounted, slideRef.value], () => {
    if (props.hr && modalStore.modalMounted) {
        const id = modalStore.modalMounted
        if (id !== 'weatherCard' && id !== 'moon' && history.state?.modal !== id) {
            history.pushState({ modal: id }, '')
        }
        const hour = props.hr.split(":")[0]
        hrSelected.value = Number(hour)
        if (toggleActive.value && slideRef.value) {
            setTimeout(() => {
                if (slideRef.value) {
                    slideRef.value.slideTo(Number(hour), 1200, false)
                }
            }, 1000)
        }
        const scrollToRow = (attempt = 0) => {
            const el = document.getElementById('hr-row-mobile-' + Number(hour))
            const container = el?.parentElement
            if (el && container && container.scrollHeight > container.clientHeight) {
                const top = el.offsetTop - container.offsetTop - (container.clientHeight / 2) + (el.clientHeight / 2)
                container.scrollTo({ top, behavior: 'smooth' })
                el.scrollIntoView({ block: 'center', behavior: 'smooth' })
            } else if (attempt < 15) {
                setTimeout(() => scrollToRow(attempt + 1), 200)
            }
        }
        setTimeout(scrollToRow, 800)
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
    <div
        class="w-screen h-screen flex justify-center items-start fixed top-0 left-0 z-[1001] select-none invisible opacity-1 p-3 sm:p-6 overflow-y-auto pt-12 sm:pt-[7rem]">
        <button v-if="isMobile && modalStore.modalMounted && modalStore.modalMounted !== 'weatherCard' && modalStore.modalMounted !== 'moon'"
            class="fixed top-3 right-3 z-[1100] w-10 h-10 rounded-full bg-secondary flex justify-center items-center text-white"
            @click="closeModal">
            <i class="pi pi-times" style="font-size: 1.1rem"></i>
        </button>
        <div class="w-full max-w-[60.25rem] rounded-2xl pt-2 flex-col gap-4 select-none" id="modal-today-hr">
            <HeaderHr :day="day" :hr="hr" :timeZone="timeZone" />
            <div v-if="modalStore.modalMounted !== null"
                class="w-full h-auto bg-primary rounded-2xl flex justify-start items-center p-4 sm:p-8 lg:p-12 pt-6 flex-col gap-6">
                <div class="w-full flex justify-between items-start gap-2">
                    <div class="header">
                        <div class="w-auto h-auto flex justify-start gap-2 items-center relative">
                            <img v-if="modalStore.modalMounted === 'uv'" src="/weather_icons/clear-day.svg"
                                alt="uv-icon" class="w-12 h-auto absolute">
                            <img v-if="modalStore.modalMounted === 'rain'" src="/weather_icons/raindrops.svg"
                                alt="uv-icon" class="w-14 h-auto absolute left-[-0.875rem]">
                            <img v-if="modalStore.modalMounted === 'humidity'" src="/weather_icons/humidity.svg"
                                alt="uv-icon" class="w-14 h-auto absolute left-[-0.875rem]">
                            <img v-if="modalStore.modalMounted === 'cloud'" src="/weather_icons/cloudy.svg"
                                alt="uv-icon" class="w-12 h-auto absolute left-[-0.25rem]">
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
                                    pm2.5: <span v-if="dataHr" class="text-white"> {{ airHourly?.pm2_5[hrSelected] }}
                                        μg/m³
                                    </span>
                                </p>
                                <p class="font-sfPro font-[300] text-[#777b84] text-md block col-span-1 mt-1">
                                    pm.10 <span v-if="dataHr" class="text-white"> {{ airHourly?.pm10[hrSelected] ?? 0
                                        }}
                                        μg/m³ </span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div v-if="!isMobile" class="controler flex justify-center items-center gap-2">
                        <div class="w-8 h-5 flex items-center bg-gray-400 rounded-full p-[0.125rem] duration-300 ease-in-out"
                            v-on:click="toogleSlider" :class="{ '!bg-green-400': toggleActive }">
                            <div class="bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out"
                                :class="{ 'translate-x-3': toggleActive, }"></div>
                        </div>
                        <p class="text-[#777b84]">Slider {{ toggleActive ? 'On' : 'Off' }} </p>
                    </div>
                </div>
                <div class="w-full h-auto">
                    <div v-if="isMobile" class="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
                        <div v-for="(item, index) in dataHr?.slice(0, 24)" :key="'hr-row-' + index"
                            :id="'hr-row-mobile-' + index"
                            class="rounded-xl bg-secondary flex justify-between items-center px-4 py-3 cursor-pointer duration-200"
                            :class="{ '!bg-[#2a2a4a] ring-1 ring-[#7068FF]': index === hrSelected }"
                            v-on:click="hrSelected = index">
                            <h2 class="text-[#9a9ca1] text-sm w-12 shrink-0">{{ genTimeFn(index) }}</h2>
                            <img v-if="modalStore.modalMounted === 'uv'"
                                :src="`/weather_icons/uv-index-${Math.min(Math.floor(Number(item < 1 ? 0 : item ?? 0)), 11)}.svg`"
                                loading="lazy" alt="uv-icon" class="w-10 h-10">
                            <img v-if="modalStore.modalMounted === 'rain'" :src="genRainChangeImage(item, index)"
                                alt="rain-icon" loading="lazy" class="w-10 h-10">
                            <img v-if="modalStore.modalMounted === 'humidity'" loading="lazy"
                                :src="item > 50 ? '/weather_icons/raindrops.svg' : '/weather_icons/raindrop.svg'"
                                alt="humidity-icon" class="w-10 h-10">
                            <img v-if="modalStore.modalMounted === 'cloud'" :src="genCloudyCoverImage(item, index)"
                                loading="lazy" alt="cloud-icon" class="w-10 h-10">
                            <div v-if="modalStore.modalMounted == 'air'"
                                class="w-10 h-10 rounded-full flex justify-center items-center"
                                :style="`background:${faceRender.color}`">
                                <img v-if="faceRender.imgSource" :src="faceRender.imgSource"
                                    :alt="faceRender.imgSource" class="w-7 h-7">
                            </div>
                            <p v-if="modalStore.modalMounted !== 'air'" class="text-white text-base ml-auto">{{ item }} {{ unit }}</p>
                            <p v-else class="text-white text-base ml-auto">{{ item }} <span class="text-[10px]">AQI</span></p>
                        </div>
                    </div>
                    <div v-else class="w-full">
                    <swiper :slides-per-view="10" :centered-slides="false" :space-between="12" :grab-cursor="true"
                        @swiper="getRef" :free-mode="true" :pagination="{ clickable: true }"
                        class="mySwiper h-[11.5rem]">
                        <swiper-slide v-for="(item, index) in dataHr?.slice(0, 24)" :key="'hr-' + index"
                            class="h-[11.5rem] w-[2.9375rem] rounded-[1.2rem] p-[0.1rem]">
                            <div class="w-full h-[11.5rem]" v-on:click="hrSelected = index">
                                <div class="rounded-[1.2rem] gradient-bg h-[11.3rem] relative flex flex-col justify-between items-center py-4 duration-200"
                                    :class="{ 'hour-card': index === hrSelected }">
                                    <h2 class="text-[#9a9ca1]">{{ genTimeFn(index) }}</h2>
                                    <img v-if="modalStore.modalMounted === 'uv'"
                                        :src="`/weather_icons/uv-index-${Math.min(Math.floor(Number(item < 1 ? 0 : item ?? 0)), 11)}.svg`"
                                        loading="lazy" alt="uv-icon" class="w-[3.7rem] h-auto my-6">
                                    <img v-if="modalStore.modalMounted === 'rain'"
                                        :src="genRainChangeImage(item, index)" alt="uv-icon" loading="lazy"
                                        class="w-[3.7rem] h-auto my-6">
                                    <img v-if="modalStore.modalMounted === 'humidity'" loading="lazy"
                                        :src="item > 50 ? '/weather_icons/raindrops.svg' : '/weather_icons/raindrop.svg'"
                                        alt="uv-icon" class="w-[3.7rem] h-auto my-6">
                                    <img v-if="modalStore.modalMounted === 'cloud'"
                                        :src="genCloudyCoverImage(item, index)" loading="lazy" alt="uv-icon"
                                        class="w-[3.7rem] h-auto my-6">

                                    <div v-if="modalStore.modalMounted == 'air'"
                                        class="w-[2.5em] h-[2.5rem] rounded-full flex justify-center items-center"
                                        :style="`background:${faceRender.color}`">
                                        <img v-if="faceRender.imgSource" :src="faceRender.imgSource"
                                            :alt="faceRender.imgSource" class="w-[2rem] h-[2rem]">
                                    </div>

                                    <p v-if="modalStore.modalMounted !== 'air'" class="text-white">{{ item }} {{ unit }}
                                    </p>
                                    <p v-else class="text-white">{{ item }} <span
                                            class="text-[10px] inline-block -translate-y-[0.25rem]">AQI</span></p>
                                </div>
                            </div>
                        </swiper-slide>
                    </swiper>
                    </div>

                    <p v-if="modalStore.modalMounted !== 'cloud'"
                        class="font-sfPro font-[600] text-white text-md block col-span-1 mt-4">
                        Advice: <span class="font-[300] translate-y-[0.0625rem] inline-block"
                            :style="{ color: advice.color }"> {{ advice.advice }}</span>
                    </p>
                </div>
            </div>
        </div>

    </div>
</template>