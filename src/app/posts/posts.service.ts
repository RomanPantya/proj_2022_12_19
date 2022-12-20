import { PoolClient } from 'pg';
import { CreatePostDto } from '../../dto/post.dto/create-post.dto';

export async function createPost(
    connection: PoolClient,
    post: CreatePostDto,
    // Omit<PostEntity, 'id'>,
) {
    const entries = Object.entries(post);
    const dollars = [] as string[];

    const { rows: [result] } = await connection.query(`
    insert into posts(
      ${entries.map(([k], i) => {
        dollars.push(`$${i + 1}`);
        return `${k}`;
    }).join(', ')}
    )
    values(
      ${dollars.join(', ')}
    )
    returning *
    `, entries.map(([, v]) => v));

    return result;
}

export async function getPostById(
    connection: PoolClient,
    id: string,
) {
    const { rows: [result] } = await connection.query(`
    select *
    from posts
    where id = $1
    `, [id]);

    return result || null;
}

export async function getPostsByUserId(
    connection: PoolClient,
    id: string,
) {
    const { rows } = await connection.query(`
    select *
    from posts
    where user_id = $1
    `, [id]);

    return rows;
}

export async function getAllPosts(
    connection: PoolClient,
    limit: string,
    skip: string,
) {
    const { rows } = await connection.query(`
    select *
    from posts
    limit $1
    offset $2
    `, [limit, skip]);

    return rows;
}
