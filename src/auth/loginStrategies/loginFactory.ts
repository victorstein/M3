import { Injectable } from "@nestjs/common";
import { AuthTypes, ILogin } from "auth/auth.types";
import { EmailAndPasswordAuthStrategy } from "./emailAndPassword.strategy";
import { GoogleAuthStrategy } from "./google.strategy";

@Injectable()
export class LoginFactory {
  constructor (
    private readonly emailAndPasswordStrategy: EmailAndPasswordAuthStrategy,
    private readonly googleStrategy: GoogleAuthStrategy,
  ) {}

  public getLoginStrategy(AuthType: AuthTypes): ILogin {
    if (AuthType === AuthTypes.EMAIL_AND_PASSWORD) {
      return this.emailAndPasswordStrategy
    } if (AuthType === AuthTypes.GOOGLE) {
      return this.googleStrategy
    } else {
      throw new Error(`The Provided Auth type "${AuthType}" is not valid`)
    }
  }
}