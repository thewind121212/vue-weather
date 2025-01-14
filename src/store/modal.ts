

import { defineStore } from 'pinia'
import { ModalName } from '../types/appTypes'



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
