import { IReading } from './reading.interface';

export class ReadingEntity implements IReading {
    id!: number;

    id_user!: number;

    id_post!: number;
}
