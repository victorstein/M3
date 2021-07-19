import { ConfigModuleOptions } from '@nestjs/config'
import * as Joi from 'joi'

console.log(process.env)

export const envValidation: ConfigModuleOptions = {
  validationSchema: Joi.object({
    PORT: Joi.number()
      .default(3002),
    ADMIN_EMAIL: Joi.string()
      .email()
      .required(),
    JWT_SECRET: Joi.string()
      .min(30)
      .required(),
    REFRESH_JWT_SECRET: Joi.string()
      .min(30)
      .required(),
    JWT_EXP: Joi.string()
      .default('15m'),
    REFRESH_JWT_EXP: Joi.string()
      .default('1d'),
    DB_URL: Joi.string()
      .uri()
      .required(),
    DOMAIN_URL: Joi.string()
      .uri()
      .default('http://localhost'),
    QUERY_COMPLEXITY_LIMIT: Joi.number()
      .default(20),
    RATE_LIMIT_BAN_EXP: Joi.string()
      .default('1h'),
    EMAIL_HOST: Joi.string()
      .domain()
      .default('smtp.gmail.com'),
    EMAIL_TLS_PORT: Joi.number()
      .default(587),
    EMAIL_SSL_PORT: Joi.number()
      .default(465),
    EMAIL_USER: Joi.string()
      .email()
      .required(),
    EMAIL_PASS: Joi.string()
      .required(),
    EMAIL_VERIFICATION_EXP: Joi.string()
      .default('1w'),
    EMAIL_PASSWORD_REQUEST_EXP: Joi.string()
      .default('1d'),
    EMAIL_SECRET: Joi.string()
      .min(30),
    ALLOWED_ORIGINS: Joi.string()
      .default('*'),
    SENTRY_DSN: Joi.string()
      .uri(),
    SENTRY_SERVER_NAME: Joi.string()
      .alphanum(),
    LOG_LEVEL: Joi.any()
      .allow('log', 'error', 'warn', 'debug', 'verbose')
      .default('verbose'),
  }),
  validationOptions: {
    allowUnknown: false,
    abortEarly: true
  }
}