import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';


import './style.css'
import 'primeicons/primeicons.css'
import App from './Layout.vue'

const pinia = createPinia()

const app = createApp(App)


app.use(VueQueryPlugin)
app.use(pinia)
app.use(PrimeVue)

app.mount('#app')

