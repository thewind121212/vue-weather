export const returnModalType = (modalMounted: string, dataAir: number[], dataRainChance: number[], dataCloud: number[], dataHumidity: number[]) => {

    switch (modalMounted) {
        case 'uv':
            return {
                dataHr: dataAir.slice(0, 24),
                unit: '',
                headerName: 'UV Index Today',
            }
        case 'rain':
            return {
                dataHr: dataRainChance.slice(0, 24),
                unit: '%',
                headerName: 'Rain Chance Today',
            }
        case 'cloud':
            return {
                dataHr: dataCloud.slice(0, 24),
                unit: '%',
                headerName: 'Cloud Cover Today',
            }
        case 'humidity':
            return {
                dataHr: dataHumidity.slice(0, 24),
                unit: '%',
                headerName: 'Humidity Today',
            }
        default:
            return {
                dataHr: dataAir.slice(0, 24),
                unit: '',
                headerName: 'UV Index Today',
            }
    }

}