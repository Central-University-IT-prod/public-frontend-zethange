import { Component, For, onMount } from 'solid-js'
import { loadUserFromLocalStorage, setCoin } from '@/entities/user'

export const Store: Component = () => {

  onMount(() => {
    loadUserFromLocalStorage()
  })

  const items = [
    {
      title: 'Пиво',
      image: 'https://alkoteka.com/image/50218.png',
      description: 'Пиво, которое Вася трекает',
      onClick: () => {
        setCoin(0)
      }
    }
  ]

  return (
    <section class="grid grid-cols-4 mt-2 container mx-auto">
      <For each={items}>{item => (
        <div class="flex gap-2 items-center dark:text-white">
          <img src={item.image} alt={item.title} class="h-16 w-16" />
          <div class="grid gap-1">
            <span>{item.title}</span>
            <button onClick={item.onClick}>купить</button>
          </div>
        </div>
      )}
      </For>
    </section>
  )
}