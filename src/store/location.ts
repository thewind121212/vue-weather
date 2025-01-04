
import { defineStore } from 'pinia'
import { Location } from '../types/geoTypes'



interface LocationStore {
    location: Location | null,
}

export const useLocationStore = defineStore('locationStore', {
    state: (): LocationStore => ({
        location: JSON.parse(localStorage.getItem('location')!) || null,
    }),
    actions: {
        setLocationState(location: Location) {
            this.location = location
        }
    },
})
