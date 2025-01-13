<script setup lang="ts">
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions
} from 'chart.js'

import { Line } from 'vue-chartjs'
import { WeatherDailyData, WeatherHourlyData } from '../../types/weatherTypes.js'
import { HourlyAirData } from '../../types/airTypes.js'
import { onMounted, reactive, ref, watch } from 'vue'
import { useTempUnitStore } from '../../store/tempUnit.js'





ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

export type filterType = 'temp' | 'wind_speed' | 'uv'


const filters: {
    id: filterType,
    name: string
}[] = [
        {
            id: 'temp',
            name: 'Tempature'
        },
        {
            id: 'uv',
            name: 'UV'
        },
        {
            id: 'wind_speed',
            name: 'Wind Speed'
        },
    ]

const unit = useTempUnitStore()
const timeOutRef = ref<NodeJS.Timeout | null>(null)
const chartFilter = reactive<{
    data: ChartData<'line'>,
    options: ChartOptions<'line'>,
    scope: '7 Days' | string
    filters: filterType
}>({
    data: {
        labels: [],
        datasets: [],
    },
    options: {},
    scope: '7 Days',
    filters: 'temp'
})

const dateRender = ref<string[]>([])


const props = defineProps({
    weatherDaily: Object as () => WeatherDailyData,
    weatherHourly: Object as () => WeatherHourlyData,
    airQualityHourly: Object as () => HourlyAirData,
    timeZone: String,
    hr: String,
    day: String
})

const isLoading = ref<boolean>(true)



const daysRender = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const unitConvert = (value: number, unit: 'C' | 'F') => {
    if (unit === 'C') {
        return value
    } else {
        return Number(((value * 9 / 5) + 32).toFixed(1))
    }
}

watch(() => [props.day, props.weatherDaily, unit.tempUnit, chartFilter.filters, chartFilter.scope], () => {
    if (props.day && props.weatherDaily) {
        dateRender.value = []
        let labels = []
        let maxTemp = []
        let minTemp = []
        let maxApparent = []
        let minApparent = []
        let maxAxisY = -Infinity
        let minAxisY = Infinity
        for (const [index, day] of props.weatherDaily.time.entries()) {
            const date = new Date(day)
            const dateFormat = date.toLocaleDateString('en-US', {
                weekday: 'short',
                day: '2-digit',
                month: 'short'
            }).replace(',', '');
            dateRender.value.push(dateFormat)
            labels.push(daysRender[date.getDay()])
            const maxTempToUnit = unitConvert(props.weatherDaily.temperature_2m_max[index], unit.tempUnit)
            const minTempToUnit = unitConvert(props.weatherDaily.temperature_2m_min[index], unit.tempUnit)
            const minApparentToUnit = unitConvert(props.weatherDaily.apparent_temperature_min[index], unit.tempUnit)
            const maxApparentToUnit = unitConvert(props.weatherDaily.apparent_temperature_max[index], unit.tempUnit)
            maxTemp.push(maxTempToUnit)
            minTemp.push(minTempToUnit)
            minApparent.push(minApparentToUnit)
            maxApparent.push(maxApparentToUnit)
            maxAxisY = Math.max(maxAxisY, maxTempToUnit, maxApparentToUnit, minTempToUnit, minApparentToUnit)
            minAxisY = Math.min(minAxisY, minTempToUnit, minApparentToUnit, maxTempToUnit, maxApparentToUnit)
        }


        const options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        padding: 10,
                        color: '#ffffff',
                        font: {
                            size: 12,
                        }
                    }
                },
                y: {
                    ticks: {
                        color: '#ffffff',
                        font: {
                            size: 12,
                        },
                        padding: 10,
                    },
                    min: Math.trunc(minAxisY - 1),
                    max: Math.trunc(maxAxisY + 1),
                }
            }
        }

        dateRender.value.unshift('7 Days')


        chartFilter.data = {
            labels: labels,
            datasets: [
                {
                    label: 'Tempature Max',
                    backgroundColor: '#f87171CC',
                    borderColor: '#f87171CC',
                    pointBackgroundColor: '#fef2f2',
                    data: maxTemp,
                    tension: 0.3
                },
                {
                    label: 'Tempature Min',
                    backgroundColor: '#60a5faCC',
                    borderColor: '#60a5faCC',
                    pointBackgroundColor: '#dbeafe',
                    data: minTemp,
                    tension: 0.3
                },
                {
                    label: 'Apparent Min',
                    backgroundColor: '#38bdf8CC',
                    borderColor: '#38bdf8CC',
                    pointBackgroundColor: '#e0f2fe',
                    data: minApparent,
                    tension: 0.3
                },
                {
                    label: 'Apparent Max',
                    backgroundColor: '#f472b6CC',
                    borderColor: '#f472b6CC',
                    pointBackgroundColor: '#fce7f3',
                    data: maxApparent,
                    tension: 0.3
                }
            ]
        }

        chartFilter.options = options

    }

})



onMounted(() => {
    const resize = () => {
        if (timeOutRef.value) {
            clearTimeout(timeOutRef.value)
        }
        isLoading.value = true
        timeOutRef.value = setTimeout(() => {
            isLoading.value = false
        }, 100)

    }


    window.addEventListener('resize', resize)

    resize()

    window.addEventListener('load', resize)

})


</script>


<template>
    <div class="flex-auto rounded-2xl p-6 w-auto h-full flex flex-col relative overflow-hidden">
        <div class="bg-secondary absolute top-0 left-0 w-full h-full opacity-70"></div>
        <div class="w-full flex gap-4 justify-start items-center relative z-10 mb-4">
            <div class="flex gap-2 justify-start items-center">
                <span class="w-4 h-4 min-w-4 min-h-4 rounded-full bg-red-400 -translate-y-[0.0313rem]"></span>
                <p class="text-[1rem] font-bold text-white">Weekly Forcast</p>
            </div>
            <div class="flex gap-2 text-white text-[0.875rem] h-auto justify-center items-center">

                <div v-for="(item, index) in filters" :key="index + item.id"
                    class="w-full h-auto rounded-md flex justify-center items-center text-nowrap px-2 py-1 text-gray-300 cursor-pointer duration-200"
                    v-on:click="chartFilter.filters = item.id"
                    :class="{ 'bg-pink-500 !text-white !px-6 !duration-300': chartFilter.filters === item.id }">
                    {{ item.name }}</div>
            </div>
        </div>
        <div class="flex-auto z-20 !h-[21.125rem] w-full flex gap-2">
            <div class="text-white text-[0.875rem] w-auto flex flex-col gap-2">

                <div v-for="(item, index) in dateRender" :key="item + index"
                    class="w-full h-auto border border-[#7068ff6e]  rounded-xl flex justify-center text-[#cdcdcd] items-center px-2 py-1 text-nowrap cursor-pointer duration-300"
                    v-on:click="chartFilter.scope = item"
                    :class="{ '!bg-[#7068FF] !text-white': chartFilter.scope === item }">
                    {{ item }}
                </div>
            </div>
            <div class="flex justify-center items-center flex-auto  h-full" id="chart-container">
                <div v-if="isLoading"
                    class="w-full h-full bg-transparent flex gap-2 px-4 cursor-default select-none justify-center items-center absolute top-0 left-0">
                    <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-white"
                        viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor" />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill" />
                    </svg>

                </div>
                <Line :data="chartFilter.data" :options="chartFilter.options" id="chart" v-else />
            </div>
        </div>
    </div>


</template>