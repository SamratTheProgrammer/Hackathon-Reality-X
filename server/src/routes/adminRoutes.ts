import express from 'express';
import User from '../models/User';
import Machine from '../models/Machine';
import WasteType from '../models/WasteType';
import Reward from '../models/Reward';

const router = express.Router();

// --- Users ---

// GET /api/admin/users
router.get('/users', async (_req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json({ success: true, data: users });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- Machines ---

// POST /api/admin/machine/deactivate
router.post('/machine/deactivate', async (req, res) => {
    try {
        const { machineId, isActive } = req.body;
        const machine = await Machine.findOne({ machineId });
        if (!machine) {
            return res.status(404).json({ success: false, message: 'Machine not found' });
        }
        machine.isActive = isActive; // Toggle
        await machine.save();
        res.json({ success: true, message: `Machine ${machineId} ${isActive ? 'activated' : 'deactivated'}.` });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/admin/machine/update-details
router.post('/machine/update-details', async (req, res) => {
    try {
        const { machineId, name, location, password } = req.body;
        const machine = await Machine.findOne({ machineId });
        if (!machine) return res.status(404).json({ success: false, message: 'Machine not found' });

        if (name) machine.name = name;
        if (location) machine.location = location;
        if (password) machine.password = password;

        await machine.save();
        res.json({ success: true, data: machine, message: 'Machine updated successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/admin/machine/delete
router.post('/machine/delete', async (req, res) => {
    try {
        const { machineId } = req.body;
        await Machine.findOneAndDelete({ machineId });
        res.json({ success: true, message: 'Machine deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- Waste Types ---

// GET /api/admin/waste-types
router.get('/waste-types', async (_req, res) => {
    try {
        const types = await WasteType.find();
        res.json({ success: true, data: types });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/admin/waste-types
router.post('/waste-types', async (req, res) => {
    try {
        const { id, name, pointsPerUnit, unit, icon, color, isActive } = req.body;

        if (id) {
            // Update
            const updated = await WasteType.findByIdAndUpdate(id, {
                name, pointsPerUnit, unit, icon, color, isActive
            }, { new: true });
            return res.json({ success: true, data: updated });
        } else {
            // Create
            const newType = new WasteType({ name, pointsPerUnit, unit, icon, color, isActive });
            await newType.save();
            return res.json({ success: true, data: newType });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/admin/waste-types/delete
router.post('/waste-types/delete', async (req, res) => {
    try {
        const { id } = req.body;
        await WasteType.findByIdAndDelete(id);
        res.json({ success: true, message: 'Waste type deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- Rewards ---

// GET /api/admin/rewards
router.get('/rewards', async (_req, res) => {
    try {
        const rewards = await Reward.find();
        res.json({ success: true, data: rewards });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/admin/rewards
router.post('/rewards', async (req, res) => {
    try {
        const { id, name, cost, description, image, isActive } = req.body;

        if (id) {
            // Update
            const updated = await Reward.findByIdAndUpdate(id, {
                name, cost, description, image, isActive
            }, { new: true });
            return res.json({ success: true, data: updated });
        } else {
            // Create
            const newReward = new Reward({ name, cost, description, image, isActive });
            await newReward.save();
            return res.json({ success: true, data: newReward });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
