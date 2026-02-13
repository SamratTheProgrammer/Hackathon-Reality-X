"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const router = express_1.default.Router();
// GET /api/user/:clerkId
router.get('/:clerkId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findOne({ clerkId: req.params.clerkId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));
// POST /api/user/transaction
router.post('/transaction', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, totalPoints, items } = req.body;
        // items format: [{ wasteId: '1', count: 2, points: 20 }, ...]
        // Find user 
        // Note: The 'userId' from client might be Clerk ID.
        // It's safer to query by clerkId.
        const userDoc = yield User_1.default.findOne({ clerkId: userId });
        if (!userDoc) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        // Cast to any to bypass Mongoose strict typing issues for dynamic updates
        const user = userDoc;
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
        items.forEach((item) => {
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
        yield user.save();
        // Save Transaction Record
        const newTransaction = new Transaction_1.default({
            userId: user.clerkId,
            userName: user.name,
            machineId: req.body.machineId || 'unknown',
            items: items,
            totalPoints: totalPoints,
            totalWeight: sessionWeight
        });
        yield newTransaction.save();
        res.json({ success: true, message: 'Transaction processed', newBalance: user.points });
    }
    catch (error) {
        console.error('Transaction Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}));
// GET /api/user/activities (Public feed)
router.get('/activities', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activities = yield Transaction_1.default.find()
            .sort({ createdAt: -1 })
            .limit(10);
        res.json({ success: true, data: activities });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));
// POST /api/user/redeem
router.post('/redeem', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, rewardName, cost } = req.body;
        const userDoc = yield User_1.default.findOne({ clerkId: userId });
        if (!userDoc) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const user = userDoc;
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
        yield user.save();
        res.json({ success: true, message: 'Redemption successful', data: redemption, newBalance: user.points });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));
exports.default = router;
