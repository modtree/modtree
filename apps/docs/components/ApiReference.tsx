import { moduleCondensedMethods } from "../data/module-condensed"
import Method from "./Method"

export default function ApiReference(props: {data: MethodProps[]}) {
  return (
    <>
      {props.data.map(m => (
        <Method {...m}/>
      ))}
    </>
  )
}

export const ModuleCondensedMethods = () => {
  return (
    <ApiReference data={moduleCondensedMethods}/>
  )
}
