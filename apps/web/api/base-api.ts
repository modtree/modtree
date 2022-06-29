import store, { AppDispatch, RootState } from '@/store/redux'
import axios, { AxiosInstance } from 'axios'

export abstract class BaseApi {
  redux: () => RootState
  dispatch: AppDispatch
  server: AxiosInstance
  constructor() {
    this.redux = store.getState
    this.dispatch = store.dispatch
    this.server = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND,
    })
  }
}
