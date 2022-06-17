import { ValidationChain } from 'express-validator'

type Class<I, Args extends any[] = any[]> = new (...args: Args) => I

type Route<T> = {
  action: keyof T
  route: string
  method: 'post' | 'put' | 'patch' | 'get' | 'delete'
  validators: ValidationChain[]
}

type RouteWithController<T> = Route<T> & {
  controller: Class<T>
  validators: ValidationChain[]
}
