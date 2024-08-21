import { Component } from 'solid-js'
import { Modal } from '@/shared/ui'

export interface IImportFromJson {
  isOpen: boolean
  onClose: () => void
}

// TODO
export const ImportFromJson: Component<IImportFromJson> = (props) => {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <div>123</div>
    </Modal>
  )
}