import { DocumentType } from '@typegoose/typegoose'
import { User } from 'user/user.entity'

export enum AuthStrategies {
  JWT_COOKIE = 'jwt-cookie'
}

export enum CookieNames {
  JWT = 'jwt',
  REFRESH = 'refresh'
}

export interface IPayload {
  version: number
  user: string
}

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
