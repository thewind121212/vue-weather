<template>
    <div class="bg-[#0D1321] rounded-xl aspect-square flex-1 flex justify-center items-center flex-col relative">
        <div class="text-white text-[0.875rem] font-light absolute top-3">
            {{ surfacePressure }} hPa
        </div>
        <img src="/weather_icons/barometer.svg" alt="presure-sunface" class="w-20 h-full mt-5" />
    </div>
</template>

<script setup lang="ts">
interface Props {
    surfacePressure: number
}

defineProps<Props>()
</script>
