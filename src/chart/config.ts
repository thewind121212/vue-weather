import { ChartOptions } from "chart.js"

export const chartOption = (min: number, max: number): ChartOptions<'line'> => {
    return {
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
                min,
                max,
            }
        }

    }
}