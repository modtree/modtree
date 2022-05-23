import { ModuleCondensed } from 'database'
import React, { createContext, useState } from 'react'
import { UseState } from 'types'

type UserContextProps = {
  selectedState: UseState<ModuleCondensed[]>
  codesState: UseState<Set<string>>
}

const ModuleContext = createContext<UserContextProps>({
  selectedState: [[], ()=> true],
  codesState: [new Set(), () => true],
})

const ModuleProvider = (props: React.PropsWithChildren<{}>) => {
  const selectedState = useState<ModuleCondensed[]>([])
  const codesState = useState(new Set<string>())
  return (
    <ModuleContext.Provider value={{ selectedState, codesState }} {...props} />
  )
}

export { ModuleContext, ModuleProvider }
