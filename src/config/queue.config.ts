import { BullModule, BullModuleOptions, SharedBullConfigurationFactory } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { IEnv } from 'env.types'
import { URL } from 'url'

@Injectable()
class BullConfiguration implements SharedBullConfigurationFactory {
  constructor (
    private readonly configService: ConfigService<IEnv>
  ) {}

  createSharedConfiguration (): BullModuleOptions {
    const { hostname, port } = new URL(this.configService.get('REDIS_URL', ''))
    const password = this.configService.get('REDIS_PASSWORD', undefined)

    return {
      defaultJobOptions: {
        removeOnComplete: true,
        delay: 3000
      },
      redis: {
        host: hostname,
        port: Number(port),
        password
      }
    }
  }
}

export const BullConfig = BullModule.forRootAsync({
  useClass: BullConfiguration
})
