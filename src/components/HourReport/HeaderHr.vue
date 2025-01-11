<script setup lang="ts">

defineProps({
    hr: String,
    day: String,
    timeZone: String
})

</script>

<template>
    <div class="flex justify-end items-center gap-2 w-[60.25rem] ml-auto">
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
        <div class="text-white flex justify-start items-center gap-2 ml-auto">
            <span
                class="animate-pulse size-[1rem] max-w-6 max-h-6 rounded-full bg-yellow-400 -translate-y-[0.0313rem]"></span>
            <h1 class="text-md">{{ timeZone }}</h1>
        </div>
    </div>
</template>