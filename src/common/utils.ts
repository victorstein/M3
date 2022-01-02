import { Request } from 'express'
import * as userAgent from 'express-useragent'

export const isMobile = (req: Request): boolean => {
  const ua = userAgent.parse(req.headers['user-agent'] ?? '')

  // Determine if the user is on mobile or desktop
  const isMobile = ua.isMobile
  const isNotBrowser = ua.browser === 'unknown'

  return isMobile && isNotBrowser
}
