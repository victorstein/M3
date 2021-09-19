import { Logger, Module } from '@nestjs/common'
import { UserModule } from 'user/user.module'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'
import { JWTCookieStrategy } from './authStrategies/jwt-cockie.strategy'

@Module({
  imports: [UserModule],
  providers: [AuthResolver, AuthService, Logger, JWTCookieStrategy],
  exports: [AuthService]
})
export class AuthModule {}
