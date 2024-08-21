import { map } from 'nanostores'

export interface IUser {
  name: string;
  coins: number;
  level: number;
  theme: 'dark' | 'light';
  totalCompleted: number;
}

export const $user = map<IUser>({
  name: 'Вася',
  coins: 0,
  level: 1,
  theme: 'light',
  totalCompleted: 0,
})

export const addCoin = (count: number) => {
  $user.setKey('coins', $user.get().coins + count)
  localStorage.setItem('user', JSON.stringify($user.get()))
}

export const setCoin = (coins: number) => {
  $user.setKey('coins', coins)
  localStorage.setItem('user', JSON.stringify($user.get()))
}

export const setUser = (user: Partial<IUser>) => {
  const u: IUser = {
    ...$user.get(),
    ...user,
  }
  $user.set(u)
  localStorage.setItem('user', JSON.stringify(u))
}

export const calculateLevel = (x: number) => {
  const currentLevel = Math.floor(x / 5);
  return {
    x,
    currentLevel,
    toNextLevel: (currentLevel + 1) * 5 - x,
  }
}

export const loadUserFromLocalStorage = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  if (!user) return

  $user.set({
    ...$user.get(),
    ...user,
  })
}