
import { ChartData, ChartOptions } from "chart.js"
import { WeatherDailyData } from "../types/weatherTypes"
import { daysRender } from "../types/appTypes"
import { chartOption } from "./config"
import { HourlyAirData } from "../types/airTypes"


const MAXUVDAY = 4

export const uvChartBuilder = (weatherDaily: WeatherDailyData, scope: number, weatherHourly: HourlyAirData): {
    data: ChartData<'line'>,
    options: ChartOptions<'line'>,
} => {
    const uv = []
    const labels = []
    let maxAxisY = -Infinity
    let minAxisY = Infinity

    if (scope === 0) {
        for (const [index, day] of weatherDaily.time.entries()) {
            const date = new Date(day)
            labels.push(daysRender[date.getDay()])
            uv.push(weatherDaily.wind_speed_10m_max[index])
            maxAxisY = Math.max(maxAxisY, uv[index], uv[index])
            minAxisY = Math.min(minAxisY, uv[index], uv[index])
        }
    }

    if (scope > 0 && scope < MAXUVDAY + 1) {
        for (let i = 0; i < 24; i++) {
            let index = i
            if (scope > 1) {
                index = ((scope - 1) * 24) + i
            }
            const date = new Date(weatherHourly.time[index])
            labels.push(`${date.getHours()}:00`)
            uv.push(weatherHourly.uv_index[index])
            maxAxisY = Math.max(maxAxisY, weatherHourly.uv_index[index])
            minAxisY = Math.min(minAxisY, weatherHourly.uv_index[index])

        }

    }


    const options = chartOption(0, Math.max(maxAxisY + 1, 15))

    const data = {
        labels: labels,
        datasets: [
            ... (scope === 0 ? [
                {
                    label: 'Uv Max',
                    backgroundColor: '#f87171CC',
                    borderColor: '#f87171CC',
                    pointBackgroundColor: '#fef2f2',
                    data: uv,
                    tension: 0.3
                }] : [
                {
                    label: 'Uv Index',
                    backgroundColor: '#f87171CC',
                    borderColor: '#f87171CC',
                    pointBackgroundColor: '#fef2f2',
                    data: uv,
                    tension: 0.3
                }
            ])
        ]
    }


    return {
        data,
        options,
    }

}