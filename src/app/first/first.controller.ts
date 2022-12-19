import { Router } from 'express';
import { getHello } from './first.service';

const router = Router();

router.get('/', (req, res) => {
    const result = getHello();
    res.json(result);
});

export const firstController = router;
