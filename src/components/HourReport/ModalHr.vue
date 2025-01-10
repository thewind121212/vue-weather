<script setup lang="ts">
import { Swiper, SwiperSlide, } from 'swiper/vue';
import { computed, onMounted, ref, watch, } from 'vue';
import { Swiper as SwiperInstance } from 'swiper/types';
import HeaderHr from './HeaderHr.vue';
import { getUVIndexRiskText, genTimeFn, getRainAdvice, getHumidityAdvice, genCloudyCoverImage, genRainChangeImage} from '../../utils/utils';


const hrSelected = ref<number>(0)


const slideRef = ref<SwiperInstance | null>(null)
const toggleActive = ref<boolean>(true)


const props = defineProps({
    timeZone: String,
    hr: String,
    day: String,
    dataHr: Array<number>,
    modalMounted: String,
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





watch(() => [props.hr, props.modalMounted], () => {
    if (!toggleActive.value) return
    if (props.hr && props.modalMounted) {
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
        if (slideRef.value && !props.modalMounted) {
            if (slideRef.value) {
                slideRef.value.slideTo(Number(0), 0, false)
            }
        }
    }
})


const advice = computed(() => {
    if (props.modalMounted === 'uv') {
        return getUVIndexRiskText(props.dataHr?.[hrSelected.value] ?? 0)
    }
    if (props.modalMounted === 'rain') {
        return getRainAdvice(props.dataHr?.[hrSelected.value] ?? 0)
    }
    if (props.modalMounted === 'humidity') {
        return getHumidityAdvice(props.dataHr?.[hrSelected.value] ?? 0)
    }
    return getUVIndexRiskText(props.dataHr?.[hrSelected.value] ?? 0)
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
                        <img v-if="modalMounted === 'uv'" src="/weather_icons/clear-day.svg" alt="uv-icon"
                            class="w-12 h-auto absolute">
                        <img v-if="modalMounted === 'rain'" src="/weather_icons/raindrops.svg" alt="uv-icon"
                            class="w-14 h-auto absolute left-[-0.875rem]">
                        <img v-if="modalMounted === 'humidity'" src="/weather_icons/humidity.svg" alt="uv-icon"
                            class="w-14 h-auto absolute left-[-0.875rem]">
                        <img v-if="modalMounted === 'cloud'" src="/weather_icons/cloudy.svg" alt="uv-icon"
                            class="w-12 h-auto absolute left-[-0.25rem]">
                        <div v-if="modalMounted === 'uv'" class="w-10 h-9"></div>
                        <div v-if="modalMounted === 'rain'" class="w-8 h-9"></div>
                        <div v-if="modalMounted === 'humidity'" class="w-6 h-9"></div>
                        <div v-if="modalMounted === 'cloud'" class="w-9 h-9"></div>
                        <h1 class="text-white text-2xl">{{ headerName }}</h1>
                    </div>
                    <div class="w-auto">
                        <p class="font-sfPro font-[300] text-[#777b84] text-md block col-span-1 mt-1">
                            Highest Today <span v-if="dataHr"> {{ Math.max(...dataHr!) }} {{ unit }}</span>
                        </p>
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
                            <div class="rounded-[1.2rem] gradient-bg h-[11.3rem] relative flex flex-col justify-start items-center py-4 duration-200"
                                :class="{ 'hour-card': index === hrSelected }">
                                <h2 class="text-[#9a9ca1]">{{ genTimeFn(index) }}</h2>
                                <img v-if="modalMounted === 'uv'"
                                    :src="`/weather_icons/uv-index-${Math.min(Math.floor(Number(item < 1 ? 0 : item ?? 0)), 11)}.svg`"
                                    alt="uv-icon" class="w-[3.7rem] h-auto my-6">
                                <img v-if="modalMounted === 'rain'" :src="genRainChangeImage(item, index)" alt="uv-icon"
                                    class="w-[3.7rem] h-auto my-6">
                                <img v-if="modalMounted === 'humidity'"
                                    :src="item > 50 ? '/weather_icons/raindrops.svg' : '/weather_icons/raindrop.svg'"
                                    alt="uv-icon" class="w-[3.7rem] h-auto my-6">
                                <img v-if="modalMounted === 'cloud'" :src="genCloudyCoverImage(item, index)"
                                    alt="uv-icon" class="w-[3.7rem] h-auto my-6">
                                <p class="text-white">{{ item }} {{ unit }}</p>
                            </div>
                        </div>
                    </swiper-slide>
                </swiper>

                <p v-if="modalMounted !== 'cloud'"
                    class="font-sfPro font-[600] text-white text-md block col-span-1 mt-4">
                    Advice: <span class="font-[300] translate-y-[0.0625rem] inline-block"
                        :style="{ color: advice.color }"> {{ advice.advice }}</span>
                </p>
            </div>
        </div>
    </div>
</template>