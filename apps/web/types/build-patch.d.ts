/**
 * node_modules typecheck patches
 */

declare module 'cookie' {
  type CookieSerializeOptions = any
}

declare module 'nodemailer/lib/smtp-transport' {
  type SMTPTransportOptions = any
  type Options = any
}
