import { Habit } from '@/shared/libs/types'
import { map } from 'nanostores'

export interface IHabitsStore {
  habits: Habit[];
  habit?: Habit;
  currentDay: Date;
}

export const $habit = map<IHabitsStore>({
  habits: [],
  habit: undefined,
  currentDay: new Date(),
})

export const addHabit = (habit: Habit) => {
  $habit.setKey('habits', [habit, ...$habit.get().habits])
}

export const removeHabit = (id: number) => {
  $habit.setKey('habits', $habit.get().habits.filter(h => h.id !== id))
}
export const updateHabit = (id: number, habit: Habit) => {
  $habit.setKey('habits', $habit.get().habits.map(h => h.id === id ? habit : h))
}

export const setDate = (date: Date) => {
  localStorage.setItem('date', date.toISOString())
  $habit.setKey('currentDay', date)
}

export const setHabit = (habit: Habit | undefined) => {
  $habit.setKey('habit', habit)
}

export const loadHabitsFromLocalStorage = () => {
  const habits: Habit[] = []
  Object.keys(localStorage).filter(key => key.startsWith('habit_')).forEach(key => {
    const value = localStorage.getItem(key)

    let habit: Habit
    try {
      habit = JSON.parse(value as string) as Habit
    } catch (e) {
      return
    }
    habit.addDate = new Date(habit.addDate)
    habit.actions = (habit.actions.map((action) => ({ ...action, date: new Date(action.date) })))


    habits.push(habit)
  })
  habits.sort((a, b) => {
    return b.addDate.getTime() - a.addDate.getTime()
  })

  $habit.setKey('habits', habits)
}
