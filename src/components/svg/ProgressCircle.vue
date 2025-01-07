<template>
  <div>
    <svg :width="svgWidth" :height="svgHeight" :viewBox="`0 0 ${svgWidth} ${svgHeight}`">
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#32E1A0" />
          <stop offset="23%" stop-color="#EEED56" />
          <stop offset="50%" stop-color="#EFBF39" />
          <stop offset="75%" stop-color="#E59148" />
          <stop offset="100%" stop-color="#ED4D4D" />
        </linearGradient>
      </defs>
      <path :d="halfCirclePath" fill="none" :stroke="bgStrokeColor" :stroke-width="strokeWidth"
        :stroke-linecap="roundedCap ? 'round' : 'butt'" />
      <path :d="halfCirclePath" fill="none" stroke="url(#progressGradient)" :stroke-width="strokeWidth"
        :stroke-dasharray="dashArray" class="duration-300" :stroke-linecap="roundedCap ? 'round' : 'butt'" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';


const props = defineProps({
  svgWidth: Number,
  svgHeight: Number,
  radius: Number,
  strokeWidth: Number,
  bgStrokeColor: String,
  roundedCap: Boolean,
  maxValue: Number,
  currentValue: Number
});

const percentage = computed(() => {
  if (!props.currentValue || !props.maxValue) {
    return 0;
  }
  return (props.currentValue / props.maxValue) * 100;
});

const circumference = computed(() => Math.PI * props.radius!);

const halfCirclePath = computed(
  () => `M ${props.strokeWidth},${props.radius! + props.strokeWidth!} a ${props.radius},${props.radius!} 0 1,1 ${props.radius! * 2},0`
);


// that is the value that you can change to see the progress
const dashArray = computed(() => `${(circumference.value * percentage.value) / 100} ${circumference.value}`);
</script>

<style scoped>
svg {
  display: block;
  margin: auto;
}

input {
  margin-top: 10px;
  text-align: center;
  display: block;
}
</style>
