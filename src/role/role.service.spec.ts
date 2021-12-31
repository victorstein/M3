import { UserService } from 'user/user.service'
import { RoleService } from './role.service'
import { Role } from './role.entity'
import { Model } from 'mongoose'
import { getModelToken } from '@nestjs/mongoose'
import { Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { mock } from 'jest-mock-extended'

const mockRoleModel = mock<Model<Role>>()
const mockLogger = mock<Logger>()
const userService = mock<UserService>()

describe('RoleService', () => {
  let service: RoleService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        { provide: getModelToken('Role'), useValue: mockRoleModel },
        { provide: UserService, useValue: userService },
        { provide: Logger, useValue: mockLogger }
      ]
    }).compile()

    service = module.get<RoleService>(RoleService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
