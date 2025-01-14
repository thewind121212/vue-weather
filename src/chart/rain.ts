
import { ChartData, ChartOptions } from "chart.js"
import { daysRender } from "../types/appTypes"
import { WeatherDailyData, WeatherHourlyData } from "../types/weatherTypes"
import { chartOption } from "./config"




export const rainChartBuilder = (weatherDaily: WeatherDailyData, tempUnit: "C" | "F", scope: number, weatherHourly: WeatherHourlyData): {
    data: ChartData<'line'>,
    options: ChartOptions<'line'>,
} => {
    let labels = []
    let rain = []
    let snow = []
    let maxAxisY = -Infinity
    let minAxisY = Infinity


    if (scope === 0) {
        for (const [index, day] of weatherDaily.time.entries()) {
            const date = new Date(day)
            labels.push(daysRender[date.getDay()])
            const rainPerDay = weatherDaily.showers_sum[index]
            const snowPerDay = weatherDaily.snowfall_sum[index]
            rain.push(rainPerDay)
            snow.push(snowPerDay)
            maxAxisY = Math.max(maxAxisY, rainPerDay, snowPerDay)
            minAxisY = Math.min(minAxisY, rainPerDay, snowPerDay)
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
            const rainPerDay = weatherHourly.showers[index]
            const snowfall = weatherHourly.snowfall[index]
            rain.push(rainPerDay)
            snow.push(snowfall)
            maxAxisY = Math.max(maxAxisY, rainPerDay, snowfall)
            minAxisY = Math.min(minAxisY, rainPerDay, snowfall)
        }

    }



    const options = chartOption(-1, Math.trunc(maxAxisY + 1))

    const data = {
        labels: labels,
        datasets: [
            ...(scope === 0 ? [
                {
                    label: 'Snow Sum',
                    backgroundColor: '#06b6d4CC',
                    borderColor: '#06b6d4CC',
                    pointBackgroundColor: '#a5f3fc',
                    data: snow,
                    tension: 0.2
                },
                {
                    label: 'Rain Sum',
                    backgroundColor: '#60a5faCC',
                    borderColor: '#60a5faCC',
                    pointBackgroundColor: '#dbeafe',
                    data: rain,
                    tension: 0.2
                },
            ] : [
                {
                    label: 'Snow',
                    backgroundColor: '#06b6d4CC',
                    borderColor: '#06b6d4CC',
                    pointBackgroundColor: '#a5f3fc',
                    data: snow,
                    tension: 0.2
                },
                {
                    label: 'Rain',
                    backgroundColor: '#60a5faCC',
                    borderColor: '#60a5faCC',
                    pointBackgroundColor: '#dbeafe',
                    data: rain,
                    tension: 0.2
                },
            ])
        ]
    }


    return {
        data,
        options,
    }

}