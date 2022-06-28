import { ReactElement } from 'react'
import { dashed } from '@/utils/array'

export default function Panels(props: { contents: ReactElement[] }) {
  return (
    <div className="flex-1 px-6 pb-12 overflow-y-auto">
      {props.contents.map((content, index) => (
        <div key={dashed('user-profile-panel', index)} className="h-full">
          <div className="mb-6">{content}</div>
        </div>
      ))}
    </div>
  )
}
