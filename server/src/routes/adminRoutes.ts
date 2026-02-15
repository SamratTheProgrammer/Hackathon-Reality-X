import express from 'express';
import User from '../models/User';
import Machine from '../models/Machine';
import Transaction from '../models/Transaction';
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

// --- Stats ---

// GET /api/admin/stats/rewards
router.get('/stats/rewards', async (_req, res) => {
    try {
        const activeRewardsCount = await Reward.countDocuments({ isActive: true });
        const activeWasteTypesCount = await WasteType.countDocuments({ isActive: true });

        // Aggregate total redemptions across all users
        const redemptionsAgg = await User.aggregate([
            { $unwind: "$redemptions" },
            { $count: "totalRedemptions" }
        ]);
        const totalRedemptions = redemptionsAgg[0]?.totalRedemptions || 0;

        res.json({ success: true, data: { activeRewardsCount, totalRedemptions, activeWasteTypesCount } });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/admin/redemptions (History)
router.get('/redemptions', async (_req, res) => {
    try {
        const users = await User.find({ 'redemptions.0': { $exists: true } }, 'name email redemptions');

        let allRedemptions: any[] = [];
        users.forEach(user => {
            user.redemptions.forEach((r: any) => {
                allRedemptions.push({
                    id: r._id,
                    userName: user.name,
                    userEmail: user.email, // Optional, if needed
                    rewardName: r.rewardName,
                    cost: r.cost,
                    date: r.createdAt,
                    code: r.code
                });
            });
        });

        // Sort by date desc
        allRedemptions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        res.json({ success: true, data: allRedemptions });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/admin/stats/weekly-activity
router.get('/stats/weekly-activity', async (_req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const stats = await Transaction.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalPoints: { $sum: "$totalPoints" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Fill in missing days
        const labels = [];
        const data = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

            const found = stats.find(s => s._id === dateStr);
            labels.push(dayName);
            data.push(found ? found.count : 0); // Using count for "Collection" activity
        }

        res.json({ success: true, data: { labels, data } });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/admin/stats/waste-distribution
router.get('/stats/waste-distribution', async (_req, res) => {
    try {
        const stats = await Transaction.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.wasteId",
                    count: { $sum: "$items.count" }
                }
            },
            {
                $addFields: {
                    wasteIdObj: { $toObjectId: "$_id" }
                }
            },
            {
                $lookup: {
                    from: "wastetypes",
                    localField: "wasteIdObj",
                    foreignField: "_id",
                    as: "wasteType"
                }
            },
            { $unwind: "$wasteType" },
            {
                $project: {
                    label: "$wasteType.name",
                    color: "$wasteType.color",
                    count: 1
                }
            }
        ]);

        const total = stats.reduce((acc, curr) => acc + curr.count, 0) || 1;
        const distribution = stats.map(s => ({
            label: s.label,
            count: s.count,
            val: Math.round((s.count / total) * 100),
            color: s.color || 'bg-gray-500'
        }));

        res.json({ success: true, data: distribution });
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
        if (!id) {
            return res.status(400).json({ success: false, message: 'ID is required' });
        }
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

// DELETE /api/admin/rewards/:id
router.delete('/rewards/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Reward.findByIdAndDelete(id);
        res.json({ success: true, message: 'Reward deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
