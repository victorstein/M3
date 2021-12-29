import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { IEnv } from 'env.types'
import { RoleService } from 'role/role.service'
import { Roles } from 'role/types/role.types'
import { UserService } from 'user/user.service'

@Injectable()
export class SeederService {
  @Inject() roleService: RoleService
  @Inject() userService: UserService
  @Inject() logger: Logger
  @Inject() configService: ConfigService<IEnv>

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

      this.logger.verbose('Looking for admin user')
      const admin = await this.userService.findOneByRole(Roles.ADMIN)

      if (admin === null) {
        this.logger.verbose('Admin user was not found.')

        this.logger.verbose('Check if admin email on .env')
        if (ADMIN_EMAIL === null) throw new Error('Database seed error. ADMIN_EMAIL not set in .env file.')

        this.logger.verbose('Checking if ADMIN role exists...')
        let adminRole = await this.roleService.findOneByParam({ name: Roles.ADMIN })

        if (adminRole === null) {
          this.logger.verbose('Admin role not found. Creating Base roles...')
          await this.seedRoles()
        }

        adminRole = await this.roleService.findOneByParam({ name: Roles.ADMIN })

        const password = this.userService.generateTemporaryPassword()
        const hashedPassword = await this.userService.hashPassword(password)

        this.logger.verbose('Add user to DB')
        await this.userService.create({
          firstName: 'admin',
          lastName: 'admin',
          email: ADMIN_EMAIL,
          password: hashedPassword,
          role: adminRole?._id,
          emailVerified: true
        })

        // await this.emailService.sendResetPasswordEmail(admin)
        return
      }

      this.logger.verbose('There\'s an existing admin user in the DB. New admin not created.')
    } catch (e) {
      this.logger.error(`There was an error seeding the DB: ${e.message as string}`)
      throw new Error(e.message)
    }
  }
}
