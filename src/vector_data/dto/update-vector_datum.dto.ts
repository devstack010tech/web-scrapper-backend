import { PartialType } from '@nestjs/mapped-types';
import { CreateVectorDataDto } from './create-vector_datum.dto';

export class UpdateVectorDataDto extends PartialType(CreateVectorDataDto) {}
