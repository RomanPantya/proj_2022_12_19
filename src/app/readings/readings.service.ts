import { PoolClient } from 'pg';
import { CreateReadingDto } from '../../dto/reading.dto/create-reading.dto';

export async function createReading(
    connection: PoolClient,
    reading: CreateReadingDto,
    // Omit<ReadingEntity, 'id' | 'count'>,
) {
    const paramsPg = ['$1', '$2'] as const;
    const mapper: Record<(typeof paramsPg)[number], keyof CreateReadingDto> = {
        $1: 'user_id',
        $2: 'post_id',
    };

    const { rows: [result] } = await connection.query(`
    insert into readings(
      user_id,
      post_id
    )
    values(
      $1,
      $2
    )
    returning *
    `, paramsPg.map((el) => reading[mapper[el]]));

    return result;

    // const entries = Object.entries(reading);
    // const dollars: string[] = [];

    // const { rows: [result] } = await connection.query(`
    // insert into readings(
    //   ${entries.map(([k], i) => {
    //     dollars.push(`$${i + 1}`);
    //     return `${k}`;
    // }).join(', ')}
    // )
    // values(
    //   ${dollars.join(', ')}
    //   )
    //   returning *
    // `, entries.map(([, v]) => v));

    // return result;
}
