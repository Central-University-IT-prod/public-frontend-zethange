import { Period } from './types'

const periods: {
  [key in Period]: string
} = {
  'weekly': 'раз в неделю',
  'daily': 'раз в день',
  'monthly': 'раз в месяц'
}

export const convertPeriodToString = (period: Period): string => {
  return periods[period] as string
}

export const compareDates = (d1: Date, d2: Date) => {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
}

export const generateNeonRgbColor = (num: number): string => {
    const rgbValue = Math.floor((num / 31) * 255)

    switch (num % 6) {
      case 0:
        return `rgb(${rgbValue}, 0, ${255 - rgbValue})`
      case 1:
        return `rgb(${255 - rgbValue}, 0, ${rgbValue})`
      case 2:
        return `rgb(${rgbValue}, ${255 - rgbValue}, 0)`
      case 3:
        return `rgb(0, ${rgbValue}, ${255 - rgbValue})`
      case 4:
        return `rgb(0, ${255 - rgbValue}, ${rgbValue})`
      case 5:
        return `rgb(${rgbValue}, ${rgbValue}, ${rgbValue})`
      default:
        return `rgb(0, 0, 0)`
    }
  }