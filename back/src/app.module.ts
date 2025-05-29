// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { EmittersModule } from './emitters/emitters.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { FinancialDataModule } from './financial-data/financial-data.module';
import { AnaliticsModule } from './analitics/analitics.module';
import { InvestorsModule } from './investors/investors.module';
import { PublicEmittersModule } from './public-emitters/public-emitters.module';
import { SubscribesModule } from './subscribes/subscribes.module';
import { PaymentsModule } from './payments/payments.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbTypeFromEnv = configService.get<string>('DB_TYPE');
        const dbHost = configService.get<string>('DB_HOST');
        const dbPortString = configService.get<string>('DB_PORT');
        const dbUsername = configService.get<string>('DB_USERNAME');
        const dbPassword = configService.get<string>('DB_PASSWORD');
        const dbDatabase = configService.get<string>('DB_DATABASE');

        if (!dbTypeFromEnv || dbTypeFromEnv.toLowerCase() !== 'postgres') {
          throw new Error(
            "DB_TYPE environment variable must be set to 'postgres'",
          );
        }
        const dbType = 'postgres' as const;

        if (!dbHost) {
          throw new Error('DB_HOST is not defined in environment variables');
        }
        if (!dbPortString) {
          throw new Error('DB_PORT is not defined in environment variables');
        }
        if (!dbUsername) {
          throw new Error(
            'DB_USERNAME is not defined in environment variables',
          );
        }
        if (!dbDatabase) {
          throw new Error(
            'DB_DATABASE is not defined in environment variables',
          );
        }

        return {
          type: dbType,
          host: dbHost,
          port: parseInt(dbPortString, 10),
          username: dbUsername,
          password: dbPassword,
          database: dbDatabase,
          entities: [join(__dirname, '**', '*.entity.{js,ts}')],
          migrations: [join(__dirname, 'migrations', '**', '*.{js,ts}')],
          migrationsTableName: 'typeorm_migrations',
          synchronize: false,
          logging: true,
        };
      },
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST') || 'localhost',
        port: parseInt(configService.get<string>('REDIS_PORT') || '6379', 10),
        ttl: 300,
        // password: configService.get<string>('REDIS_PASSWORD'), // <-- УБЕДИСЬ, ЧТО ЭТО ЗАКОММЕНТИРОВАНО, ЕСЛИ НЕТ ПАРОЛЯ
      }),
      inject: [ConfigService],
      isGlobal: true,
    }),
    EmittersModule,
    AdminModule,
    AuthModule,
    FinancialDataModule,
    AnaliticsModule,
    InvestorsModule,
    PublicEmittersModule,
    SubscribesModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
