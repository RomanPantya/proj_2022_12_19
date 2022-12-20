/* eslint-disable camelcase */
import { PoolClient } from 'pg';
import { CreateReadingDto } from '../../dto/reading.dto/create-reading.dto';
import { UpdateReadingDto } from '../../dto/reading.dto/update-reading.dto';

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

export async function updateReadings(
    connection: PoolClient,
    count: UpdateReadingDto,
    // Pick(FullReadingDto, 'count'),
    user_id: string,
    post_id: string,
) {
    const { rows: [{ count: preCount }] } = await connection.query(`
    select count 
    from readings
    where user_id = $1 and post_id = $2
    `, [user_id, post_id]);

    console.info(preCount);
    if (!preCount) {
        return null;
    }

    if (preCount >= count) {
        const problem = 'You must put correct number in count';
        return problem;
    }

    const { rows: [result] } = await connection.query(`
    update readings
    set 
    count = $1
    where user_id = $2 and post_id = $3
    returning *
    `, [count, user_id, post_id]);

    return result || null;
}

export async function removeOneReading(
    connection: PoolClient,
    reading: {
        user_id: string,
        post_id: string,
    },
) {
    const { user_id, post_id } = reading;
    const { rows: [result] } = await connection.query(`
    delete from readings
    where user_id = $1 and post_id = $2
    returning *
    `, [user_id, post_id]);

    return result || null;
}

export async function removeReadingByUser(
    connection: PoolClient,
    id: string,
) {
    const { rows } = await connection.query(`
    delete from readings
    where user_id = $1
    returning *
    `, [id]);

    return rows;
}