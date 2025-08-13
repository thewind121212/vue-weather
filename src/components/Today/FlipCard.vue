<template>
    <div class="w-full h-[1.3125rem] duration-500 flip-content" id="flip-card-weather">
        <div class="font-light text-white text-[0.875rem] block front top-0 left-0 absolute">
            <slot name="front"></slot>
        </div>
        <div class="font-light text-white text-[0.875rem] block back top-0 left-0 absolute">
            <slot name="back"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
// Reusable flip card component for weather information
</script>
