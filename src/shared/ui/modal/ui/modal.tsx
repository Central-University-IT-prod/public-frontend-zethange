import { Component, JSXElement, onCleanup, onMount, Show } from 'solid-js'
import { Portal } from 'solid-js/web'

export interface IModalProps {
  children: JSXElement,
  isOpen: boolean,
  onClose: () => void,
}

export const Modal: Component<IModalProps> = (props) => {

  onMount(() => {
    document.body.classList.add('overflow-hidden')
  })

  onCleanup(() => {
    document.body.classList.remove('overflow-hidden')
  })

  return (
    <Show when={props.isOpen}>
      <Portal mount={document.body}>
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div class="bg-white p-4 rounded-lg max-w-xl w-full dark:bg-darkBlack">
            {props.children}
            <button
              data-testid="close-button"
              class="mt-4 w-full text-center text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md py-2"
              onClick={() => props.onClose()}
            >
              Закрыть
            </button>
          </div>
        </div>
      </Portal>
    </Show>
  )
}