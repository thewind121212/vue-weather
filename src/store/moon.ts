
import { defineStore } from 'pinia'
import { MoonReturn } from '../types/moon'



interface MoonState {
    moonState: MoonReturn[] | null
}

export const useMoonStore = defineStore('moon', {
    state: (): MoonState => ({
        moonState: null
    }),
    actions: {
        setMoonState(state: MoonReturn[]) {
            this.moonState = state
        }
    },
})
