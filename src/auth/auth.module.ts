import { HttpModule } from '@nestjs/axios'
import { Logger, Module } from '@nestjs/common'
import { UserModule } from 'user/user.module'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'
import { JWTCookieStrategy } from './authStrategies/jwt-coockie.strategy'
import { EmailAndPasswordAuthStrategy } from './loginStrategies/emailAndPassword.strategy'
import { FacebookAuthStrategy } from './loginStrategies/facebook.strategy'
import { GoogleAuthStrategy } from './loginStrategies/google.strategy'
import { LoginFactory } from './loginStrategies/login.factory'
import { EmailTokenStrategy } from './tokenStrategies/email.token.strategy'
import { JwtTokenStrategy } from './tokenStrategies/jwt.token.strategy'
import { MobileTokenStrategy } from './tokenStrategies/mobile.token.strategy'
import { RefreshTokenStrategy } from './tokenStrategies/refresh.token.strategy'
import { TokenFactory } from './tokenStrategies/token.factory'

@Module({
  imports: [
    UserModule,
    HttpModule
  ],
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
    JwtTokenStrategy,
    EmailTokenStrategy
  ],
  exports: [AuthService, TokenFactory]
})
export class AuthModule {}
