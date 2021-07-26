import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DocumentType } from 'base/baseTypes';
import { IEnv } from 'env.types';
import { mock } from 'jest-mock-extended';
import { Role } from 'role/role.entity';
import { RoleService } from 'role/role.service';
import { User } from 'user/user.entity';
import { UserService } from 'user/user.service';
import { SeederService } from './seeder.service';

const mockUserService = mock<UserService>()
const mockRoleService = mock<RoleService>()
const mockLogger = mock<Logger>()
const mockConfigService = mock<ConfigService<IEnv>>()


jest.mock('role/types/roleTypes', () => ({
  __esModule: true,
  Roles: { test: 'test', test2: 'test2' }
}))

describe('SeederService', () => {
  let service: SeederService;

  beforeEach(async () => {    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeederService,
        { provide: UserService, useValue: mockUserService },
        { provide: RoleService, useValue: mockRoleService },
        { provide: Logger, useValue: mockLogger },
        { provide: ConfigService, useValue: mockConfigService }
      ],
    }).compile();

    service = module.get<SeederService>(SeederService);
  });

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset default value for the mocks
    mockUserService.findOneByRole.mockResolvedValue({} as DocumentType<User>)
    mockRoleService.findOneByParam.mockResolvedValue({ _id: 'foundRole' } as DocumentType<Role>)
    mockConfigService.get.mockReturnValue('test@test.test')
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('seedRoles', () => {
    it('Should call the upsertByParam method from the roleService with the right params', async () => {     
      await service.seedRoles()
      expect(mockRoleService.upsertByParam).toHaveBeenNthCalledWith(
        1,
        { name: 'test' },
        {
          description: `Test role.`,
          name: 'test',
          type: 'test'
        }
      )
      expect(mockRoleService.upsertByParam).toHaveBeenNthCalledWith(
        2,
        { name: 'test2' },
        {
          description: `Test2 role.`,
          name: 'test2',
          type: 'test2'
        }
      )
    })
  })

  describe('seedAdmin', () => {
    it('Should log to the console if the admin user was found', async () => {
      await service.seedAdmin()
      expect(mockLogger.verbose).toHaveBeenNthCalledWith(1, 'Looking for admin user')
      expect(mockLogger.verbose).toHaveBeenNthCalledWith(2, 'There\'s an existing admin user in the DB. New admin not created.')
    })

    it('Should Throw if there is no admin user email in env file and no admin was found', async () => {
      mockUserService.findOneByRole.mockResolvedValue(null)
      mockConfigService.get.mockReturnValue(null)
      await expect(service.seedAdmin()).rejects.toThrowError('Database seed error. ADMIN_EMAIL not set in .env file.')
    })

    it('Should log all the steps if the admin user was not found and admin role has not been created', async () => {
      mockUserService.findOneByRole.mockResolvedValue(null)
      mockRoleService.findOneByParam.mockResolvedValueOnce(null)
      await service.seedAdmin()
      expect(mockLogger.verbose).toHaveBeenNthCalledWith(1, 'Looking for admin user')
      expect(mockLogger.verbose).toHaveBeenNthCalledWith(2, 'Admin user was not found.')
      expect(mockLogger.verbose).toHaveBeenNthCalledWith(3, 'Check if admin email on .env')
      expect(mockLogger.verbose).toHaveBeenNthCalledWith(4, 'Checking if ADMIN role exists...')
      expect(mockLogger.verbose).toHaveBeenNthCalledWith(5, 'Admin role not found. Creating Base roles...')
      expect(mockLogger.verbose).toHaveBeenNthCalledWith(6, 'Add user to DB')
    })

    it('Should gneretate a temporary password for the admin and hash it', async () => {
      mockUserService.findOneByRole.mockResolvedValue(null)
      await service.seedAdmin()
      expect(mockUserService.generateTemporaryPassword).toHaveBeenCalledTimes(1)
      expect(mockUserService.hashPassword).toHaveBeenCalledTimes(1)
    })

    it('Should call the roleSeeder method if the admin role doesn\'t exist', async () => {
      mockUserService.findOneByRole.mockResolvedValue(null)
      mockRoleService.findOneByParam.mockResolvedValueOnce(null)

      service.seedRoles = jest.fn()
      await service.seedAdmin()
      expect(service.seedRoles).toHaveBeenCalledTimes(1)
    })
  })
});
