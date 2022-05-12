import { exec as execDefault } from 'child_process'

/**
 * Executes a shell command and return it as a Promise.
 * @param {string} cmd
 * @return {Promise<string>}
 */
export function exec(cmd: string): Promise<string> {
  return new Promise((resolve) => {
    execDefault(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error)
      }
      resolve(stdout ? stdout : stderr)
    })
  })
}
