import { DataSource, DataSourceOptions } from 'typeorm'
import { config } from 'dotenv'
import { User } from 'src/modules/user/user.entity'

config()

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User],
  migrations: ['dist/database/migrations/*.js'],
}

const AppDataSource = new DataSource(dataSourceOptions)

export default AppDataSource
