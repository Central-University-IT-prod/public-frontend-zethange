import { Component, createContext, JSXElement } from 'solid-js'
import { createStore } from 'solid-js/store'

type IDateContext = [
  {
    date: Date,
  },
  {
    setDate: (date: Date) => void;
  }
]

export const DateContext = createContext<IDateContext>([{ date: new Date() }, {
  setDate: () => {
  }
}])


export const DateProvider: Component<{ children: JSXElement }> = (props) => {
  const [state, setState] = createStore({ date: new Date() })
  const date: IDateContext = [
    state,
    {
      setDate(date: Date) {
        setState({ date })
      }
    }
  ]

  return (
    <DateContext.Provider value={date}>
      {props.children}
    </DateContext.Provider>
  )
}