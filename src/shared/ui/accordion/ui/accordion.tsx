import { Component, createSignal, JSXElement } from 'solid-js'

export interface IAccordionProps {
  title: string
  children: JSXElement
}

export const Accordion: Component<IAccordionProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false)
  return (
    <div>
      <button type="button"
              class="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
              onClick={() => setIsOpen(!isOpen())}
      >
        <span>{props.title}</span>
      </button>


      <div class={isOpen() ? '' : 'hidden'}>
        <div class="p-5 border border-gray-200 dark:border-gray-700 dark:bg-gray-900">
          {props.children}
        </div>
      </div>
    </div>
  )
}