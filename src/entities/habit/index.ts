export * from './store'
export * from './ui/habit'

export const getNewIdForHabit = (): number => {
  const ids = Object.keys(localStorage).filter(key => key.startsWith('habit_')).map(key => +key.split('_')[1])

  let newId = Math.max(...ids) + 1;
  if (newId === -Infinity) newId = 0;

  return newId
}