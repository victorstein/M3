import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { Seeder } from './seeder/seeder'
import { SeederModule } from './seeder/seeder.module'

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(SeederModule)

  const logger = app.get(Logger)
  const seeder = app.get(Seeder)

  await seeder.seed()
  logger.verbose('Done seeding the DB')
  app.close()
    .catch(e => { throw new Error(e) })
}

bootstrap()
  .catch(e => console.log(e))
