<script setup lang="ts">
import { computed } from 'vue'
import { useLocationStore } from './store/location'
import Layout from './layout/Layout.vue'
import OnboardingOverlay from './components/OnboardingOverlay.vue'

const locationStore = useLocationStore()
const hasLocation = computed(() => !!locationStore.location)
</script>

<template>
  <OnboardingOverlay v-if="!hasLocation" />
  <Layout v-else />
</template>
