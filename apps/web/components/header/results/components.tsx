import { ModuleCondensed } from '@modtree/entity'
import { ReactElement } from 'react'

export const ResultContainer = (props: {
  children: ReactElement[] | ReactElement
  hasResults: boolean
}) => {
  const border = 'border border-gray-200'
  return props.hasResults ? (
    <div
      className={`flex-col shadow-md rounded-b-xl overflow-hidden ${border}`}
    >
      {props.children}
    </div>
  ) : null
}

/**
 * one entry
 */
export const ResultEntry = (props: { module: ModuleCondensed }) => {
  const { module } = props
  const { moduleCode, title } = module
  function openModuleModal() {
    alert('clicked on module')
  }
  return (
    <div
      className="border-b last:border-b-0 bg-white flex flex-row py-2 px-3 font-medium h-10 cursor-pointer hover:bg-gray-100"
      onClick={openModuleModal}
    >
      <div className="w-28 text-gray-500 font-semibold">{moduleCode}</div>
      <div className="text-gray-400 flex-1 mr-2 whitespace-nowrap overflow-hidden text-ellipsis break-all">
        {title}
      </div>
    </div>
  )
}
