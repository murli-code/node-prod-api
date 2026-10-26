import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit, OnApplicationShutdown {
  constructor(private readonly dataSource: DataSource) {}

  onModuleInit() {
    if (this.dataSource.isInitialized) {
      console.log('✅ Database connected successfully');
    }
  }

  async onApplicationShutdown(signal?: string) {
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();
      console.log(
        '🛑 Database connection closed due to app shutdown',
        signal ? `(${signal})` : '',
      );
    }
  }
}
