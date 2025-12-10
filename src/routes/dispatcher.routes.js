import { Router } from 'express';
import Dispatcher from '../../models/dispatcher.model.js';

const router = Router();

router.get('/', async (req, res) => {

    if (req.query.id) {
        const dispatcher = await Dispatcher.findById(req.query.id).catch(err => {
            return res.status(500).json({ error: true, message: 'Failed to get dispatcher' });
        });

        return res.status(200).json({ error: false, data: dispatcher });
    } else {
        const dispatchers = await Dispatcher.find().catch(err => {
            return res.status(500).json({ error: true, message: 'Failed to get dispatchers' });
        });

        return res.status(200).json({ error: false, data: dispatchers });
    }

});

router.post('/', async (req, res) => {
    const { name, pin } = req.body;

    if (!name || !pin) {
        return res.status(400).json({ error: true, message: 'Name and pin are required' });
    }
    
    const dispatcher = await Dispatcher.create({ name, pin }).catch(err => {
        return res.status(500).json({ error: true, message: 'Failed to create dispatcher' });
    });

    return res.status(201).json({ error: false, data: dispatcher });
});

router.patch('/:id', async (req, res) => {
    const { name, pin } = req.body;
    const { id } = req.params;
    
    if (!name || !pin) {
        return res.status(400).json({ error: true, message: 'Name and pin are required' });
    }
    
});

export default router;