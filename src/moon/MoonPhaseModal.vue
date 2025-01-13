<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMoonStore } from '../store/moon';
import { genMoonPhaseImage } from '../utils/utils';
import { useModalStore } from '../store/modal';


const daysRender = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const moonStore = useMoonStore()
const modalStore = useModalStore()

const moonPhaseSelected = ref<number>(0)






const props = defineProps({
    timeZone: String,
    hr: String,
    day: String,
    dataHr: Array<number>,
    unit: String,
    headerName: String,
})

const dayIndex = computed(() => {
    if (props.day) {
        const month = new Date(props.day).getMonth();
        const date = new Date(props.day).getDate();
        const year = new Date(props.day).getFullYear();
        const dayIndex = new Date(`${year}-${month + 1}-01`).getDay();
        moonPhaseSelected.value = date - 1
        return dayIndex
    }
    return 0
})


const moonModalData = computed<
    {
        date: string,
        moonPhase: string
        moonImage: string
    }
>(() => {
    if (moonStore.moonState) {
        const moon = moonStore.moonState[moonPhaseSelected.value]
        const date = moon.date.split('T')[0].split('-').reverse().join('-')
        return {
            date,
            moonPhase: moon.moonPhase,
            moonImage: genMoonPhaseImage(moon.moonPhase)
        }

    }

    return {
        date: '',
        moonPhase: '',
        moonImage: '/moon/full-moon.svg'
    }
})

</script>




<template>

    <div
        class="w-screen h-screen flex justify-center items-center fixed  top-0 left-0 z-[1001] select-none invisible opacity-1">
        <div class="w-[40.25rem]  rounded-2xl pt-2 flex-col gap-4" id="modal-moon">
            <div v-if="modalStore.modalMounted === 'moon'" class="flex justify-start items-center gap-2">
                <div class="text-white flex justify-start items-center gap-2">
                    <span
                        class="animate-pulse size-[1rem] max-w-6 max-h-6 rounded-full bg-red-400 -translate-y-[0.0313rem]"></span>
                    <h1 class="text-md">{{ hr }}</h1>
                </div>
                <div class="text-white flex justify-start items-center gap-2">
                    <span
                        class="animate-pulse size-[1rem] max-w-6 max-h-6 rounded-full bg-green-400 -translate-y-[0.0313rem]"></span>
                    <h1 class="text-md">{{ day }}</h1>
                </div>
            </div>
            <div class="w-full h-auto bg-primary rounded-2xl flex justify-start items-center p-12 pt-6 flex-col gap-6">
                <div class="w-full flex justify-between items-center gap-2">
                    <div class="header">
                        <div class="w-auto h-auto flex justify-start gap-2 items-center relative">
                            <h1 class="text-white text-2xl">Moon Phase</h1>
                        </div>
                        <div class="w-auto">
                            <p class="font-sfPro font-[300] text-[#777b84] text-md block col-span-1 mt-1">
                                Date: <span class="text-white"> {{ moonModalData.date }}</span>
                            </p>
                            <p class="font-sfPro font-[300] text-[#777b84] text-md block col-span-1 mt-1">
                                Type: <span class="text-yellow-200"> {{ moonModalData.moonPhase }}</span>
                            </p>
                        </div>
                    </div>
                    <div class="text-white flex justify-end items-center gap-2">
                        <img :src="moonModalData.moonImage" alt="moon-phase" class="w-[4rem] h-auto duration-200">

                    </div>
                </div>
                <div class="w-full h-auto p-6 flex justify-center flex-col items-center">
                    <div class="w-full grid grid-cols-7 text-white text-xl border-b border-[#6b6a6a]">
                        <div v-for="item in daysRender" class="w-auto aspect-square flex justify-center items-center">
                            <p>{{ item }}</p>
                        </div>
                    </div>
                    <div class="w-full grid grid-cols-7 text-white text-[0.875rem] gap-2 pt-2">
                        <div v-for=" _ in (dayIndex ? dayIndex - 1 : 0)"
                            class="w-auto aspect-square flex justify-center items-center border-[#6b6a6a] ">
                        </div>
                        <div v-for=" (item, index) in moonStore.moonState"
                            class="w-auto aspect-square flex justify-center items-center border-[#494949] border p-1 rounded-md text-[#777b84] relative cursor-pointer duration-200"
                            :class="{ 'bg-[#49494977] border-yellow-200 !text-yellow-200': index === moonPhaseSelected }"
                            @click="moonPhaseSelected = index">
                            <p class="block absolute top-1 left-1 font-light">{{ index + 1 }}</p>
                            <div class="ml-2 mt-2 relative">
                                <img :src="genMoonPhaseImage(item.moonPhase)" alt="moon-phase"
                                    class="w-[2.45rem] h-auto">
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>