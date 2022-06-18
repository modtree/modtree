import { Request } from 'express'

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
