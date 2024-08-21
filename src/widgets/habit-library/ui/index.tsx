import { Component, createMemo, For } from 'solid-js'
import { Accordion, Modal } from '@/shared/ui'
import { Habit } from '@/shared/libs/types'

interface IHabitLibraryProps {
  isOpen: boolean
  onClose: () => void
}

const habitList: Habit[] = [{
  id: 0,
  addDate: new Date(),
  title: 'Спать 8 часов каждый день',
  period: 'daily',
  category: 'Здоровье',
  actions: []
}]

export const HabitLibrary: Component<IHabitLibraryProps> = (props) => {
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
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <h1>Библиотека привычек</h1>
      <div class="grid gap-1">
        <For each={Object.entries(categories())}>
          {category => (
            <Accordion title={category[0]}>
              <div class="grid gap-1">
                <For each={category[1]}>{a => JSON.stringify(a)}</For>
              </div>
            </Accordion>
          )}
        </For>
      </div>
    </Modal>
  )
}