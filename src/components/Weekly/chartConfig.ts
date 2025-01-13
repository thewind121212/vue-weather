import { ChartData, ChartOptions } from 'chart.js';


export const data: ChartData<'line'> = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'Temperature_max',
            backgroundColor: '#f87979',
            borderColor: '#f87979',
            pointBackgroundColor: 'white',
            data: [40, 39, 10, 40, 39, 80, 40, 30, 20],
            tension: 0.4
        }
    ]
}




export const defaultOptions: ChartOptions<'line'> = {
}
