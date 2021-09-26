import { Inject, Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Service } from 'base/base.service'
import { Role } from './role.entity'
import { ModelType } from '@typegoose/typegoose/lib/types'

@Injectable()
export class RoleService extends Service<Role> {
  @Inject() logger: Logger
  @InjectModel('Role') model: ModelType<Role>
}
