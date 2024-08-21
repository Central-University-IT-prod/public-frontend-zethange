import { Component, createEffect, createMemo, createSignal, onMount, Show, useContext } from 'solid-js'
import { Route, Router } from '@solidjs/router'
import { Home } from '@/pages/home'
import { Store } from '@/pages/store'
import { $user, addCoin, calculateLevel, loadUserFromLocalStorage } from '@/entities/user'
import { useStore } from '@nanostores/solid'
import { setDate } from '@/entities/habit'
import { ThemeContext } from '@/app/providers/theme'
import { Button } from '@/shared/ui'
import { Library } from '@/pages/library'


const App: Component = () => {
  const user = useStore($user)
  const themeContext = useContext(ThemeContext)
  const level = createMemo(() => {
    return calculateLevel(user().totalCompleted)
  })

  onMount(() => {
    loadUserFromLocalStorage()

    if ('Notification' in window) {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission().then()
      }
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then()
    }


    const dateStr = localStorage.getItem('date')
    if (dateStr) {
      setDate(new Date(dateStr))
    } else {
      setDate(new Date())
    }
  })

  const [showMellstroy, setShowMellstroy] = createSignal({
    show: false,
    image: ''
  })
  createEffect(() => {
    const lastLevel = localStorage.getItem('last')
    if (level().toNextLevel == 5 && level().currentLevel !== 0 && +(lastLevel ?? 0) !== level().currentLevel) {
      fetch(`https://g.tenor.com/v1/search?q=%D0%BC%D0%B5%D0%BB%D1%81%D1%82%D1%80%D0%BE%D0%B9&key=LIVDSRZULELA&limit=1&pos=${level().currentLevel}`)
        .then((res) => res.json())
        .then(data => {
          setShowMellstroy(o => ({ ...o, show: true, image: data.results[0].media[0].gif.url }))
          setTimeout(() => {
            setShowMellstroy(o => ({ ...o, show: false }))
          }, 4 * 1000)
          localStorage.setItem('last', level().currentLevel.toString())
        })
    }
  })


  return (
    <main class="h-full">
      <header
        class="p-2 border-b flex justify-between items-center bg-white dark:bg-darkBlack dark:text-white dark:border-gray-800"
      >
        <div class="flex gap-5 items-center">
          <div class="grid gap-1 select-none">
            <a href="/">Habito</a>
            <span onClick={() => addCoin(0.001)}
                  class="text-sm text-gray-600">Уровень: {level().currentLevel}</span>
          </div>

          <a href="https://www.youtube.com/watch?v=u4ZtCuxMls0">
            <div class="flex gap-2 items-center">
              <span>{user().coins.toFixed(3)}</span>
              <img src="/chocopie.webp" alt="Chocopie-coin" class="w-10 h-10" />
            </div>
          </a>
        </div>

        <div class="flex gap-5 items-center">
          <input type="date" onChange={(e) => {
            const date = new Date(e.target.value)
            setDate(date)
            location.reload()
          }} />
          <a href="/store" class="max-md:hidden">В магаз</a>
          <Button onClick={() => {
            if (!themeContext) return
            if (themeContext[0]!().theme === 'light') {
              themeContext[1].setTheme('dark')
            } else {
              themeContext[1].setTheme('light')
            }
          }} class="max-md:hidden">Поменять тему</Button>
        </div>
      </header>


      <div class="flex gap-1 items-center mt-2 max-md:px-2 container mx-auto max-w-96">
        <span>{level().currentLevel}</span>
        <progress class="w-full" value={String(Math.abs(level().toNextLevel - 5))} max="5" />
        <span>{level().currentLevel + 1}</span>
      </div>
      <Router>
        <Route path="/" component={Home} />
        <Route path="/store" component={Store} />
        <Route path="/library" component={Library} />
      </Router>
      <div
        class="md:hidden border dark:border-none p-2 rounded-lg bg-white dark:bg-black absolute bottom-2 left-2 right-2 h-12">
        <div class="flex justify-between items-center h-full">
          <a href="/store" class="text-black dark:text-white">Магазин</a>
          <img
            class="w-10 h-10"
            src={(themeContext![0]().theme || 'light') === 'light' ? `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABlklEQVR4nO2Yu0oDQRSGv6iNoL6AEbUR7ETwggSx1TKCCNbWPoCI+gyKL2LhBYyaYGMhVt6wUwuvYExjtXJgAiGsay6zszNmPvi7YeHj7Jw9e8Dj8XhaiTOgwD8gUHG6EkFVnKxMIUQkj8MErr9alZVxuhItyRSwBhwAL0AGh0gBS8BFSFNI4wj9wFGIQDmdOEAG+IyQkHRjOTNA6Q8JyZDNs1Qf8F6DhGSWBMeQQsS5NuC0RgnJNgmOIfmIcwt1SEgegA4s+3KngMs6RSTLWMZEAxKSJ9u610aDIpI9oB1LOGlCRLKlmkXi3DcpItkFepIWKWkQkbwCK0l0szJFTSLlPAI7wBwwDHSp2Sytxh/pkrFwq1kkiMgzMZIzKLIfp8imQZHVOEVGDYqMxykil+/GgMQ5Bpg3ILJoQiT1y+ZRVw7jbLvVDKgNiW6JD/XTZpRp4FujRBGYNC1RKaOjMm/qWYky2OSdyQG9WIJczixwVYeALPOytoz1YYwA62ppdw18qan5DjhW69Qxk53J4/F4PJ5/yw87o+iwCGWh5AAAAABJRU5ErkJggg==` : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACjUlEQVR4nO2Zy2oUURCGD7lgDBNEScSFujfmFYwYN4KgIvEhkjDeNuJGXMW9PoG3BzGzFKITxcu4cSe6EQ3e0U8K/4GZY5yZc7r7TEf6h4bhTFfV//eprqlT41yFChWGCuAB8NBtdyC47Q4qISVD6XYE2ANMpBICjAO7Q+0GEfEJaAIzRQsBZoBHwAdgVzDhHo53AI/FaSNEDNAA1gJFbCiWxRyPJj5AgOfAvlwD/B3jWRExCheTTESPrQ8uAD7MR2zq5iHGAn/2gwIjwDxwU+3JG+CtPt8Cjtg9ns1e4It8phHhPcVpb+0osE5/2D3znu10HrubGcBV4JeIWpk+D8wCk7pmtdZOS7v3iisTgOsi9xVY8lNni9RbBr7J5porA4CTerom4liA3YLE/AROFMuyD4Ax4KWe7FKE/UpHKR9zwwKw2FEyRyLsR4En8nG2GJaDEbkvEvUMPi7Kx+182YWRaInEoQw+DsvHizyJ1YDXPep/w7t/U+u1DDGn5ONjLI8YIV1drAXX+lRiIWux8f5Fol2xZjP4mMs9tTK87Bcy+LgsH3fcsACcEwkroaOR5fepfCwWw3Lwc/UrEVmOsK/LtpX7STAUwBmRsXZjIcDuuGysvTnlygDgRoeYlV5ppnSqdzSNq64s4E9H2xaD8v6SKlJN15zW2u+E7cRqTGtTRMM46a2d7vi174WWn0429iH1e6Kjrp3y3vmnOhUAaybvqavd1GUDhbv6rouwdux90qOuN3xYz6P9lngbyKUZPhQ5skkxN0s2d6JoMRoeNGO2PvQfK7rFWMyd0cS3cH4A+JF4iN0EvgP7gwn3cX4w8d8KExbTlQWxQkqHSkjZ8D/tSCP3M3aFChVcKH4DW1NFx8NweQsAAAAASUVORK5CYII='}
            onClick={() => {
              if (!themeContext) return
              if (themeContext[0]!().theme === 'light') {
                themeContext[1].setTheme('dark')
              } else {
                themeContext[1].setTheme('light')
              }
            }} alt="Сменить тему" />
        </div>
      </div>
      <Show when={showMellstroy().show}>
        <div class="absolute bottom-2 right-2">
          <div>Новый уровень! {level().currentLevel}</div>
          <img src={showMellstroy().image} alt="Рандомная гифочка" class="height-[100px]" />
        </div>
      </Show>
    </main>
  )
}

export { App }
