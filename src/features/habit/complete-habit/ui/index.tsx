import { Component } from 'solid-js'
import { Button, Modal } from '@/shared/ui'
import { removeHabit as rmHabit, updateHabit } from '@/entities/habit'
import { Habit } from '@/shared/libs/types'

export interface ICompleteHabitProps {
  isOpen: boolean
  onClose: () => void
  habit: Habit
}

export const CompleteHabit: Component<ICompleteHabitProps> = (props) => {
  function removeHabit() {
    localStorage.removeItem(`habit_${props.habit.id}`)
    rmHabit(props.habit.id)
    props.onClose()
  }

  function stopTrackingHabit() {
    const updatedHabit: Habit = {
      ...props.habit,
      isArchived: true
    }

    updateHabit(props.habit.id, updatedHabit)
    localStorage.setItem(`habit_${updatedHabit.id}`, JSON.stringify(updatedHabit))
    props.onClose();
  }

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <div class="grid gap-1">
        <Button class="bg-red-500 hover:bg-red-600 w-full" onClick={removeHabit}>Удалить
          навсегда</Button>
        <Button class="bg-emerald-500 hover:bg-emerald-600 w-full" onClick={stopTrackingHabit}>Перестать трекать</Button>
      </div>
    </Modal>
  )
}