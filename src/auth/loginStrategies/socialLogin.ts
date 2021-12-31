import { Injectable } from '@nestjs/common'
import * as jwksClient from 'jwks-rsa'
import * as jwt from 'jsonwebtoken'
import { GoogleUser } from 'auth/auth.types'

@Injectable()
export abstract class SocialLogin {
  abstract readonly jwk_uri: string

  private async getSigningKey (kid?: string): Promise<string> {
    // Generate the client
    const client = jwksClient({ jwksUri: this.jwk_uri })

    const key = await new Promise<string>((resolve, reject) => {
      client.getSigningKey(kid, (err, key) => {
        if (err !== null) return reject(err)
        const signingKey = key.getPublicKey()
        resolve(signingKey)
      })
    })

    return key
  }

  async validateToken (token: string): Promise<GoogleUser | unknown> {
    return await new Promise((resolve, reject) => {
      jwt.verify(
        token,
        ({ kid }, callback) => {
          this.getSigningKey(kid)
            .then((signingKey) => callback(null, signingKey))
            .catch(e => reject(e))
        },
        {},
        (err, decoded: GoogleUser | unknown) => {
          if (err !== null) return reject(err)
          resolve(decoded)
        })
    })
  }
}
