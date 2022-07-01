import { exec as execDefault } from 'child_process'
import { ShellResponse } from '@modtree/types'

/**
 * Executes a shell command and return it as a Promise.
 *
 * @param {string} cmd
 * @returns {Promise<Response>}
 */
export function exec(cmd: string): Promise<ShellResponse> {
  return new Promise((resolve, reject) => {
    execDefault(cmd, (_, stdout, stderr) => {
      resolve({
        command: cmd,
        output: stdout || stderr,
        error: new Error(`stderr: ${stderr}`),
      })
      reject(new Error('rejected, but calmn down and carry on shelling'))
    })
  })
}
