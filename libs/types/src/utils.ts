import { ExecException } from 'child_process'

export type Modify<T, R> = Omit<T, keyof R> & R
export type ShellResponse = {
  command: string
  stdout: string
  stderr: string
  error: ExecException
}
