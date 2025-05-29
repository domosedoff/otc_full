// backend/src/data-source.ts
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Загружаем переменные окружения из .env файла
// Это необходимо, так как CLI запускается вне контекста NestJS приложения,
// где ConfigModule обычно делает это автоматически.
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: (process.env.DB_TYPE || 'postgres') as 'postgres', // Приводим к конкретному типу для CLI
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')], // Путь к сущностям (CLI будет искать .ts)
  // __dirname здесь будет указывать на src, так как ts-node выполняет этот файл из src
  migrations: [join(__dirname, 'migrations', '**', '*.{ts,js}')], // Путь к миграциям (CLI будет искать/создавать .ts)
  migrationsTableName: 'typeorm_migrations', // То же имя, что и в AppModule
  synchronize: false, // Всегда false при использовании миграций
  logging: true, // Можно установить в true для отладки CLI команд
};

// Проверка обязательных переменных окружения для CLI
if (!dataSourceOptions.host) {
  throw new Error('DB_HOST is not defined in environment variables for CLI');
}
if (!dataSourceOptions.port) {
  // parseInt вернет NaN если DB_PORT не число
  throw new Error(
    'DB_PORT is not defined or invalid in environment variables for CLI',
  );
}
if (!dataSourceOptions.username) {
  throw new Error(
    'DB_USERNAME is not defined in environment variables for CLI',
  );
}
if (!dataSourceOptions.database) {
  throw new Error(
    'DB_DATABASE is not defined in environment variables for CLI',
  );
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
