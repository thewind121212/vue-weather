<template>
    <div style="display: flex; flex-direction: column; align-items: center;" :style="`border-radius: ${borderRadius};`">
        <svg :width="progressWidth" :height="progressHeight" :viewBox="`0 0 ${widthPx} ${heightPx}`"
            class="duration-200 rotate-180">
            <rect x="0" y="0" :width="progressWidth" :height="progressHeight" :fill="colorBackgroud"
                :rx="borderRadius" />
            <rect x="0" y="0" :width="progressWidth" :height="percentage" :fill="colorFill" class="duration-500"
                :rx="borderRadius" />
        </svg>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

const heightPx = ref(0)
const widthPx = ref(0)
const borderRadius = ref(0)

const percentage = computed(() => {
    if (props.currentValue && props.overAllValue) {
        return Math.max(((props.currentValue / props.overAllValue) * 100) * (heightPx.value / 100), (10 * heightPx.value / 100))
    }
})



const props = defineProps({
    progressWidth: String,
    progressHeight: String,
    overAllValue: Number,
    currentValue: Number,
    colorFill: String,
    colorBackgroud: String,
})


onMounted(() => {

    const getAndSetSize = () => {
        const rootFontSize = getComputedStyle(document.documentElement).fontSize;
        const remValue = parseFloat(rootFontSize);
        heightPx.value = Number(props.progressHeight?.replace("rem", "")) * remValue
        widthPx.value = Number(props.progressWidth?.replace("rem", "")) * remValue
        borderRadius.value = Number(props.progressWidth?.replace("rem", "")) * remValue / 2
    }
    window.addEventListener('resize', getAndSetSize)
    getAndSetSize()
})


</script>

<style scoped>
svg {
    display: block;
}
</style>
