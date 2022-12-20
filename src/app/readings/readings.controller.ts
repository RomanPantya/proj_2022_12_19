import { Router } from 'express';
import { createReading } from './readings.service';

const router = Router();

router.post('/', async (req, res) => {
    const reading = req.body;
    const result = await createReading(req.db, reading);

    res.json({
        message: 'This reading was create',
        data: result,
    });
});

export const readingsController = router;
