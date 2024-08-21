import { describe, expect, it } from 'vitest'
import { render } from '@solidjs/testing-library'
import { Modal } from '@/shared/ui'
import { createSignal } from 'solid-js'

describe('Modal', () => {
  it('should show modal', () => {
    const [isOpen, setIsOpen] = createSignal(false)

    const text = 'Modal 123'

    const screen = render(() => (
      <Modal isOpen={isOpen()} onClose={() => setIsOpen(false)}>
        <div>{text}</div>
      </Modal>
    ), {})
    expect(screen.queryByText(text)).toBeNull()

    setIsOpen(true)
    expect(screen.queryByText(text)).toBeDefined()

    console.log(screen.container.innerHTML)

    expect(screen.queryByText(/Закрыть/)).toBeDefined()
    expect(screen.queryByText(text)).toBeNull()
  })
})