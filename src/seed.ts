import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Seeder } from './seeder/seeder';
import { SeederModule } from './seeder/seeder.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(SeederModule);

    const logger = app.get(Logger)
    const seeder = app.get(Seeder)

    await seeder.seed()
    logger.verbose('Done seeding the DB')
    app.close()  
  } catch (error) {
    throw error
  }
}
bootstrap();
