import dotenv from 'dotenv';
import { AppConfig } from './types/global';

dotenv.config();

const appConfig: AppConfig = {
  port: Number(process.env.PORT) || 3000,
  databasePath: process.env.DATABASE_PATH || './db.sqlite3',
};

export default appConfig;
