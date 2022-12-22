import { PoolClient } from 'pg';
import { CreateUserDto } from '../../dto/user.dto/create-user.dto';
import { UpdateUserDto } from '../../dto/user.dto/update-user.dto';

export async function createUser(
    connection: PoolClient,
    user: CreateUserDto,
    // Omit<UserEntity, 'id'>,
) {
    const pgParams = ['$1', '$2', '$3', '$4'] as const;
    const mapper: Record<(typeof pgParams)[number], keyof CreateUserDto> = {
        $1: 'name',
        $2: 'email',
        $3: 'age',
        $4: 'is_single',
    };

    const { rows: [result] } = await connection.query(`
    insert into users(
        name,
        email,
        age,
        is_single
    )
    values(
        $1,
        $2,
        $3,
        $4
    )
    returning *
    `, pgParams.map(($) => user[mapper[$]]));

    return result;
}

export async function getUserById(
    connection: PoolClient,
    id: string,
) {
    const { rows: [result] } = await connection.query(`
    select *
    from users
    where id = $1
    `, [id]);

    return result || null;
}

export async function getAllUsers(
    connection: PoolClient,
    limit: string,
    skip: string,
) {
    const { rows } = await connection.query(`
    select *
    from users
    limit $1
    offset $2
    `, [limit, skip]);

    return rows;
}

export async function updateUser(
    connection: PoolClient,
    id: string,
    changeData: UpdateUserDto,
    // Partial<Omit<UserEntity, 'id' | 'email'>>,
) {
    const entries = Object.entries(changeData);
    entries.push(['id', id]);

    const {rows: [user]} = await connection.query(`
    update users
    set
    ${entries.slice(0, -1).map(([k], i) => {
        const dollar = `$${i + 1}`;
        return `${k} = ${dollar}`;
    }).join(', ')}
    where id = $${entries.length}
    returning *
    `, entries.map(([, v]) => v));

    return user || null;
    // const { rows: user } = await connection.query(`
    // select name, age, is_single
    // from users
    // where id = $1
    // `, [id]);

    // if (!user.length) {
    //     return null;
    // }

    // const { name = user[0].name, age = user[0].age, is_single = user[0].is_single } = changeData;

    // const { rows: [result] } = await connection.query(`
    // update users
    // set
    // name = $1,
    // age = $2,
    // is_single = $3
    // where id = $4
    // returning *
    // `, [name, age, is_single, id]);

    // return result;
}
