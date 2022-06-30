import axios, { AxiosError, AxiosResponse } from 'axios'
import fs from 'fs'

const log = {
  response: (res: AxiosResponse<any, any>) => {
    return res.data
  },
  error: (err: AxiosError) => {
    return err
  },
}

async function verbosify(apiCall: () => Promise<any>): Promise<any> {
  return apiCall().then(log.response).catch(log.error)
}

export class postman {
  static url = JSON.parse(fs.readFileSync('postman.config.json').toString()).url
  static get(endpoint: string) {
    return verbosify(() => axios.get(postman.url + endpoint))
  }
  static post(endpoint: string, params?: any) {
    return verbosify(() => axios.post(postman.url + endpoint, params))
  }
  static patch(endpoint: string, params?: any) {
    return verbosify(() => axios.patch(postman.url + endpoint, params))
  }
  static delete(endpoint: string, params?: any) {
    return verbosify(() => axios.delete(postman.url + endpoint, params))
  }
}

export class ParseArgs {
  args: string[]
  postArgs: string[]
  last: string
  constructor(filename: string, callback: () => void) {
    this.args = process.argv
    this.last = this.args[this.args.length - 1]
    if (this.last === filename) {
      callback()
    }
    this.postArgs = this.args.slice(
      this.args.indexOf(filename) + 1,
      this.args.length
    )
  }
}
