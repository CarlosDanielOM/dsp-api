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
    const { address, name, notes, access_codes, locker_codes } = req.body;
    
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
    if(access_codes) {
        data.access_codes = access_codes;
    }
    if(locker_codes) {
        data.locker_codes = locker_codes;
    }
    
    const building = await Building.create(data).catch(err => {
        return res.status(500).json({ error: true, message: 'Failed to create building' });
    });
    
    return res.status(201).json({ error: false, data: building });
});

router.patch('/:id', async (req, res) => {
    const body = req.body;
    const { id } = req.params;
    
    if(!body.access_codes && !body.locker_codes) {
        const building = await Building.findByIdAndUpdate(id, { ...body }, { new: true }).catch(err => {
            return res.status(500).json({ error: true, message: 'Failed to update building' });
        });

        return res.status(200).json({ error: false, data: building });
    }

    let building = await Building.findById(id).catch(err => {
        return res.status(500).json({ error: true, message: 'Failed to get building' });
    });

    if(body.address) building.address = body.address;
    if(body.name) building.name = body.name;
    if(body.notes) building.notes = body.notes;
    
    if(body.access_codes) {
        building.access_codes.push(...body.access_codes);
    }
    if(body.locker_codes) {
        building.locker_codes.push(...body.locker_codes);
    }

    building.save().catch(err => {
        return res.status(500).json({ error: true, message: 'Failed to update building' });
    });

    return res.status(200).json({ error: false, data: building });
    
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    const building = await Building.findByIdAndDelete(id).catch(err => {
        return res.status(500).json({ error: true, message: 'Failed to delete building' });
    });
    
    return res.status(200).json({ error: false, data: building });
});

router.post('/:id/code', async (req, res) => {
    const { id } = req.params;
    const { code, notes } = req.body;
    
    if (!code) {
        return res.status(400).json({ error: true, message: 'Code is required' });
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