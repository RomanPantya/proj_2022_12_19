/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import { Router } from 'express';
import {
    createReading, updateReadings,
    removeOneReading, removeReadingsByUser,
    removeReadingsByPost,
} from './readings.service';

const router = Router();

router.post('/', async (req, res) => {
    const reading = req.body;
    const result = await createReading(req.db, reading);

    res.json({
        message: 'This reading was create',
        data: result,
    });
});

router.put('/', async (req, res) => {
    const { count } = req.body;
    const { user_id, post_id } = req.query as {
      user_id: string,
      post_id: string,
    };
    if (!user_id || !post_id) {
        res.json('Please change your query to correct form');
        return;
    }

    if (!count || count < 2) {
        res.json('You must put correct data in count');
        return;
    }

    const result = await updateReadings(req.db, count, user_id, post_id);

    res.json(result === null
        ? `User with id: ${user_id} did not read post with id: ${post_id}`
        : typeof result !== 'string'
            ? {
                message: 'This reading was update',
                data: result,
            }
            : result);
});

router.delete('/user/:id', async (req, res) => {
    const { id } = req.params;
    const result = await removeReadingsByUser(req.db, id);

    res.json(result.length
        ? {
            message: 'Thats readings was delete',
            data: result,
        }
        : `Do not have readings with user_id: ${id}`);
});

router.delete('/post/:id', async (req, res) => {
    const { id } = req.params;
    const result = await removeReadingsByPost(req.db, id);

    res.json(result.length
        ? {
            message: 'Thats readings was delete',
            data: result,
        }
        : `Do not have readings with post_id: ${id}`);
});

router.delete('/', async (req, res) => {
    const reading = req.body;

    const result = await removeOneReading(req.db, reading);

    res.json(result
        ? {
            message: 'Thats reading was delete',
            data: result,
        }
        : `Do not have reading with this data`);
});

export const readingsController = router;
