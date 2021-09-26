import { Inject, Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { RoleService } from 'role/role.service'
import { Service } from 'base/base.service'
import { Roles } from 'role/types/role.types'
import { User } from './user.entity'
import * as generator from 'generate-password'
import * as argon2 from 'argon2'
import { ModelType } from '@typegoose/typegoose/lib/types'

@Injectable()
export class UserService extends Service<User> {
  @Inject() logger: Logger
  @InjectModel('User') model: ModelType<User>
  @Inject() roleService: RoleService

  async findOneByRole (role: Roles): Promise<User | null> {
    this.logger.verbose(`Operation: findOneByRole. \n role: ${role}`)
    const foundRole = await this.roleService.findOneByParam({ type: role })
    if (foundRole === null) return null
    return await this.model.findOne({ role: foundRole._id })
  }

  generateTemporaryPassword (): string {
    this.logger.verbose('Generating temporary password')
    return generator.generate({
      length: 30,
      numbers: true,
      strict: true,
      symbols: true
    })
  }

  async hashPassword (password: string): Promise<string> {
    this.logger.verbose('Hashing temporary password')
    return await argon2.hash(password, { type: argon2.argon2i })
  }

  async validatePassword (userPassHash: string, pass: string): Promise<boolean> {
    return await argon2.verify(userPassHash, pass)
  }
}
