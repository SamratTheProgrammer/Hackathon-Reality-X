import express from 'express';
import User from '../models/User';

const router = express.Router();

// Define a loose interface for the User document to avoid excessive type errors
// In a production app, we would export this from the model file.
interface IUser {
    clerkId: string;
    points: number;
    wasteStats: {
        plasticBottles: number;
        glassBottles: number;
        aluminumCans: number;
        paperWeight: number;
        eWaste: number;
        totalWeight: number;
        transactionsCount: number;
    };
    redemptions: any[];
    save: () => Promise<any>;
    markModified: (path: string) => void; // Add markModified method
}

// GET /api/user/:clerkId
router.get('/:clerkId', async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.params.clerkId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, data: user });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/user/transaction
router.post('/transaction', async (req, res) => {
    try {
        const { userId, totalPoints, items } = req.body;
        // items format: [{ wasteId: '1', count: 2, points: 20 }, ...]

        // Find user 
        // Note: The 'userId' from client might be Clerk ID.
        // It's safer to query by clerkId.
        const userDoc = await User.findOne({ clerkId: userId });

        if (!userDoc) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Cast to any to bypass Mongoose strict typing issues for dynamic updates
        const user: IUser = userDoc as IUser;

        // Initialize wasteStats if missing (migration for old users)
        if (!user.wasteStats) {
            user.wasteStats = {
                plasticBottles: 0,
                glassBottles: 0,
                aluminumCans: 0,
                paperWeight: 0,
                eWaste: 0,
                totalWeight: 0,
                transactionsCount: 0
            };
        }

        let sessionWeight = 0;

        // Process items to update specific stats
        // Mock weights mapping for calculation (should ideally match Machine App logic)
        // 1: Plastic (20g), 2: Glass (200g), 3: Can (15g), 4: Paper (1g), 5: E-Waste (100g)

        items.forEach((item: any) => {
            const count = item.count || 0;
            const wasteId = String(item.wasteId); // Ensure string comparison
            switch (wasteId) {
                case '1': // Plastic
                    user.wasteStats.plasticBottles = (user.wasteStats.plasticBottles || 0) + count;
                    sessionWeight += (count * 20);
                    break;
                case '2': // Glass
                    user.wasteStats.glassBottles = (user.wasteStats.glassBottles || 0) + count;
                    sessionWeight += (count * 200);
                    break;
                case '3': // Can
                    user.wasteStats.aluminumCans = (user.wasteStats.aluminumCans || 0) + count;
                    sessionWeight += (count * 15);
                    break;
                case '4': // Paper
                    // Paper usually by weight in g already? Or items.
                    // MachineContext says: unit: 'g'. So 'count' is grams.
                    user.wasteStats.paperWeight = (user.wasteStats.paperWeight || 0) + count;
                    sessionWeight += count;
                    break;
                case '5': // E-Waste
                    user.wasteStats.eWaste = (user.wasteStats.eWaste || 0) + count;
                    sessionWeight += (count * 100);
                    break;
            }
        });

        user.wasteStats.totalWeight = (user.wasteStats.totalWeight || 0) + sessionWeight;
        user.wasteStats.transactionsCount = (user.wasteStats.transactionsCount || 0) + 1;

        // Update Points
        user.points = (user.points || 0) + totalPoints;

        // Mark paths as modified just in case mixed types cause issues
        user.markModified('wasteStats');

        await user.save();

        res.json({ success: true, message: 'Transaction processed', newBalance: user.points });

    } catch (error: any) {
        console.error('Transaction Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/user/redeem
router.post('/redeem', async (req, res) => {
    try {
        const { userId, rewardName, cost } = req.body;

        const userDoc = await User.findOne({ clerkId: userId });
        if (!userDoc) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const user: IUser = userDoc as IUser;

        if ((user.points || 0) < cost) {
            return res.status(400).json({ success: false, message: 'Insufficient points' });
        }

        // Deduct points
        user.points -= cost;

        // Generate Code
        const code = `REDEEM-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 days validity

        const redemption = {
            code,
            rewardName,
            cost,
            expiresAt,
            createdAt: new Date()
        };

        if (!user.redemptions) {
            user.redemptions = [];
        }

        user.redemptions.push(redemption);
        user.markModified('redemptions'); // Ensure array update is detected

        await user.save();

        res.json({ success: true, message: 'Redemption successful', data: redemption, newBalance: user.points });

    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
