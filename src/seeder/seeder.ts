import { Inject, Injectable, Logger } from '@nestjs/common'
import { SeederService } from './seeder.service'

@Injectable()
export class Seeder {
  @Inject() logger: Logger
  @Inject() seederService: SeederService

  async seed (): Promise<void> {
    try {
      this.logger.debug('Started Seeding...')
      await this.seederService.seedAdmin()
    } catch (e) {
      this.logger.error('Seeding process failed')
    }
  }
}
