import { Tab } from '@headlessui/react'
import { ReactElement } from 'react'
import { dashed } from '@/utils/array'

export default function Panels(props: { contents: ReactElement[] }) {
  return (
    <Tab.Panels className="flex-1 px-6 pb-12 overflow-y-auto">
      {props.contents.map((content, index) => (
        <Tab.Panel key={dashed('user-profile-panel', index)} className="h-full">
          <div className="mb-6">{content}</div>
        </Tab.Panel>
      ))}
    </Tab.Panels>
  )
}
