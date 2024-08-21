import { Component, createSignal, For, JSX, Match, Switch } from 'solid-js'
import { Habit } from '@/shared/libs/types'
import { Button, Input, Select } from '@/shared/ui'
import { useStore } from '@nanostores/solid'
import { $habit } from '@/entities/habit'

export interface ICreateHabitProps {
  onCreate: (habit: Omit<Habit, 'id'>) => void
  categories: string[]
}

export const CreateHabit: Component<ICreateHabitProps> = (props) => {
  const habits = useStore($habit)
  const [formState, setFormState] = createSignal<Omit<Habit, 'id'>>({
    title: '',
    period: 'daily',
    addDate: habits().currentDay,
    category: '',
    actions: []
  })

  const onSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (e) => {
    e.preventDefault()
    props.onCreate({ ...formState(), addDate: habits().currentDay })
  }

  const [isShowCreateCategory, setIsShowCreateCategory] = createSignal(false)

  return (
    <form class="p-2 grid gap-1 bg-white mb-2 rounded-lg dark:bg-gray-700 dark:text-white" onSubmit={onSubmit}>
      <div>
        <label for="title">Название привычки</label>
        <Input placeholder="Название задачи" id="title" onChange={(e) => {
          setFormState({ ...formState(), title: e.target.value })
        }} />
      </div>
      <div>
        <label for="period">Продолжительность</label>
        <Select id="period" onChange={(e) => {
          setFormState({ ...formState(), period: e.target.value as ('daily' | 'weekly' | 'monthly') })
        }}>
          <option value="daily">День</option>
          <option value="weekly">Неделя</option>
          <option value="monthly">Месяц</option>
        </Select>
      </div>
      <div class="grid gap-2">
        <label for="category">Категория:</label>

        <Button class="py-2" onClick={() => {
          setIsShowCreateCategory(a => !a)
          setFormState({...formState(), category: ''})
        }} type="button">{!isShowCreateCategory() ? 'Создать категорию' : 'Выбрать категорию'}</Button>
        <Switch>
          <Match when={!isShowCreateCategory()}>
            <Select id="category" onChange={(e) => {
              setFormState({ ...formState(), category: e.target.value as ('daily' | 'weekly' | 'monthly') })
            }}>
              <option value="">Не выбрано</option>
              <For each={props.categories}>
                {category => <option value={category}>{category}</option>}
              </For>
            </Select>
          </Match>
          <Match when={isShowCreateCategory()}>
            <Input placeholder="Название категории" id="category" onChange={(e) => {
              setFormState({ ...formState(), category: e.target.value })
            }} />
          </Match>
        </Switch>
      </div>
      <div>
        <label for="targetValue">Цель:</label>
        <Input type="number" placeholder="Цель" id="targetValue" onChange={(e) => {
          setFormState({ ...formState(), targetValue: Number(e.target.value) })
        }} />
      </div>

      <Button {...{ 'type': 'submit' }}>Сохранить</Button>
    </form>
  )
}