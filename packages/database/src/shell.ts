import { exec as execDefault, ExecException } from 'child_process'

type Response = {
  output: string
  error: ExecException
}

/**
 * Executes a shell command and return it as a Promise.
 * @param {string} cmd
 * @return {Promise<string>}
 */
export function exec(cmd: string): Promise<Response> {
  return new Promise((resolve, reject) => {
    execDefault(cmd, (error, stdout, stderr) => {
      resolve({
        output: stdout ? stdout : stderr,
        error,
      })
      reject({
        output: 'rejected, but calmn down and carry on shelling',
        error,
      })
    })
  })
}
