import { DocumentType } from '@typegoose/typegoose'
import { User } from 'user/user.entity'
import * as jwt from 'jsonwebtoken'

export enum AuthStrategies {
  JWT_COOKIE = 'jwt-cookie'
}

export enum CookieNames {
  JWT = 'jwt',
  REFRESH = 'refresh'
}

export interface Payload {
  version: number
  userId: string
}

export type IPayload = Payload & jwt.JwtPayload

export enum JWTErrorTypes {
  EXPIRED = 'TokenExpiredError',
  TOKEN_ERROR = 'JsonWebTokenError',
  NOT_ACTIVE = 'NotBeforeError'
}

export interface ValidateTokenArgs {
  token: string
  isRefreshToken?: boolean
}

export interface GenerateTokenArgs {
  user: DocumentType<User>
  isRefreshToken?: boolean
}

export const cookieOptions = { httpOnly: true, signed: true, secure: process.env.NODE_ENV === 'production' }
