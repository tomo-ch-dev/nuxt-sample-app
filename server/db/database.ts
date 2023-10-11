import { DataSource } from 'typeorm';
import { Users } from './entities/Users';
import { UserVerifications } from './entities/UserVerifications';
import { Sessions } from './entities/Sessions';
import dotenv from 'dotenv';
import logger from '../../logger';

const envPath = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envPath });

export const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Users, UserVerifications, Sessions],
  synchronize: false,
  migrations: ["./server/db/migrations/*.js"],
});

dataSource.initialize()
  .then(() => {
    logger.info("Data Sourceが初期化されました！");
  })
  .catch((err) => {
    logger.error("Data Sourceの初期化中にエラーが発生しました", err);
  });