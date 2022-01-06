import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthTypes } from 'auth/auth.types'
import { IEnv } from 'env.types'
import { EmailProducer } from 'queue/email/email.producer'
import { RoleService } from 'role/role.service'
import { Roles } from 'role/types/role.types'
import { UserService } from 'user/user.service'

@Injectable()
export class SeederService {
  constructor (
    private readonly roleService: RoleService,
    private readonly userService: UserService,
    private readonly logger: Logger,
    private readonly configService: ConfigService<IEnv>,
    private readonly emailProducer: EmailProducer
  ) {}

  async seedRoles (): Promise<void> {
    for (const role of Object.values(Roles)) {
      const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1)
      await this.roleService.upsertByParam(
        { name: role },
        {
          description: `${capitalizedRole} role`,
          name: role,
          type: role
        }
      )
    }
  }

  async seedAdmin (): Promise<void> {
    try {
      const ADMIN_EMAIL = this.configService.get('ADMIN_EMAIL')

      this.logger.debug('Looking for admin user')
      const admin = await this.userService.findOneByRole(Roles.ADMIN)

      if (admin === null) {
        this.logger.debug('Admin user was not found.')

        this.logger.debug('Check if admin email on .env')
        if (ADMIN_EMAIL === null) throw new Error('Database seed error. ADMIN_EMAIL not set in .env file.')

        this.logger.debug('Checking if ADMIN role exists...')
        let adminRole = await this.roleService.findOneByParam({ name: Roles.ADMIN })

        if (adminRole === null) {
          this.logger.debug('Admin role not found. Creating Base roles...')
          await this.seedRoles()
        }

        adminRole = await this.roleService.findOneByParam({ name: Roles.ADMIN })

        const password = this.userService.generateTemporaryPassword()
        const hashedPassword = await this.userService.hashPassword(password)

        this.logger.debug('Add user to DB')
        const user = await this.userService.create({
          firstName: 'Admin',
          lastName: 'Admin',
          email: ADMIN_EMAIL,
          password: hashedPassword,
          role: adminRole?._id,
          emailVerified: true,
          signupType: AuthTypes.EMAIL_AND_PASSWORD
        })

        await this.emailProducer.resetPasswordEmail(user.id)
        return
      }

      this.logger.debug('There\'s an existing admin user in the DB. New admin not created.')
    } catch (e) {
      this.logger.error(`There was an error seeding the DB: ${e.message as string}`)
      throw new Error(e.message)
    }
  }
}
