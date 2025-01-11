

import { defineStore } from 'pinia'
import { ModalName } from '../components/Today/TodayHightLight.vue'



interface ModalState {
    modalMounted: ModalName
}

export const useModalStore = defineStore('modalMounted', {
    state: (): ModalState => ({
        modalMounted: null
    }),
    actions: {
        setModalMounted(modal: ModalName) {
            this.modalMounted = modal
        }
    },
})
