import { Button, Modal } from '@/shared/ui'
import { createMemo, createSignal, For, onMount } from 'solid-js'
import { CreateHabit } from '@/features/habit'
import { DataToUpload, Habit as IHabit } from '@/shared/libs/types'
import { $habit, addHabit, getNewIdForHabit, Habit, loadHabitsFromLocalStorage } from '@/entities/habit'
import { useStore } from '@nanostores/solid'
import { loadUserFromLocalStorage } from '@/entities/user'
import { A } from '@solidjs/router'

export const Home = () => {
  const [isShowCreateHabit, setIsShowCreateHabit] = createSignal<boolean>(false)
  const habits = useStore($habit)

  onMount(() => {
    loadHabitsFromLocalStorage()
    loadUserFromLocalStorage()
  })

  const onCreateHabit = (habit: Omit<IHabit, 'id'>) => {
    setIsShowCreateHabit(false)

    const newHabit: IHabit = {
      ...habit,
      id: getNewIdForHabit(),
      actions: []
    }

    localStorage.setItem(`habit_${newHabit.id}`, JSON.stringify(newHabit))

    addHabit(newHabit)
  }

  const categories = createMemo(() => habits().habits.map(a => a.category).filter(a => !!a))
  let uploadRef: HTMLInputElement | undefined

  const uploadFile = (e: Event) => {
    e.preventDefault()

    const file = uploadRef?.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = (e) => {
      const data = e.target?.result
      if (!data) return

      let habits = JSON.parse(data as string | undefined || 'null') as DataToUpload || null
      if (!habits) return

      habits = {
        habits: habits.habits.map(h => ({
          ...h,
          addDate: new Date(h.addDate)
        })),
        actions: habits.actions.map(a => ({
          ...a,
          date: new Date(a.date),
        }))
      }

      for (const habit of habits.habits) {
        const newHabit: IHabit = {
          ...habit,
          id: getNewIdForHabit(),
          actions: habits.actions.filter(action => action.id === habit.id).map(action => ({
            ...action,
            value: !action.value ? action.value = 0 : action.value
          }))
        }

        localStorage.setItem(`habit_${newHabit.id}`, JSON.stringify(newHabit))
        addHabit(newHabit)
      }
    }
  }

  return (
    <section class="container mx-auto mt-2 bg-white h-full rounded-t-2xl pt-4 px-3 dark:bg-darkBlack dark:text-white">
      <div class="flex gap-1 justify-between">
        <Button class="mb-2" onClick={() => {
          setIsShowCreateHabit(old => !old)
        }}>Создать +</Button>
        <div class="flex gap-1">
          <A href="/library"><Button class="mb-2">Выбрать из библиотеки</Button></A>
          <input type="file" class="hidden" ref={uploadRef} onChange={e => uploadFile(e)} />
          <Button class="mb-2" onClick={() => uploadRef?.click()}>Загрузить</Button>
        </div>
      </div>
      <Modal isOpen={isShowCreateHabit()} onClose={() => setIsShowCreateHabit(false)}>
        <CreateHabit onCreate={onCreateHabit} categories={categories()} />
      </Modal>
      <div class="grid grid-cols-3 max-md:grid-cols-1 gap-2">
        <For each={habits().habits}>
          {habit => <Habit habit={habit} />}
        </For>
      </div>
    </section>
  )
}
