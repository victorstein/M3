import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GqlModuleOptions, GqlOptionsFactory, GraphQLModule } from '@nestjs/graphql'
import { IContext } from 'app.types'
import { join } from 'path'
import { Environments, IEnv } from '../env.types'

@Injectable()
class GraphQLConfiguration implements GqlOptionsFactory {
  @Inject() configService: ConfigService<IEnv>

  createGqlOptions (): GqlModuleOptions {
    const ENV = this.configService.get('NODE_ENV')

    return {
      debug: ENV !== Environments.PRODUCTION,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: ENV !== Environments.PRODUCTION,
      context: ({ req, res }: IContext) => {
        return { req, res }
      }
    }
  }
}

export const GraphqlConfig = GraphQLModule.forRootAsync({
  useClass: GraphQLConfiguration
})
