import { Dispatch, SetStateAction, useState, ReactElement } from 'react'

const TabSelect = (props: {
  children: string
  isSelected: boolean
  setSelected: Dispatch<SetStateAction<number>>
  index: number
}) => {
  // onClick={() => props.setSelected(index)}
  const on = props.isSelected === true
  const accent = 'hsl(var(--nextra-primary-hue), 100%, 50%)'
  const style = on ? { color: accent, borderColor: accent } : { borderColor: 'transparent' }
  return (
    <div
      style={style}
      className="rounded-md px-3 py-2 cursor-pointer border-b-2 rounded-none"
      onClick={() => props.setSelected(props.index)}
    >
      {props.children}
    </div>
  )
}

const TabSelectArea = (props: {
  items: string[]
  selected: number
  setSelected: Dispatch<SetStateAction<number>>
}) => {
  return (
    <div className="flex flex-row border-b">
      <button />
      {props.items.map((select, index) => (
        <TabSelect
          key={index}
          isSelected={props.selected === index}
          setSelected={props.setSelected}
          index={index}
        >
          {select}
        </TabSelect>
      ))}
    </div>
  )
}

export const Tabs = (props: { items: string[]; children: ReactElement[] }) => {
  const [selected, setSelected] = useState(0)
  return (
    <div>
      <TabSelectArea
        items={props.items}
        selected={selected}
        setSelected={setSelected}
      />
      {props.children[selected]}
    </div>
  )
}

export const Tab = (props: { children: ReactElement }) => {
  return <>{props.children}</>
}
