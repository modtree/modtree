import 'dotenv/config'

export const config = {
  password: process.env.MYSQL_PASSWORD,
  username: process.env.MYSQL_USERNAME,
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_ACTIVE_DATABASE,
  server_ca: process.env.MYSQL_SERVER_CA,
  client_cert: process.env.MYSQL_CLIENT_CERT,
  client_key: process.env.MYSQL_CLIENT_KEY,
}
