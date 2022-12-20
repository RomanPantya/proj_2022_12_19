import { PickType } from '@nestjs/mapped-types';
import { FullReadingDto } from './full-reading.dto';

export class UpdateReadingDto extends PickType(FullReadingDto, ['count']) {}
