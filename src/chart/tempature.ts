import { ChartData, ChartOptions } from "chart.js"
import { daysRender } from "../types/appTypes"
import { unitConvert } from "../utils/unitConvert"
import { WeatherDailyData, WeatherHourlyData } from "../types/weatherTypes"
import { chartOption } from "./config"





export const tempatureChartBuilder = (weatherDaily: WeatherDailyData, tempUnit: "C" | "F", scope: number, weatherHourly: WeatherHourlyData): {
    data: ChartData<'line'>,
    options: ChartOptions<'line'>,
} => {
    let labels = []
    let maxTemp = []
    let minTemp = []
    let maxApparent = []
    let minApparent = []
    let temHr = []
    let tempApparentHr = []
    let maxAxisY = -Infinity
    let minAxisY = Infinity


    if (scope === 0) {
        for (const [index, day] of weatherDaily.time.entries()) {
            const date = new Date(day)
            labels.push(daysRender[date.getDay()])
            const maxTempToUnit = unitConvert(weatherDaily.temperature_2m_max[index], tempUnit)
            const minTempToUnit = unitConvert(weatherDaily.temperature_2m_min[index], tempUnit)
            const minApparentToUnit = unitConvert(weatherDaily.apparent_temperature_min[index], tempUnit)
            const maxApparentToUnit = unitConvert(weatherDaily.apparent_temperature_max[index], tempUnit)
            maxTemp.push(maxTempToUnit)
            minTemp.push(minTempToUnit)
            minApparent.push(minApparentToUnit)
            maxApparent.push(maxApparentToUnit)
            maxAxisY = Math.max(maxAxisY, maxTempToUnit, maxApparentToUnit, minTempToUnit, minApparentToUnit)
            minAxisY = Math.min(minAxisY, minTempToUnit, minApparentToUnit, maxTempToUnit, maxApparentToUnit)
        }
    }

    if (scope > 0 && scope < weatherDaily.time.length + 1) {
        for (let i = 0; i < 24; i++) {

            let index = i
            if (scope > 1) {
                index = ((scope - 1) * 24) + i
            }
            console.log(weatherHourly.time[index])
            const date = new Date(weatherHourly.time[index])
            labels.push(`${date.getHours()}:00`)
            const tempHrUnit = unitConvert(weatherHourly.temperature_2m[index], tempUnit)
            const tempApparentHrUnit = unitConvert(weatherHourly.apparent_temperature[index], tempUnit)
            temHr.push(tempHrUnit)
            tempApparentHr.push(tempApparentHrUnit)
            maxAxisY = Math.max(maxAxisY, tempHrUnit, tempApparentHrUnit)
            minAxisY = Math.min(minAxisY, tempHrUnit, tempApparentHrUnit)
        }

    }



    const options = chartOption(Math.trunc(minAxisY - 1), Math.trunc(maxAxisY + 1))

    const data = {
        labels: labels,
        datasets: [
            ...(scope === 0 ? [
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
            ] : [
                {
                    label: 'Apparent Tempature',
                    backgroundColor: '#f87171CC',
                    borderColor: '#f87171CC',
                    pointBackgroundColor: '#fef2f2',
                    data: tempApparentHr,
                    tension: 0.3
                },
                {
                    label: 'Tempature',
                    backgroundColor: '#34d399CC',
                    borderColor: '#34d399CC',
                    pointBackgroundColor: '#a7f3d0',
                    data: temHr,
                    tension: 0.3
                },
            ])
        ]
    }


    return {
        data,
        options,
    }

}




