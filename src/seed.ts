import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { Seeder } from './seeder/seeder'
import { SeederModule } from './seeder/seeder.module'

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(SeederModule)

  const logger = app.get(Logger)
  const seeder = app.get(Seeder)

  await seeder.seed()
  logger.debug('Done seeding the DB')
}

bootstrap()
  .then(() => process.exit())
  .catch(e => console.error(e))
