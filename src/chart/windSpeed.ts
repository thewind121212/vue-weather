import { ChartData, ChartOptions } from "chart.js"
import { WeatherDailyData, WeatherHourlyData } from "../types/weatherTypes"
import { daysRender } from "../types/appTypes"
import { chartOption } from "./config"


const OFF_SET_HEIGHT = 2
const OFF_SET_LOW = 2


export const windSpeedChartBuilder = (weatherDaily: WeatherDailyData, scope: number, weatherHourly: WeatherHourlyData): {
    data: ChartData<'line'>,
    options: ChartOptions<'line'>,
} => {
    const windSpeed = []
    const windGusts = []
    const labels = []
    let maxAxisY = -Infinity
    let minAxisY = Infinity

    if (scope === 0) {
        for (const [index, day] of weatherDaily.time.entries()) {
            const date = new Date(day)
            labels.push(daysRender[date.getDay()])
            windGusts.push(weatherDaily.wind_gusts_10m_max[index])
            windSpeed.push(weatherDaily.wind_speed_10m_max[index])
            maxAxisY = Math.max(maxAxisY, windGusts[index], windSpeed[index])
            minAxisY = Math.min(minAxisY, windGusts[index], windSpeed[index])
        }
    }


    if (scope > 0 && scope < weatherDaily.time.length + 1) {
        for (let i = 0; i < 24; i++) {

            let index = i
            if (scope > 1) {
                index = ((scope - 1) * 24) + i
            }
            const date = new Date(weatherHourly.time[index])
            labels.push(`${date.getHours()}:00`)
            windGusts.push(weatherHourly.wind_gusts_10m[index])
            windSpeed.push(weatherHourly.wind_speed_10m[index])
            maxAxisY = Math.max(maxAxisY, weatherHourly.wind_gusts_10m[index], weatherHourly.wind_speed_10m[index])
            minAxisY = Math.min(minAxisY, weatherHourly.wind_gusts_10m[index], weatherHourly.wind_speed_10m[index])
        }

    }

    const options = chartOption(Math.trunc(minAxisY - OFF_SET_LOW), Math.trunc(maxAxisY + OFF_SET_HEIGHT))

    const data = {
        labels: labels,
        datasets: [
            ...(scope === 0 ? [
                {
                    label: 'Wind Speed Max',
                    backgroundColor: '#f87171CC',
                    borderColor: '#f87171CC',
                    pointBackgroundColor: '#fef2f2',
                    data: windSpeed,
                    tension: 0.3
                },
                {
                    label: 'Wind Gusts Max',
                    backgroundColor: '#f472b6CC',
                    borderColor: '#f472b6CC',
                    pointBackgroundColor: '#fce7f3',
                    data: windGusts,
                    tension: 0.3
                }] : [
                {
                    label: 'Wind Speed',
                    backgroundColor: '#f87171CC',
                    borderColor: '#f87171CC',
                    pointBackgroundColor: '#fef2f2',
                    data: windSpeed,
                    tension: 0.3
                },
                {
                    label: 'Wind Gusts',
                    backgroundColor: '#f472b6CC',
                    borderColor: '#f472b6CC',
                    pointBackgroundColor: '#fce7f3',
                    data: windGusts,
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