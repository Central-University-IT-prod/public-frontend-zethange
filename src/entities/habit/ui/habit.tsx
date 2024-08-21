import { Component, createMemo, createSignal, Match, onMount, Show, Switch } from 'solid-js'
import { compareDates, convertPeriodToString } from '@/shared/libs'
import { Button, Input, Modal } from '@/shared/ui'
import { $habit, updateHabit } from '@/entities/habit'
import { Habit as IHabit, HabitAction } from '@/shared/libs/types'
import { $user, addCoin, setUser } from '@/entities/user'
import { useStore } from '@nanostores/solid'
import { Chart, Colors, Legend, Title, Tooltip } from 'chart.js'
import { Line } from 'solid-chartjs'
import { CompleteHabit, isSameMonth, isSameWeek } from '@/features/habit'

export interface IHabitProps {
  habit: IHabit
}

export const Habit: Component<IHabitProps> = (props) => {
  const habit = createMemo(() => props.habit)
  const habits = useStore($habit)
  const user = useStore($user)
  const [value, setValue] = createSignal<number>(0)

  const getIsCompletedToday = (h: IHabit): boolean => {
    return h.actions.some(action => {
      switch (habit().period) {
        case 'daily':
          return compareDates(action.date, habits().currentDay)
        case 'weekly':
          return isSameWeek(action.date, habits().currentDay)
        case 'monthly':
          return isSameMonth(action.date, habits().currentDay)
      }
    })
  }

  const currentAim = createMemo(() => {
    return habit().actions
      .filter(a => {
        switch (habit().period) {
          case 'daily':
            return compareDates(a.date, habits().currentDay)
          case 'weekly':
            return isSameWeek(a.date, habits().currentDay)
          case 'monthly':
            return isSameMonth(a.date, habits().currentDay)
        }
      })
      .map(a => a.value)
      .reduce((acc, num) => (acc || 0) + (num || 0), 0) || 0
  })

  const isCompletedToday = createMemo(() => {
    if (habit().targetValue) {
      return currentAim() >= (habit().targetValue || 0)
    }
    return getIsCompletedToday(habit())
  })

  function saveAction(habitId: number, value: number = 0, isSimple: boolean = true) {
    const habit = JSON.parse(JSON.stringify(habits().habits.find(h => h.id === habitId))) as IHabit | undefined
    if (!habit) return

    habit.addDate = new Date(habit.addDate)
    habit.actions = habit.actions.map(a => ({ ...a, date: new Date(a.date) }))
    if (isCompletedToday()) return

    const action: HabitAction = {
      id: habit.id,
      date: habits().currentDay
    }
    if (!isSimple) action.value = value

    habit.actions.push(action)

    updateHabit(habitId, habit)

    if (isSimple || isCompletedToday()) {
      addCoin(10)
      setUser({
        totalCompleted: user().totalCompleted + 1,
      })
    }
    localStorage.setItem(`habit_${habit.id}`, JSON.stringify(habit))
  }

  onMount(() => {
    Chart.register(Title, Tooltip, Legend, Colors)
  })


  const las = createMemo<HabitAction[]>(() => {
    // с reduce у solid.js тоже какие-то проблемы
    const acc: HabitAction[] = []

    habit().actions.forEach((action) => {
      action = JSON.parse(JSON.stringify(action))
      action.date = new Date(action.date)

      const foundAction = acc.find(a => a.date.toLocaleDateString() === action.date.toLocaleDateString())
      if (foundAction) {
        const index = acc.indexOf(foundAction)

        if (!foundAction.value) foundAction.value = 0
        foundAction.value += action.value ?? 0
        acc[index] = foundAction
      } else {
        acc.push(action)
      }
    })

    return acc
  })

  const chartData = createMemo(() => ({
    labels: las().map(a => a.date.toLocaleDateString()),
    datasets: [
      {
        label: 'Выполнение',
        data: las().map(a => a.value)
      }
    ]
  }))

  const [isStatOpen, setIsStatOpen] = createSignal(false)
  const [isOpenDelete, setIsOpenDelete] = createSignal(false)

  return (
    <div
      class={'p-3 border dark:border-none dark:bg-gray-800 rounded-md grid' + (habit().isArchived ? ' line-through' : '') + ' '}
    >
      <div class="flex justify-between">
        <h4 class="text-lg text-black dark:text-white">{habit().title}</h4>
        <button onClick={async () => {
          setIsOpenDelete(true)
        }} class="dark:text-white">-
        </button>
      </div>
      <span class="text-sm text-gray-700 dark:text-gray-50">Период: {convertPeriodToString(habit().period)}</span>
      <Show when={!!habit().category}>
        <span class="text-sm text-gray-700 dark:text-gray-50">Категория: {habit().category}</span>
      </Show>
      <span class="text-sm text-gray-700 dark:text-gray-50">Создана: {habit().addDate.toLocaleString()}</span>
      <Show when={!!habit().targetValue}>
        <span class="text-sm text-gray-700 dark:text-white">Цель: {currentAim()}/{habit().targetValue}</span>
      </Show>
      <Switch>
        <Match when={isCompletedToday()}>
          <span class="text-green-500">Ты уже выполнил(а) эту задачу сегодня</span>
        </Match>
        <Match when={!isCompletedToday()}>
          <div class="flex items-center gap-1">
            <Show when={habit().targetValue}>
              <Input type="number" class="h-8" placeholder="Значение" onChange={e => setValue(+e.target.value)} />
            </Show>
            <Button onClick={() => {
              saveAction(habit().id, value(), false)
            }} class="my-1 w-full">Выполнить</Button>
          </div>
        </Match>
      </Switch>
      <div>
        <Button class="bg-gray-500 hover:bg-gray-600 w-full" onClick={() => setIsStatOpen(true)}>Статистика</Button>
        <Modal isOpen={isStatOpen()} onClose={() => setIsStatOpen(false)}>
          <Line data={chartData()} options={{ responsive: true, maintainAspectRatio: true }} />
        </Modal>
      </div>
      <CompleteHabit isOpen={isOpenDelete()} onClose={() => setIsOpenDelete(false)} habit={habit()} />
    </div>
  )
}
