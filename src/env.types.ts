export enum Environments {
  TEST = 'test',
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production'
}

export enum LogLevels {
  LOG = 'log',
  ERROR = 'error',
  WARN = 'warn',
  DEBUG = 'debug',
  VERBOSE = 'verbose'
}
export interface IEnv {
  NODE_ENV: Environments
  PORT: number
  ADMIN_EMAIL: string
  JWT_SECRET: string
  REFRESH_JWT_SECRET: string
  MOBILE_JWT_SECRET: string
  JWT_EXP: string
  REFRESH_JWT_EXP: string
  MOBILE_JWT_EXP: string
  DB_URL: string
  DOMAIN_URL: string
  QUERY_COMPLEXITY_LIMIT: number
  RATE_LIMIT_BAN_EXP: string
  EMAIL_HOST: string
  EMAIL_TLS_PORT: number
  EMAIL_SSL_PORT: number
  EMAIL_USER: string
  EMAIL_PASS: string
  EMAIL_VERIFICATION_EXP: string
  EMAIL_PASSWORD_REQUEST_EXP: string
  EMAIL_SECRET: string
  ALLOWED_ORIGINS: string
  SENTRY_DSN: string
  SENTRY_SERVER_NAME: string
  LOG_LEVEL: LogLevels
  GOOGLE_JWK_URI: string
  FACEBOOK_GRAPH_URI: string
  REDIS_URL: string
  REDIS_PASSWORD: string
  REDIS_USERNAME: string
}
