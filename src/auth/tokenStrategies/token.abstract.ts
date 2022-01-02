import { Injectable } from '@nestjs/common'
import { DocumentType } from '@typegoose/typegoose'
import { User } from 'user/user.entity'
import { IPayload } from '../auth.types'
import * as jwt from 'jsonwebtoken'

@Injectable()
export abstract class TokenAuth {
  abstract readonly secret: string
  abstract readonly expiration: string

  validateToken (token: string): IPayload {
    return jwt.verify(token, this.secret) as IPayload
  }

  generateToken (user: DocumentType<User>): string {
    const payload: IPayload = { version: user.tokenVersion, userId: user._id }
    const token = jwt.sign(payload, this.secret, { expiresIn: this.expiration })
    return token
  }
}
