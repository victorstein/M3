import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common'
import { DocumentType } from '@typegoose/typegoose'
import { Credentials, ILogin } from 'auth/auth.types'
import { User } from 'user/user.entity'
import { UserService } from 'user/user.service'

@Injectable()
export class EmailAndPasswordAuthStrategy implements ILogin {
  constructor (
    private readonly userService: UserService,
    private readonly logger: Logger
  ) {}

  async login ({ email, password }: Credentials): Promise<DocumentType<User>> {
    try {
      const user = await this.userService.findOneByParam({ email: email })
      if (user == null) { throw new UnauthorizedException() }

      const validUser = await this.userService.validatePassword(user.password, password)

      if (!validUser) { throw new UnauthorizedException() }
      return user
    } catch (error) {
      this.logger.error(error.message)
      throw new InternalServerErrorException(error.message)
    }
  }
}
