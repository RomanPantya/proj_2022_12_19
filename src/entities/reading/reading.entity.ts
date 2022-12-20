import { IReading } from './reading.interface';

export class ReadingEntity implements IReading {
    id!: number;

    user_id!: number;

    post_id!: number;

    count!: number;
}
