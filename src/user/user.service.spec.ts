import { Test, TestingModule } from '@nestjs/testing'
import { mock } from 'jest-mock-extended'
import { Logger } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { User } from './user.entity'
import { RoleService } from 'role/role.service'
import { Roles } from 'role/types/role.types'
import { Model } from 'mongoose'
import * as generator from 'generate-password'
import * as argon2 from 'argon2'
import { DocumentType } from '@typegoose/typegoose'
import { UserService } from './user.service'
import { Role } from 'role/role.entity'

const logger = mock<Logger>()
const userModel = mock<Model<User>>()
const roleService = mock<RoleService>()
const mockGenerator = jest.spyOn(generator, 'generate')
const mockArgon = jest.spyOn(argon2, 'hash')

describe('UserService', () => {
  let service: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: Logger, useValue: logger },
        { provide: getModelToken('User'), useValue: userModel },
        { provide: RoleService, useValue: roleService }
      ]
    }).compile()

    service = module.get<UserService>(UserService)
  })

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset the implementation to resolve for every test
    roleService.findOneByParam.mockResolvedValue({} as const as DocumentType<Role>)
    userModel.findOne.mockResolvedValue({ _id: 'founduser' } as unknown as null)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('FindOneByRole', () => {
    it('Should log the operation and role when its invoked', async () => {
      await service.findOneByRole(Roles.ADMIN)
      expect(logger.debug).toHaveBeenCalledWith(`Operation: findOneByRole. \n role: ${Roles.ADMIN}`)
    })

    it('Should return null if the role service cant find a role', async () => {
      roleService.findOneByParam.mockResolvedValue(null)
      await expect(service.findOneByRole(Roles.ADMIN))
        .resolves
        .toEqual(null)
    })

    it('Should return the user if the role and a user with that role were found', async () => {
      await expect(service.findOneByRole(Roles.ADMIN))
        .resolves
        .toMatchObject({ _id: 'founduser' })
    })

    it('Should attempt to look for the user if the role was found', async () => {
      await service.findOneByRole(Roles.ADMIN)
      expect(userModel.findOne).toHaveBeenCalled()
    })
  })

  describe('generateTemporaryPassword', () => {
    it('Should log a message to the console', () => {
      service.generateTemporaryPassword()
      expect(logger.debug).toHaveBeenCalledWith('Generating temporary password')
    })

    it('Should generate a password with the default configuration', () => {
      service.generateTemporaryPassword()
      expect(mockGenerator).toHaveBeenCalledWith({
        exclude: '',
        excludeSimilarCharacters: false,
        length: 30,
        lowercase: true,
        numbers: true,
        strict: true,
        symbols: true,
        uppercase: true
      })
    })

    it('Should return a password that is 30 characters long', () => {
      const value = service.generateTemporaryPassword()
      expect(value.length)
        .toBe(30)
    })
  })

  describe('hashPassword', () => {
    it('Should log a message to the console', async () => {
      await service.hashPassword('')
      expect(logger.debug).toHaveBeenCalledWith('Hashing temporary password')
    })

    it('Should invoke the hashing function from argon', async () => {
      await service.hashPassword('')
      expect(mockArgon).toHaveBeenCalledWith('', { type: argon2.argon2i })
    })
  })
})
