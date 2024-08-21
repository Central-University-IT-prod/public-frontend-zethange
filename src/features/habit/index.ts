export * from './complete-habit'
export * from './create-habit'

export const isSameWeek = (d1: Date, d2: Date) => {
  return getMonday(d2).getTime() <= d1.getTime() && d1.getTime() <= getSunday(d2).getTime()
}

export const isSameMonth = (d1: Date, d2: Date) => {
  const firstDayInMonth = new Date(d2.getFullYear(), d2.getMonth(), 1)
  const lastDayInMonth = new Date(d2.getFullYear(), d2.getMonth(), getLastDayOfMonth(d2.getFullYear(), d2.getMonth()))

  return firstDayInMonth.getTime() <= d1.getTime() && d1.getTime() <= lastDayInMonth.getTime()
}

function getLastDayOfMonth(year: number, month: number) {
  const date = new Date(year, month + 1, 0);
  return date.getDate();
}


export function getMonday(date: Date): Date {
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(date.setDate(diff))
  monday.setHours(0, 0, 0, 0)

  return monday
}

export function getSunday(date: Date): Date {
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? 0 : 7)
  const sunday = new Date(date.setDate(diff))
  sunday.setHours(23, 59, 59, 999)

  return sunday
}