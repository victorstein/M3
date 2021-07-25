import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlModuleOptions, GqlOptionsFactory, GraphQLModule } from "@nestjs/graphql";
import { Request, Response } from "express";
import { join } from "path";
import { Environments, IEnv } from "./env.types";

@Injectable()
class GraphQLConfig implements GqlOptionsFactory {
  @Inject() configService: ConfigService

  createGqlOptions(): GqlModuleOptions {
    const ENV = this.configService.get<IEnv['NODE_ENV']>('NODE_ENV')

    return {
      debug: ENV !== Environments.PRODUCTION,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: ENV !== Environments.PRODUCTION,
      context: ({ req, res }: Request & Response) => {
        return { req, res }
      }
    }
  }
}

export const graphqlConfig = GraphQLModule.forRootAsync({
  useClass: GraphQLConfig
})