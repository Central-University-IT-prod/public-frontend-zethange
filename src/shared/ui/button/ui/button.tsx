import { Component, JSX, JSXElement } from 'solid-js'

export interface IButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  children: JSXElement
}

export const Button: Component<IButtonProps> = (props) => {
  return <button {...props} class={'bg-black hover:bg-gray-900 dark:bg-white text-white dark:text-black font-bold px-3 py-1 rounded-lg icon-before dark:bg-slate-500 dark:hover:bg-slate-500' + ' ' + props.class}/>
}