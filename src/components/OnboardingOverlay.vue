<script setup lang="ts">
import { ref } from 'vue'
import { debounce } from 'lodash'
import { AxiosCLient } from '../lib/axios'
import { GeoResponse, Location } from '../types/geoTypes'
import { useLocationStore } from '../store/location'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'

const locationStore = useLocationStore()

const searchQuery = ref('')
const searchResults = ref<Location[]>([])
const isSearching = ref(false)
const geoLoading = ref(false)
const geoError = ref('')

const HCM_DEFAULT: Location = {
  id: 1566083,
  name: 'Ho Chi Minh City',
  latitude: 10.8231,
  longitude: 106.6297,
  elevation: 19,
  feature_code: 'PPLC',
  country_code: 'VN',
  admin1_id: 0,
  timezone: 'Asia/Ho_Chi_Minh',
  population: 0,
  country_id: 0,
  country: 'Vietnam',
}

function selectLocation(location: Location) {
  localStorage.setItem('location', JSON.stringify(location))
  locationStore.setLocationState(location)
}

function useDefaultLocation() {
  selectLocation(HCM_DEFAULT)
}

async function useMyLocation() {
  if (!navigator.geolocation) {
    geoError.value = 'Geolocation not supported by your browser.'
    return
  }

  geoLoading.value = true
  geoError.value = ''

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const location: Location = {
        id: 0,
        name: 'Current Location',
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        elevation: 0,
        feature_code: '',
        country_code: '',
        admin1_id: 0,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        population: 0,
        country_id: 0,
        country: '',
      }
      geoLoading.value = false
      selectLocation(location)
    },
    () => {
      geoLoading.value = false
      geoError.value = 'Location access denied. Search or use default.'
    },
    { enableHighAccuracy: false, timeout: 10000 }
  )
}

async function fetchSearch() {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }
  isSearching.value = true
  try {
    const res: { data: { data: GeoResponse } } = await AxiosCLient.post('/geo_search', {
      geoQuery: searchQuery.value.trim(),
    })
    searchResults.value = res.data.data.results ?? []
  } catch {
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

const debouncedSearch = debounce(fetchSearch, 500)

function onSearchInput() {
  isSearching.value = true
  debouncedSearch()
}
</script>

<template>
  <div class="w-svw h-svh bg-primary font-sfPro font-[500] bg-[url('/bg.webp')] bg-cover bg-center overflow-y-auto">
    <div class="w-full min-h-full backdrop-blur-lg flex justify-center items-center py-8 px-4">
      <div class="flex flex-col items-center gap-4 md:gap-6 w-full max-w-[28rem]">
        <!-- Logo + Title -->
        <div class="flex flex-col items-center gap-2">
          <img src="/logo.webp" alt="logo" class="w-24 h-24" />
          <h1 class="text-white text-3xl font-bold">Vue Weather</h1>
          <p class="text-[#9fa1a3] text-center">
            Choose your location to get started with weather data
          </p>
        </div>

        <!-- Use My Location -->
        <button
          class="w-full h-[3.25rem] rounded-xl bg-[#7068FF] text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          :disabled="geoLoading"
          @click="useMyLocation"
        >
          <i v-if="geoLoading" class="pi pi-spin pi-spinner" />
          <i v-else class="pi pi-map-marker" />
          <span>{{ geoLoading ? 'Getting location...' : 'Use My Location' }}</span>
        </button>
        <p v-if="geoError" class="text-red-400 text-sm -mt-4">{{ geoError }}</p>

        <!-- Search -->
        <div class="w-full relative">
          <div class="relative">
            <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-[#9fa1a3]" />
            <input
              type="text"
              v-model="searchQuery"
              @input="onSearchInput"
              placeholder="Search for a city..."
              class="w-full h-[3.25rem] rounded-xl bg-secondary text-[#dae2eb] pl-12 pr-4 outline-none border-transparent"
            />
          </div>
          <!-- Search Results Dropdown -->
          <div
            v-if="searchQuery.trim() && (isSearching || searchResults.length > 0)"
            class="w-full bg-secondary mt-2 rounded-xl flex flex-col max-h-[15rem] overflow-y-auto"
          >
            <div v-if="isSearching" class="flex justify-center items-center py-6">
              <i class="pi pi-spin pi-spinner text-[#dae2eb]" style="font-size: 1.5rem" />
            </div>
            <template v-else>
              <div
                v-for="item in searchResults"
                :key="item.id"
                class="px-6 py-3 flex justify-between items-center border-b border-[#3A3A3A] cursor-pointer hover:bg-[#3A3A3A] transition-colors"
                @click="selectLocation(item)"
              >
                <div class="flex items-center gap-2">
                  <i class="text-[#dae2eb]">{{ getUnicodeFlagIcon(item.country_code) }}</i>
                  <span class="text-[#dae2eb] font-semibold">{{ item.name }}</span>
                </div>
                <span class="text-white font-light text-sm">
                  {{ item.admin1 }}{{ item.admin2 ? ', ' + item.admin2 : '' }}{{ item.admin1 ? ', ' : '' }}{{ item.country }}
                </span>
              </div>
              <div
                v-if="searchResults.length === 0"
                class="flex flex-col items-center justify-center py-6 gap-1"
              >
                <i class="pi pi-map text-[#9fa1a3]" style="font-size: 1.5rem" />
                <p class="text-[#9fa1a3] text-sm">Location Not Found</p>
              </div>
            </template>
          </div>
        </div>

        <!-- Divider -->
        <div class="w-full flex items-center gap-3">
          <div class="flex-1 h-px bg-[#3A3A3A]" />
          <span class="text-[#9fa1a3] text-sm">or</span>
          <div class="flex-1 h-px bg-[#3A3A3A]" />
        </div>

        <!-- Default HCM -->
        <button
          class="w-full h-[3.25rem] rounded-xl bg-secondary text-[#dae2eb] font-semibold flex items-center justify-center gap-2 hover:bg-[#3A3A3A] transition-colors"
          @click="useDefaultLocation"
        >
          <span>&#127483;&#127475;</span>
          <span>Use Ho Chi Minh City</span>
        </button>
      </div>
    </div>
  </div>
</template>
