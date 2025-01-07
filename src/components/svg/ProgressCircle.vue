<template>
  <div>
    <svg
      :width="diameter"
      :height="radius + strokeWidth"
      :viewBox="`0 0 ${diameter} ${radius + strokeWidth}`"
    >
      <!-- Background Path -->
      <path
        :d="halfCirclePath"
        fill="none"
        stroke="#ddd"
        :stroke-width="strokeWidth"
      />
      <!-- Progress Path -->
      <path
        :d="halfCirclePath"
        fill="none"
        stroke="#4caf50"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="progressOffset"
        stroke-linecap="round"
      />
    </svg>
    <input
      type="number"
      v-model.number="percentage"
      max="100"
      min="0"
      @input="validatePercentage"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

// Reactive properties
const percentage = ref<number>(50);
const radius = ref<number>(50);
const strokeWidth = ref<number>(10);

// Computed properties
const diameter = computed(() => radius.value * 2);
const circumference = computed(() => Math.PI * radius.value);
const progressOffset = computed(
  () => circumference.value * (1 - percentage.value / 100)
);
const halfCirclePath = computed(() => {
  const r = radius.value;
  const s = strokeWidth.value / 2;
  return `M ${s},${r + s} a ${r},${r} 0 1,1 ${r * 2},0`;
});

// Input validation method
const validatePercentage = () => {
  percentage.value = Math.max(0, Math.min(100, percentage.value));
};
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
