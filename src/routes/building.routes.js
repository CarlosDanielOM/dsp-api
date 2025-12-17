import { Router } from 'express';
import Building from '../../models/building.model.js';
import { createCode, voteOnCode } from '../../services/codes.js';

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

    if (!building) {
        return res.status(404).json({ error: true, message: 'Building not found' });
    }

    if(body.address) building.address = body.address;
    if(body.name) building.name = body.name;
    if(body.notes) building.notes = body.notes;
    
    if(body.access_codes) {
        building.access_codes.push(...body.access_codes);
    }
    if(body.locker_codes) {
        building.locker_codes.push(...body.locker_codes);
    }

    await building.save().catch(err => {
        return res.status(500).json({ error: true, message: 'Failed to update building' });
    });

    return res.status(200).json({ error: false, data: building });
    
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    const building = await Building.findByIdAndDelete(id).catch(err => {
        return res.status(500).json({ error: true, message: 'Failed to delete building' });
    });
    
    if (!building) {
        return res.status(404).json({ error: true, message: 'Building not found' });
    }
    
    return res.status(200).json({ error: false, data: building });
});

router.post('/:buildingId/code', async (req, res) => {
    const { buildingId } = req.params;
    const { code, notes, type, dispatcherId } = req.body;
    if (!code || !type) {
        return res.status(400).json({ error: true, message: 'Code and type are required' });
    }
    const newCode = await createCode(buildingId, req.dispatcherId, { code, notes }, type).catch(err => {
        return res.status(500).json({ error: true, message: 'Failed to create code' });
    });

    return res.status(201).json({ error: false, data: newCode });
});

router.patch('/:buildingId/code/:codeId', async (req, res) => {
    const { buildingId, codeId } = req.params;
    const { code, notes, type } = req.body;
    
    if (!code || !notes) {
        return res.status(400).json({ error: true, message: 'Code and notes are required' });
    }
    
    if (!type || (type !== 'access' && type !== 'locker')) {
        return res.status(400).json({ error: true, message: 'Type must be either "access" or "locker"' });
    }
    
    const building = await Building.findById(buildingId).catch(err => {
        return res.status(500).json({ error: true, message: 'Failed to get building' });
    });
    
    if (!building) {
        return res.status(404).json({ error: true, message: 'Building not found' });
    }
    
    const codeField = type === 'access' ? 'access_codes' : 'locker_codes';
    const codeToUpdate = building[codeField].id(codeId);
    
    if (!codeToUpdate) {
        return res.status(404).json({ error: true, message: 'Code not found' });
    }
    
    codeToUpdate.code = code;
    codeToUpdate.notes = notes;
    codeToUpdate.updated_at = new Date();
    
    await building.save().catch(err => {
        return res.status(500).json({ error: true, message: 'Failed to update code' });
    });
    
    return res.status(200).json({ error: false, data: building });
});

router.patch('/:buildingId/code/:codeId/vote', async (req, res) => {
    const { buildingId, codeId } = req.params;
    const { type, isUpvote } = req.body;
    if (!type || isUpvote === undefined) {
        return res.status(400).json({ error: true, message: 'Type and isUpvote are required' });
    }
    const updatedBuilding = await voteOnCode(buildingId, codeId, type, isUpvote).catch(err => {
        return res.status(500).json({ error: true, message: 'Failed to vote on code' });
    });

    return res.status(200).json({ error: false, data: updatedBuilding });
});

router.delete('/:buildingId/code/:codeId', async (req, res) => {
    const { buildingId, codeId } = req.params;
    const { type } = req.body;
    
    if (!type || (type !== 'access' && type !== 'locker')) {
        return res.status(400).json({ error: true, message: 'Type must be either "access" or "locker"' });
    }
    
    const codeField = type === 'access' ? 'access_codes' : 'locker_codes';
    
    const building = await Building.findByIdAndUpdate(
        buildingId, 
        { $pull: { [codeField]: { _id: codeId } } },
        { new: true }
    ).catch(err => {
        return res.status(500).json({ error: true, message: 'Failed to delete code' });
    });
    
    if (!building) {
        return res.status(404).json({ error: true, message: 'Building not found' });
    }
    
    return res.status(200).json({ error: false, data: building });
});

export default router;