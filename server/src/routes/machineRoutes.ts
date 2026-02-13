import express from 'express';
import Machine from '../models/Machine';

const router = express.Router();

// Get all machines (for Admin)
router.get('/all', async (_req, res) => {
    try {
        const machines = await Machine.find();
        res.json({ success: true, data: machines });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
});

// Register a new machine (for setup/Admin)
router.post('/register', async (req, res) => {
    try {
        const { machineId, name, location, password, maxCapacity } = req.body;

        // Auto-generate ID if not provided (Format: M-1000)
        let finalMachineId = machineId;
        if (!finalMachineId) {
            const count = await Machine.countDocuments();
            finalMachineId = `M-${1000 + count + 1}`;
        }

        const existing = await Machine.findOne({ machineId: finalMachineId });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Machine ID already exists' });
        }

        const newMachine = new Machine({
            machineId: finalMachineId,
            name,
            location,
            password, // In prod, hash this!
            maxCapacity: maxCapacity || 100,
            isActive: false // Pending approval
        });

        await newMachine.save();
        res.status(201).json({ success: true, data: newMachine, message: 'Registration successful. Waiting for Admin Approval.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
});

// Admin Approve Machine
router.post('/approve', async (req, res) => {
    try {
        const { machineId } = req.body;
        const machine = await Machine.findOne({ machineId });
        if (!machine) {
            return res.status(404).json({ success: false, message: 'Machine not found' });
        }
        machine.isActive = true;
        await machine.save();
        res.json({ success: true, message: `Machine ${machineId} activated.` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
});

// Machine Login
router.post('/login', async (req, res) => {
    try {
        const { machineId, password } = req.body;
        const machine = await Machine.findOne({ machineId });

        if (!machine) {
            return res.status(404).json({ success: false, message: 'Machine not found' });
        }

        // Simple string comparison for hackathon speed. Use bcrypt in prod.
        if (machine.password !== password) {
            return res.status(401).json({ success: false, message: 'Invalid Credentials' });
        }

        if (!machine.isActive) {
            return res.status(403).json({ success: false, message: 'Machine not approved yet.' });
        }

        res.json({ success: true, data: machine });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
});

// Update Machine Status/Capacity
router.post('/update-status', async (req, res) => {
    try {
        const { machineId, capacity, status } = req.body;

        const machine = await Machine.findOne({ machineId });
        if (!machine) {
            return res.status(404).json({ success: false, message: 'Machine not found' });
        }

        if (capacity !== undefined) machine.capacity = capacity;
        if (status) machine.status = status;

        // Auto-update status based on capacity if not explicitly set to Maintenance
        if (machine.status !== 'Maintenance') {
            if (machine.capacity >= machine.maxCapacity) {
                machine.status = 'Full';
            } else {
                machine.status = 'Available';
            }
        }

        machine.lastActivity = new Date();
        await machine.save();

        res.json({ success: true, data: machine });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
});

export default router;
