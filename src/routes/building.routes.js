import { Router } from 'express';
import Building from '../../models/building.model.js';

const router = Router();

router.get('/', async (req, res) => {
    const buildings = await Building.find().catch(err => {
        return res.status(500).json({ error: true, message: 'Failed to get buildings' });
    });

    return res.status(200).json({ error: false, data: buildings });
});

router.post('/', async (req, res) => {
    const { address, name, notes } = req.body;
    
    if (!address) {
        return res.status(400).json({ error: true, message: 'Address is required' });
    }

    let data = { address };
    if (name) {
        data.name = name;
    }
    if(notes) {
        data.notes = notes;
    }
    
    const building = await Building.create(data).catch(err => {
        return res.status(500).json({ error: true, message: 'Failed to create building' });
    });
    
    return res.status(201).json({ error: false, data: building });
});

router.patch('/:id', async (req, res) => {
    const { address, name } = req.body;
    const { id } = req.params;
    
    if (!address) {
        return res.status(400).json({ error: true, message: 'Address is required' });
    }
    let data = { address };
    if (name) {
        data.name = name;
    }

    
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    const building = await Building.findByIdAndDelete(id).catch(err => {
        return res.status(500).json({ error: true, message: 'Failed to delete building' });
    });
    
});

router.post('/:id/code', async (req, res) => {
    const { id } = req.params;
    const { code, notes } = req.body;
    
    if (!code || !notes) {
        return res.status(400).json({ error: true, message: 'Code and notes are required' });
    }
    
});

router.patch('/:id/code/:codeId', async (req, res) => {
    const { id, codeId } = req.params;
    const { code, notes } = req.body;
    
    if (!code || !notes) {
        return res.status(400).json({ error: true, message: 'Code and notes are required' });
    }
    
});

router.delete('/:id/code/:codeId', async (req, res) => {
    const { id, codeId } = req.params;
    
    const building = await Building.findByIdAndUpdate(id, { $pull: { access_codes: { _id: codeId } } }).catch(err => {
        return res.status(500).json({ error: true, message: 'Failed to delete code' });
    });
    
});

export default router;