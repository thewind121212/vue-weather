<script setup lang="ts">

import { Vue3Lottie } from 'vue3-lottie'


import WatermelonJSON from '../../vendor/Lottie/Find.json'


</script>


<template>

    <div
        class="fixed top-0 left-0 bg-[#060c1a] z-[2000] w-screen h-screen flex justify-center items-center backdrop-blur-md">
        <div class="w-[28rem] h-[28rem] rounded-[30% 70% 70% 30% / 30% 56% 44% 70% ] bg-white flex justify-center items-center"
            style="border-radius: 30% 70% 70% 30% / 30% 30% 70% 70% ;">
            <Vue3Lottie :animationData="WatermelonJSON" :height="200" :width="200" class="w-[20.75rem]" />

        </div>
    </div>

</template>