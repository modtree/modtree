export type ModtreeFunction<T> = () => Promise<T>
type Data = string | number | boolean
type BaseArgs = Partial<Record<string, Data>>

export type ModtreeFunctionWithArgs<A extends BaseArgs, T> = (
  args: A
) => Promise<T>
