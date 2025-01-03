import { defineStore } from 'pinia'



interface TempUnitState {
    tempUnit: "C" | "F"
}

export const useTempUnitStore = defineStore('tempUnit', {
    state: (): TempUnitState => ({
        tempUnit: 'C',
    }),
    actions: {
        setTempUnit(unit: "C" | "F") {
            this.tempUnit = unit
        }
    },
})
