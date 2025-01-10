
import { defineStore } from 'pinia'



interface TempAirInfo {
    curentAQI: number
    currentPm2_5: number
    currentPm10: number
}

export const useAirQualityInfo = defineStore('airQuality', {
    state: (): TempAirInfo => ({
        curentAQI: 0,
        currentPm2_5: 0,
        currentPm10: 0
    }),
    actions: {
        setAirQuality(curentAQI: number, currentPm2_5: number, currentPm10: number) {
            this.curentAQI = curentAQI
            this.currentPm2_5 = currentPm2_5
            this.currentPm10 = currentPm10
        }
    },
})
