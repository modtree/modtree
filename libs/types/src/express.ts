import type { Request } from 'express'

/**
 * originally from 'express-serve-static-core' npm package
 */
interface ParamsDictionary {
  [key: string]: string
}

export type CustomReqBody<ReqBody> = Request<ParamsDictionary, unknown, ReqBody>

export type CustomReqQuery<ReqQuery> = Request<
  ParamsDictionary,
  unknown,
  unknown,
  ReqQuery
>

export type CustomReqParams<ReqParams> = Request<ReqParams, unknown, unknown>

export type RouteMethod = 'get' | 'patch' | 'post' | 'delete'
