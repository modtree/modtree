import axios, { AxiosError, AxiosResponse } from 'axios'
import boxen from 'boxen'

const box = (t: string, color: string) =>
  boxen(t, {
    borderColor: color,
    padding: {
      right: 2,
      left: 2,
      top: 0,
      bottom: 0,
    },
  })

const print = {
  status: () => console.log(box('STATUS', 'green')),
  data: () => console.log(box('DATA', 'green')),
}

const log = {
  response: (res: AxiosResponse<any, any>) => {
    print.status()
    console.log(res.status)
    print.data()
    console.log(res.data)
  },
  error: (err: AxiosError) => {
    const { status, data } = err.response
    console.log(err.code)
    print.status()
    console.log('status:', status)
    print.data()
    console.log('data:', data)
  },
}

function verbosify(apiCall: () => Promise<any>) {
  apiCall().then(log.response).catch(log.error)
}

export class postman {
  static get(url: string) {
    verbosify(() => axios.get(url))
  }
  static post(url: string, params?: any) {
    verbosify(() => axios.post(url, params))
  }
  static delete(url: string, params?: any) {
    verbosify(() => axios.delete(url, params))
  }
}
