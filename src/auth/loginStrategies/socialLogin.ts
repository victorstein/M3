import { Injectable } from "@nestjs/common";
import * as jwksClient from 'jwks-rsa'
import * as jwt from 'jsonwebtoken'
import { GoogleUser } from "auth/auth.types";

@Injectable()
export abstract class SocialLogin {
  abstract readonly jwk_uri: string

  private async getSigningKey (kid?: string): Promise<string> {
    // Generate the client
    const client = jwksClient({ jwksUri: this.jwk_uri })

    const key = await new Promise<string>((resolve, reject) => {
      client.getSigningKey(kid, (err, key) => {
        if (err) { reject(err) }
        const signingKey = key.getPublicKey();
        resolve(signingKey)
      });
    })

    return key
  }

  async validateToken(token: string): Promise<GoogleUser | unknown> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        async ({ kid }, callback) => {
          const signingKey = await this.getSigningKey(kid)
          callback(null, signingKey)
        },
        {},
        (err, decoded: GoogleUser | unknown) => {
          if (err !== null) return reject(err);
          resolve(decoded);
        });
    });
  }
}