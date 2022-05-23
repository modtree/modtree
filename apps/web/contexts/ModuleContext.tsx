import { ModuleCondensed } from 'database'
import React, { createContext, useState } from 'react'
import { UseState } from 'types'

type UserContextProps = {
  selectedState: UseState<Set<ModuleCondensed>>
}

const ModuleContext = createContext<UserContextProps>({
  selectedState: [new Set(), () => true],
})

const ModuleProvider = (props: React.PropsWithChildren<{}>) => {
  const selectedState = useState(new Set<ModuleCondensed>())
  return <ModuleContext.Provider value={{ selectedState }} {...props} />
}

export { ModuleContext, ModuleProvider }
