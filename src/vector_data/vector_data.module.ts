import { Module } from '@nestjs/common';
import { VectorDataService } from './vector_data.service';
import { VectorDataController } from './vector_data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VectorData } from './entities/vector_data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VectorData])],
  controllers: [VectorDataController],
  providers: [VectorDataService],
})
export class VectorDataModule {}
