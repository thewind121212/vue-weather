import axios from 'axios';


export const AxiosCLient = axios.create({
    baseURL: import.meta.env.VITE_WEATHER_API_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
}) 