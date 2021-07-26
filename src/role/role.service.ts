import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service } from 'base/service.base';
import { Role } from './role.entity';

@Injectable()
export class RoleService extends Service<Role> {
  @Inject() logger: Logger
  @InjectModel('Role') model: Model<Role>
}
