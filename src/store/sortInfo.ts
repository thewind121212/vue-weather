
import { defineStore } from 'pinia'



interface SortInfoStore {
    humiditySort: number[]
    cloudCoverSort: number[]
    pm25Sort: number[]
    uvIndexSort: number[]

}

export const useSortedInfo = defineStore('wheaterInfoSorted', {
    state: (): SortInfoStore => ({
        humiditySort: [],
        cloudCoverSort: [],
        pm25Sort: [],
        uvIndexSort: [],
    }),
    actions: {
        setSortInfo(sortedHumidity: number[], sortedCloudCover: number[], sortedPm25: number[], sortedUvIndex: number[]) {
            this.humiditySort = sortedHumidity
            this.cloudCoverSort = sortedCloudCover
            this.pm25Sort = sortedPm25
            this.uvIndexSort = sortedUvIndex
        }
    },
})
