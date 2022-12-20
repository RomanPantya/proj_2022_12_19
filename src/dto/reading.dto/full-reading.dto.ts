import { IReading } from '../../entities/reading/reading.interface';

export class FullReadingDto implements IReading {
    id!: number;

    user_id!: number;

    post_id!: number;

    count!: number;
}
