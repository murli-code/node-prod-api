//src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['env/.env', '.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('POSTGRES_HOST');
        const username = configService.get<string>('POSTGRES_USER');
        const password = configService.get<string>('POSTGRES_PASSWORD');
        const database = configService.get<string>('POSTGRES_DB');
        const portValue = configService.get<string>('POSTGRES_PORT');
        const port = Number(portValue ?? 5432);

        if (
          !host ||
          !username ||
          !password ||
          !database ||
          Number.isNaN(port)
        ) {
          throw new Error(
            'Invalid database config. Ensure POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, and POSTGRES_DB are set.',
          );
        }

        return {
          type: 'postgres' as const,
          host,
          port,
          username,
          password,
          database,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          autoLoadEntities: true,
          synchronize: true, // Be cautious about using synchronize in production
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}
