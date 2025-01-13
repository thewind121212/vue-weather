<script setup lang="tsx">
import { ref } from 'vue';
import gsap from 'gsap'


const clicked = ref<boolean>(false)


const handleClick = () => {

    if (clicked.value) return
    clicked.value = true
    gsap.to('.mail-me', {
        duration: 0.05,
        scale: 0.7,
    },
    )

    setTimeout(() => {
        clicked.value = false
        gsap.to('.mail-me', {
            duration: 0.05,
            scale: 1,
            ease: "power2.inOut"
        })
    }, 100)
}



</script>


<template>
    <div class="bg-secondary flex-auto rounded-2xl p-4 basis-1/12 max-w-[5.5rem] h-auto flex flex-col mt-auto">
        <div class="w-full h-auto flex flex-col gap-2">
            <a href="https://github.com/thewind121212/vue-weather" target="_blank"
                class="w-full aspect-square border-gray-600 border rounded-md text-white flex justify-center items-center group duration-200 bg-none hover:!bg-main-gradient hover:border-white cursor-pointer">
                <i class="pi pi-github text-gray-400 duration-200 group-hover:!text-white" style="font-size: 2rem"></i>
            </a>
            <div class="mail-me w-full aspect-square border-gray-600 border rounded-md text-white flex justify-center items-center group duration-200 bg-none hover:!bg-main-gradient hover:border-white cursor-pointer"
                v-on:click="() => handleClick()">
                <i class="pi pi-envelope text-gray-400 duration-200 group-hover:!text-white"
                    style="font-size: 2rem"></i>
            </div>
        </div>
    </div>
</template>