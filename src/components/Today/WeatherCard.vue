<template>
    <div class="bg-[#0D1321] rounded-xl flex justify-end items-center flex-col relative bg-cover bg-center overflow-hidden"
        :class="isHaveRain ? `bg-[url('/image-rain.webp')]` : `bg-[url('/image-day.webp')]`">
        <div class="bg-transparent w-full h-full absolute left-0 top-0 z-10 rounded-xl opacity-1 backdrop-blur-[2px] cursor-pointer opacity-0 pointer-events-none"
            :class="{ '!pointer-events-auto': modalMounted === 'weatherCard' }"
            @click="$emit('openModal', 'weatherCard')" id="weatherCard-placeholder">
        </div>
        <div class="w-full h-full bg-[#0d132180] grid grid-cols-2 gap-2 px-4 backdrop-blur-[1px] cursor-default select-none">
            <div class="flex justify-center items-start flex-col">
                <FlipCard>
                    <template #front>
                        Temperature:
                        {{ `${convertFromCelciusToFahrenheit(weatherDaily?.temperature_2m_min[0]!, tempUnit)}
                        to
                        ${convertFromCelciusToFahrenheit(weatherDaily?.temperature_2m_max[0]!, tempUnit)}` }}
                    </template>
                    <template #back>
                        Feel Like:
                        {{ `${convertFromCelciusToFahrenheit(weatherDaily?.apparent_temperature_min[0]!, tempUnit)} to
                        ${convertFromCelciusToFahrenheit(weatherDaily?.apparent_temperature_max[0]!, tempUnit)}` }}
                    </template>
                </FlipCard>

                <FlipCard>
                    <template #front>
                        Humidity:
                        {{ `${humidityRange.min}% - ${humidityRange.max}%` }}
                    </template>
                    <template #back>
                        RainChance:
                        {{ weatherDaily?.precipitation_probability_max[0] }}%
                    </template>
                </FlipCard>

                <FlipCard>
                    <template #front>
                        UV index:
                        {{ uvIndex }}
                    </template>
                    <template #back>
                        Cloud Cover:
                        {{ `${cloudCoverRange.min}% - ${cloudCoverRange.max}%` }}
                    </template>
                </FlipCard>

                <p class="font-light text-gray-300 text-[0.875rem] underline cursor-pointer pointer-events-none"
                    :class="{ '!pointer-events-auto': !modalMounted }"
                    @click="$emit('openModal', 'weatherCard')">See More</p>
            </div>
            <div class="relative flex justify-center items-center">
                <img class="w-[8.5rem] h-[8.5rem] absolute"
                    :src="weatherIcon.src"
                    :alt="weatherIcon.alt" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { WeatherDailyData, WeatherHourlyData, WeatherCodeType } from '../../types/weatherTypes'
import { convertFromCelciusToFahrenheit } from '../../utils/utils'
import { ModalName } from '../../types/appTypes'
import FlipCard from './FlipCard.vue'

interface Props {
    weatherDaily?: WeatherDailyData
    weatherHourly?: WeatherHourlyData
    weatherCode: Record<string, WeatherCodeType>
    tempUnit: 'C' | 'F'
    humidityRange: { min: number; max: number }
    cloudCoverRange: { min: number; max: number }
    uvIndex: number
    isHaveRain: boolean
    isDay: boolean
    modalMounted: string | null
    timeZone?: string
    hr?: string
}

const props = defineProps<Props>()

defineEmits<{
    openModal: [modalName: ModalName]
}>()

const weatherCodeFetch = computed(() => {
    return props.weatherDaily?.weather_code[0]?.toString() || "0"
})

const weatherIcon = computed(() => {
    const iconPath = props.weatherCode?.[weatherCodeFetch.value]?.[props.isDay ? 'image_day' : 'image_night']
    return {
        src: iconPath,
        alt: iconPath
    }
})
</script>
