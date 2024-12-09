import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScraperModule } from './scraper/scraper.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VectorDataModule } from './vector_data/vector_data.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'web-scrapper',
      autoLoadEntities: true, // Automatically load entities
      synchronize: true, // Use only for development
    }),
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
    }),
    ScraperModule,
    VectorDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
