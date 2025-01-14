
export const unitConvert = (value: number, unit: 'C' | 'F') => {
    if (unit === 'C') {
        return value
    } else {
        return Number(((value * 9 / 5) + 32).toFixed(1))
    }
}