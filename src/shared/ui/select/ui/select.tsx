import { Component, JSX } from 'solid-js'

export const Select: Component<JSX.SelectHTMLAttributes<HTMLSelectElement>> = (props) => {
  return <select {...props} class="appearance-none w-full py-2 px-3 rounded-md border border-gray-200 focus:border-blue-500 focus:outline-none text-gray-900 placeholder-gray-400 sm:text-sm md:text-base lg:text-lg" />
}