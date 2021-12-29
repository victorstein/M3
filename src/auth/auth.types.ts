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

export enum AuthTypes {
  EMAIL_AND_PASSWORD = 'emailAndPassword',
  GOOGLE = 'google',
  FACEBOOK = 'facebook'
}

type Credentials = {
  email: string
  password: string
  token: string
}

export type LoginArgs = {
  authType: AuthTypes
} & Credentials
export interface ILogin {
  login(args: Credentials): Promise<DocumentType<User>>
}

export const cookieOptions = { httpOnly: true, signed: true, secure: process.env.NODE_ENV === 'production' }

export interface GoogleUser {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
  iat: number;
  exp: number;
}