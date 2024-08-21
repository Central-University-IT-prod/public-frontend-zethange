import { Accessor, Component, createContext, createSignal, JSXElement, onMount } from 'solid-js'
import { IUser } from '@/entities/user'

export interface ITheme {
  theme: 'dark' | 'light'
}

export type IThemeContext = [Accessor<ITheme>, {
  setTheme: (theme: 'dark' | 'light') => void
}]

export const ThemeContext = createContext<IThemeContext>()

export const ThemeProvider: Component<{ children: JSXElement }> = (props) => {
  const [state, setState] = createSignal<ITheme>({ theme: 'light' })

  const theme: IThemeContext = [
    state,
    {
      setTheme: (theme) => {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }

        const user = JSON.parse(localStorage.getItem('user') || 'null') as IUser | null
        if (user) {
          user.theme = theme
        }
        localStorage.setItem('user', JSON.stringify(user))

        setState({ theme })
      }
    }
  ]

  onMount(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null') as IUser
    if (!user || !user.theme) return

    setState({ theme: user.theme })
    if (user.theme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  })

  return (
    <ThemeContext.Provider value={theme}>
      {props.children}
    </ThemeContext.Provider>
  )
}
