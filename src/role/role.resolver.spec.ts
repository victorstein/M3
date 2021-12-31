import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from 'user/user.service'
import { RoleResolver } from './role.resolver'
import { mock } from 'jest-mock-extended'
import { RoleService } from './role.service'

describe('RoleResolver', () => {
  let resolver: RoleResolver
  const mockUserService = mock<UserService>()
  const mockRoleService = mock<RoleService>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleResolver,
        { provide: RoleService, useValue: mockRoleService },
        { provide: UserService, useValue: mockUserService }
      ]
    }).compile()

    resolver = module.get<RoleResolver>(RoleResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
