import { Logger, Module } from '@nestjs/common'
import { UserModule } from 'user/user.module'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'
import { JWTCookieStrategy } from './authStrategies/jwt-coockie.strategy'
import { EmailAndPasswordAuthStrategy } from './loginStrategies/emailAndPassword.strategy'
import { FacebookAuthStrategy } from './loginStrategies/facebook.strategy'
import { GoogleAuthStrategy } from './loginStrategies/google.strategy'
import { LoginFactory } from './loginStrategies/login.factory'
import { JwtTokenStrategy } from './tokenStrategies/jwt.token.strategy'
import { MobileTokenStrategy } from './tokenStrategies/mobile.token.strategy'
import { RefreshTokenStrategy } from './tokenStrategies/refresh.token.strategy'
import { TokenFactory } from './tokenStrategies/token.factory'

@Module({
  imports: [UserModule],
  providers: [
    AuthResolver,
    AuthService,
    Logger,
    JWTCookieStrategy,
    LoginFactory,
    GoogleAuthStrategy,
    FacebookAuthStrategy,
    EmailAndPasswordAuthStrategy,
    TokenFactory,
    MobileTokenStrategy,
    RefreshTokenStrategy,
    JwtTokenStrategy
  ],
  exports: [AuthService]
})
export class AuthModule {}
