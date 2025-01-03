import { FunctionalComponent, h } from '@stencil/core'
import { BEM } from '../../../utils/bem'

export interface TabControlItem {
  label: string
  value: number
}

export interface TabControlProps {
  value: number
  items: TabControlItem[]
  containerId: string
  onControlChange: (item: TabControlItem) => void
}

export const TabControl: FunctionalComponent<TabControlProps> = ({ value, items, containerId, onControlChange }) => {
  const block = BEM.block('carousel')
  const controls = block.element('controls')

  return (
    <div
      class={{
        ...controls.class(),
        ...controls.modifier('tabs').class(),
      }}
    >
      <bal-card>
        <bal-card-content>
          {items.map(item => (
            <bal-button
              aria-controls={containerId}
              key={item.value}
              expanded
              color={value === item.value ? 'primary' : 'light'}
              onClick={() => onControlChange(item)}
            >
              {item.label}
            </bal-button>
          ))}
        </bal-card-content>
      </bal-card>
    </div>
  )
}
