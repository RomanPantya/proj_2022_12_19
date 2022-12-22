import { Router } from 'express';
import { createUser, getUserById,
    getAllUsers, updateUser, removeUser, } from './users.service';

const router = Router();

router.post('/', async (req, res) => {
    const user = req.body;
    const result = await createUser(req.db, user);

    res.json({
        message: 'this user was create',
        data: result,
    });
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const result = await getUserById(req.db, id);

    res.json(result
        ? {
            message: `Thats is user with id: ${id}`,
            data: result,
        }
        : `Do not have user with id: ${id}`);
});

router.get('/', async (req, res) => {
    const { limit = '10', skip = '0' } = req.query as {
        limit?: string,
        skip?: string,
    };
    // const { limit = 10, skip = 0 } = req.query;
    // const result = await getAllUsers(req.db, limit as string, skip as string);

    const result = await getAllUsers(req.db, limit, skip);

    res.json(result.length
        ? {
            message: 'Thats all users in database',
            data: result,
        }
        : 'Do not have users in this database');
});

router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const changeData = Object.entries(req.body)
    .filter(([k]) => ['name', 'age', 'is_single'].includes(k));

    if(!changeData.length) {
        res.json('You must put correct data to update user!');
        return;
    }
    const correctData = Object.fromEntries(changeData);
    const result = await updateUser(req.db, id, correctData);

    res.json(result
        ? {
            message: 'This user was update',
            data: result,
        }
        : `Do not have user with id: ${id}`);       
});

router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    const result = await removeUser(req.db, id);

    res.json(result
        ? {
            message: `User with id: '${id}' was delete`,
            data: result,
        }
        : `Do not have user with id: '${id}' in this database`);
});

export const usersController = router;
