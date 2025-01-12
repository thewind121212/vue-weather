<script setup lang="ts">
import { useModalStore } from '../store/modal';



const modalStore = useModalStore()
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const daysRender = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const dayIndex = new Date('2025-01-01').getDay();




const props = defineProps({
    timeZone: String,
    hr: String,
    day: String,
    dataHr: Array<number>,
    unit: String,
    headerName: String,
})




</script>




<template>
    <div class="w-[40.25rem] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001] rounded-2xl pt-2 flex-col gap-4 opacity-1 select-none"
        id="modal-today-hr">
        <div class="w-full h-auto bg-primary rounded-2xl flex justify-start items-center p-12 pt-6 flex-col gap-6">
            <div class="w-full flex justify-between items-start gap-2">
                <div class="header">
                    <div class="w-auto h-auto flex justify-start gap-2 items-center relative">
                        <h1 class="text-white text-2xl">Tran Duy Linh</h1>
                    </div>
                    <div class="w-auto">
                        <p v-if="modalStore.modalMounted !== 'air'"
                            class="font-sfPro font-[300] text-[#777b84] text-md block col-span-1 mt-1">
                            Highest Today <span v-if="dataHr"> {{ Math.max(...dataHr!) }} {{ unit }}</span>
                        </p>

                    </div>
                </div>
            </div>
            <div class="w-full h-auto p-6 flex justify-center flex-col items-center">
                <div class="w-full grid grid-cols-7 text-white text-xl border-b border-[#6b6a6a]">
                    <div v-for="item in daysRender" class="w-auto aspect-square flex justify-center items-center">
                        <p>{{ item }}</p>
                    </div>
                </div>
                <div class="w-full grid grid-cols-7 text-white text-[0.875rem] gap-2 pt-2">
                    <div v-for=" _ in (dayIndex - 1)"
                        class="w-auto aspect-square flex justify-center items-center border-[#6b6a6a] border-b ">
                    </div>
                    <div v-for=" item in (31)"
                        class="w-auto aspect-square flex justify-start items-start border-[#6b6a6a] border-b">{{  item }}
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>