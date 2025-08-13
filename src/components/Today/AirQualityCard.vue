<template>
    <div class="bg-[#0D1321] rounded-xl bg-[url('/air.webp')] bg-cover bg-center h-full overflow-hidden flex-auto">
        <div class="bg-transparent w-full h-full absolute left-0 top-0 z-10 rounded-xl opacity-1 backdrop-blur-[2px] cursor-pointer opacity-0 pointer-events-none"
            :class="{ '!pointer-events-auto': modalMounted === 'air' }"
            @click="$emit('openModal', 'air')" id="air-placeholder">
        </div>
        <div class="bg-[#0d132163] w-full h-full flex px-4 justify-between items-center">
            <div class="w-auto leading-[1.3125rem]">
                <div class="text-white text-[0.875rem] font-light">{{ currentAQI }} AQI</div>
                <div class="text-white text-[0.875rem] font-light">pm2.5: {{ currentPm2_5 }} μg/m³</div>
                <div class="text-white text-[0.875rem] font-light">pm10: {{ currentPm10 }} μg/m³</div>
                <p class="font-light text-gray-300 text-[0.875rem] underline cursor-pointer pointer-events-none"
                    :class="{ '!pointer-events-auto': !modalMounted }"
                    @click="$emit('openModal', 'air')">See More</p>
            </div>

            <div class="w-[3.5rem] h-[3.5rem] rounded-full flex justify-center items-center"
                :style="`background:${faceRender.color}`">
                <img v-if="faceRender.imgSource" 
                    :src="faceRender.imgSource" 
                    :alt="faceRender.imgSource"
                    class="w-[2.8rem] h-[2.8rem]">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ModalName } from '../../types/appTypes'

interface Props {
    currentAQI: number
    currentPm2_5: number
    currentPm10: number
    faceRender: {
        color: string
        type: string
        imgSource: string
    }
    modalMounted: string | null
}

defineProps<Props>()

defineEmits<{
    openModal: [modalName: ModalName]
}>()
</script>
