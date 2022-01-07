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

export interface ICookies {
  jwt: string
  refresh: string
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

export enum AuthTypes {
  EMAIL_AND_PASSWORD = 'emailAndPassword',
  GOOGLE = 'google',
  FACEBOOK = 'facebook'
}

export enum TokenType {
  JWT = 'JWT_TOKEN',
  REFRESH = 'REFRESH_TOKEN',
  MOBILE = 'MOBILE_TOKEN',
  EMAIL = 'EMAIL_TOKEN'
}

export interface Credentials {
  email: string
  password: string
  token: string
}

export type LoginArgs = {
  authType: AuthTypes
} & Credentials
export interface ILogin {
  login: (args: Credentials) => Promise<DocumentType<User>>
}

export interface ValidateTokenArgs {
  token: string
  tokenType?: TokenType
}

export interface GenerateTokenArgs {
  user: DocumentType<User>
  tokenType?: TokenType
}

export interface IToken {
  validateToken: (token: string) => IPayload
  generateToken: (user: DocumentType<User>) => string
}

export const cookieOptions = { httpOnly: true, signed: true, secure: process.env.NODE_ENV === 'production' }

export interface GoogleUser {
  iss: string
  azp: string
  aud: string
  sub: string
  email: string
  email_verified: boolean
  at_hash: string
  name: string
  picture: string
  given_name: string
  family_name: string
  locale: string
  iat: number
  exp: number
}

export interface FacebookUser {
  email: string
  name: string
  id: string
}
