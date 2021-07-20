import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule, MongooseModuleOptions, MongooseOptionsFactory } from "@nestjs/mongoose";
import { IEnv } from "./types/env.types";

@Injectable()
class MongooseConfigService implements MongooseOptionsFactory {
  @Inject()
  private readonly configService: ConfigService

  createMongooseOptions(): MongooseModuleOptions {
    const DB_URL = this.configService.get<IEnv['DB_URL']>('DB_URL')
    const ENV = this.configService.get<IEnv['NODE_ENV']>('NODE_ENV')

    return {
      uri: DB_URL,
      useNewUrlParser: true,
      dbName: ENV === 'test' ? 'test' : 'm2',
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    };
  }
}

export const dbConnection = MongooseModule.forRootAsync({
  useClass: MongooseConfigService
})