import { ModuleCondensed } from 'database'
import React, { createContext, useState } from 'react'
import { UseState } from 'types'

type UserContextProps = {
  selectedState: UseState<Set<ModuleCondensed>>
  codesState: UseState<Set<string>>
}

const ModuleContext = createContext<UserContextProps>({
  selectedState: [new Set(), () => true],
  codesState: [new Set(), () => true],
})

const ModuleProvider = (props: React.PropsWithChildren<{}>) => {
  const selectedState = useState(new Set<ModuleCondensed>())
  const codesState = useState(new Set<string>())
  return (
    <ModuleContext.Provider value={{ selectedState, codesState }} {...props} />
  )
}

export { ModuleContext, ModuleProvider }
