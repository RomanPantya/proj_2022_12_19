import { OmitType } from '@nestjs/mapped-types';
import { FullReadingDto } from './full-reading.dto';

export class CreateReadingDto extends OmitType(FullReadingDto, ['id', 'count']) {}
