import { Module } from '@nestjs/common';
import { ScraperController } from './scraper.controller';
import { ScraperService } from './scraper.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VectorData } from 'src/vector_data/entities/vector_data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VectorData])],
  controllers: [ScraperController], // Register the controller
  providers: [ScraperService], // Register the service
})
export class ScraperModule {}
