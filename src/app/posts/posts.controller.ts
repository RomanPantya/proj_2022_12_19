/* eslint-disable no-nested-ternary */
import { Router } from 'express';
import {
    createPost, getPostById,
    getPostsByUserId, getAllPosts, updatePost,
} from './posts.service';

const router = Router();

router.post('/', async (req, res) => {
    const post = req.body;
    const result = await createPost(req.db, post);

    res.json({
        message: 'This post was create',
        data: result,
    });
});

router.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    const result = await getPostsByUserId(req.db, id);

    res.json(result.length
        ? result.length > 1
            ? {
                message: `Thats all posts with user_id: ${id}`,
                data: result,
            }
            : {
                message: `Only one post with user_id: ${id}`,
                data: result[0],
            }
        : `Do not have posts with user_id: ${id}`);
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const result = await getPostById(req.db, id);

    res.json(result
        ? {
            message: `This post with id: ${id}`,
            data: result,
        }
        : `Do not have post with id: ${id}`);
});

router.get('/', async (req, res) => {
    const { limit = '10', skip = '0' } = req.query as {
      limit?: string,
      skip?: string,
    };

    // const { limit = 10, skip = 0 } = req.query;
    // const result = await getAllPosts(req.db, limit as string, skip as string);
    const result = await getAllPosts(req.db, limit, skip);

    res.json(result.length
        ? result.length > 1
            ? {
                message: 'Thats all posts in this database',
                data: result,
            }
            : {
                message: 'Only one post in this database',
                data: result[0],
            }
        : 'Do not have posts in this database');
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const correctData = Object.entries(req.body)
        .filter(([k]) => ['title', 'summary'].includes(k));

    if (!correctData.length) {
        res.json('You must put correct data to update');
        return;
    }

    const changeData = Object.fromEntries(correctData);
    const result = await updatePost(req.db, id, changeData);

    res.json(result
        ? {
            message:
            'This post was update',
            data: result,
        }
        : `Do not have post with id: ${id}`);
});

export const postsController = router;
