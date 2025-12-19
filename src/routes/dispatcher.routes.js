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
        const dispatchers = await Dispatcher.find() ?? [];

        return res.status(200).json({ error: false, data: dispatchers });
    }

});

router.post('/', async (req, res) => {
    const { name, pin, admin: requestedAdmin } = req.body;

    if (!name || !pin) {
        return res.status(400).json({ error: true, message: 'Name and pin are required' });
    }
    
    let admin = false;
    
    // Check if any admin dispatcher exists
    const adminExists = await Dispatcher.findOne({ admin: true }).catch(err => {
        return res.status(500).json({ error: true, message: 'Failed to check for admin dispatcher' });
    });
    
    // If admin field is explicitly requested in the body
    if (requestedAdmin === true) {
        // Check if requester is authenticated and is an admin
        if (!req.dispatcherId) {
            return res.status(401).json({ error: true, message: 'Authentication required to create admin dispatcher' });
        }
        
        const requester = await Dispatcher.findById(req.dispatcherId).catch(err => {
            return res.status(500).json({ error: true, message: 'Failed to verify requester' });
        });
        
        if (!requester || !requester.admin) {
            return res.status(403).json({ error: true, message: 'Only admins can create other admin dispatchers' });
        }
        
        admin = true;
    } else if (requestedAdmin === false) {
        // Explicitly set to false
        admin = false;
    } else {
        // If no admin field provided, use default logic: first dispatcher becomes admin
        admin = !adminExists;
    }
    
    const dispatcher = await Dispatcher.create({ 
        name, 
        pin, 
        admin,
        score: 25,
        total_score: 100
    }).catch(err => {
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