import { Logger, Module } from '@nestjs/common'
import { UserModule } from 'user/user.module'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'
import { JWTCookieStrategy } from './authStrategies/jwt-coockie.strategy'
import { EmailAndPasswordAuthStrategy } from './loginStrategies/emailAndPassword.strategy'
import { GoogleAuthStrategy } from './loginStrategies/google.strategy'
import { LoginFactory } from './loginStrategies/loginFactory'

@Module({
  imports: [UserModule],
  providers: [
    AuthResolver,
    AuthService,
    Logger,
    JWTCookieStrategy,
    LoginFactory,
    GoogleAuthStrategy,
    EmailAndPasswordAuthStrategy
  ],
  exports: [AuthService]
})
export class AuthModule {}
