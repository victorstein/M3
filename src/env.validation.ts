import { ConfigModule } from '@nestjs/config'
import { plainToClass } from 'class-transformer'
import { IsDefined, IsEmail, IsFQDN, IsIn, IsNumber, IsOptional, IsString, IsUrl, Min, MinLength, validateSync } from 'class-validator'

export class EnvironmentVariables {
  // GENERAL VARIABLES
  @IsNumber() PORT: number = 3002
  @IsDefined() @IsEmail() ADMIN_EMAIL: string
  @IsUrl({ require_tld: false }) DOMAIN_URL: string = 'http://localhost'
  @IsNumber() @Min(0) QUERY_COMPLEXITY_LIMIT: number = 20
  @IsString() ALLOWED_ORIGINS: string = '*'
  @IsIn(['log', 'error', 'warn', 'debug', 'verbose']) LOG_LEVEL: string = 'verbose'
  // EXPIRATION VARIABLES
  @IsString() JWT_EXP: string = '15m'
  @IsString() REFRESH_JWT_EXP: string = '1d'
  @IsString() RATE_LIMIT_BAN_EXP: string = '5h'
  @IsString() EMAIL_VERIFICATION_EXP: string = '1w'
  @IsString() EMAIL_PASSWORD_REQUEST_EXP: string = '1d'
  // SECRETS
  @IsDefined() @IsString() @MinLength(30) JWT_SECRET: string
  @IsDefined() @IsString() @MinLength(30) REFRESH_JWT_SECRET: string
  @IsDefined() @IsString() @MinLength(30) EMAIL_SECRET: string
  // EMAIL VARIABLES
  @IsString() @IsFQDN() EMAIL_HOST: string = 'smtp.gmail.com'
  @IsNumber() EMAIL_TLS_PORT: number = 587
  @IsNumber() EMAIL_SSL_PORT: number = 465
  @IsDefined() @IsEmail() EMAIL_USER: string
  @IsDefined() @IsString() EMAIL_PASS: string
  // DB_VARIABLES
  @IsUrl({ require_valid_protocol: false }) DB_URL: string
  // SENTRY
  @IsOptional()	@IsUrl() SENTRY_DSN: string
  @IsOptional()	@IsString() SENTRY_SERVER_NAME: string
}

export function validateEnv (config: Record<string, unknown>) {
  const validateConfig = plainToClass(
    EnvironmentVariables,
    config,
    { enableImplicitConversion: true }
  )

  const errors = validateSync(
    validateConfig,
    {
      skipMissingProperties: false,
      stopAtFirstError: true,
      forbidUnknownValues: true 
    }
  )

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }

  return validateConfig
}

export const envValidation = ConfigModule.forRoot({
  validate: validateEnv
})