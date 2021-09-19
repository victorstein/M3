import { ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { AuthStrategies } from '../auth.types'

@Injectable()
export class JWTCookieGuard extends AuthGuard(AuthStrategies.JWT_COOKIE) {
  getRequest (context: ExecutionContext): ExecutionContext {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }
}
