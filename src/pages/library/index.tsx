import { Component, createMemo, For } from 'solid-js'
import { Habit } from '@/shared/libs/types'
import { convertPeriodToString } from '@/shared/libs'
import { addHabit, getNewIdForHabit } from '@/entities/habit'
import { useNavigate } from '@solidjs/router'

const habitList: Habit[] = [{
  id: 0,
  title: 'Спать 8 часов каждый день',
  period: 'daily',
  category: 'Здоровье',
  addDate: new Date(),
  actions: []
}, {
  id: 0,
  title: 'Пить 2000 мл воды в день',
  period: 'daily',
  category: 'Питание',
  addDate: new Date(),
  targetValue: 2000,
  actions: []
}, {
  id: 0,
  title: 'Есть 1000 помидоров в день',
  period: 'weekly',
  category: 'Питание',
  addDate: new Date(),
  targetValue: 1000,
  actions: []
}, {
  id: 0,
  title: 'Проходить 10.000 шагов в день',
  period: 'daily',
  category: 'Спорт',
  addDate: new Date(),
  targetValue: 10000,
  actions: []
}, {
  id: 0,
  title: 'Есть 3 таблетки компливит',
  period: 'weekly',
  category: 'Здоровье',
  addDate: new Date(),
  targetValue: 3,
  actions: []
}]

export const Library: Component = () => {
  const navigate = useNavigate()

  const categories = createMemo(() => {
    const h: { [key: string]: Habit[] } = {}
    habitList.forEach(a => {
      if (!h[a.category]) {
        h[a.category] = []
      }
      h[a.category].push(a)
    })

    return h
  })

  return (
    <section class="container mx-auto mt-2 grid gap-2 max-md:px-2">
      <For each={Object.entries(categories())}>
        {category => (
          <div>
            <span>{category[0]}</span>
            <div class='grid grid-cols-3 max-md:grid-cols-1 gap-2 overflow-x-auto'>
              <For each={category[1]}>{habit => (
                <div class='p-2 w-full bg-white rounded-lg grid'>
                  <span class="font-medium">{habit.title}</span>
                  <div class='text-sm font-light flex justify-between'>
                    <span>{convertPeriodToString(habit.period)}</span>
                    <button onClick={() => {
                      const id = getNewIdForHabit()
                      const newHabit = {
                        ...habit,
                        id,
                      }
                      addHabit(newHabit)
                      localStorage.setItem(`habit_${id}`, JSON.stringify(habit))
                      navigate('/')
                    }}>+</button>
                  </div>
                </div>
              )}</For>
            </div>
          </div>
        )}
      </For>
    </section>
  )
}