import { ModuleCondensed } from 'database'
import React, { createContext, useState } from 'react'
import { UseState } from 'types'

type UserContextProps = {
  moduleCondensedState: UseState<ModuleCondensed[]>
  moduleCodeState: UseState<Set<string>>
}

const ModuleContext = createContext<UserContextProps>({
  moduleCondensedState: [[], () => true],
  moduleCodeState: [new Set(), () => true],
})

const ModuleProvider = (props: React.PropsWithChildren<{}>) => {
  const moduleCondensedState = useState<ModuleCondensed[]>([])
  const moduleCodeState = useState(new Set<string>())
  return (
    <ModuleContext.Provider value={{ moduleCondensedState, moduleCodeState }} {...props} />
  )
}

export { ModuleContext, ModuleProvider }
