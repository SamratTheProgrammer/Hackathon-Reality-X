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
const Machine_1 = __importDefault(require("../models/Machine"));
const WasteType_1 = __importDefault(require("../models/WasteType"));
const Reward_1 = __importDefault(require("../models/Reward"));
const router = express_1.default.Router();
// --- Users ---
// GET /api/admin/users
router.get('/users', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find().sort({ createdAt: -1 });
        res.json({ success: true, data: users });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));
// --- Machines ---
// POST /api/admin/machine/deactivate
router.post('/machine/deactivate', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { machineId, isActive } = req.body;
        const machine = yield Machine_1.default.findOne({ machineId });
        if (!machine) {
            return res.status(404).json({ success: false, message: 'Machine not found' });
        }
        machine.isActive = isActive; // Toggle
        yield machine.save();
        res.json({ success: true, message: `Machine ${machineId} ${isActive ? 'activated' : 'deactivated'}.` });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));
// POST /api/admin/machine/update-details
router.post('/machine/update-details', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { machineId, name, location, password } = req.body;
        const machine = yield Machine_1.default.findOne({ machineId });
        if (!machine)
            return res.status(404).json({ success: false, message: 'Machine not found' });
        if (name)
            machine.name = name;
        if (location)
            machine.location = location;
        if (password)
            machine.password = password;
        yield machine.save();
        res.json({ success: true, data: machine, message: 'Machine updated successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));
// POST /api/admin/machine/delete
router.post('/machine/delete', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { machineId } = req.body;
        yield Machine_1.default.findOneAndDelete({ machineId });
        res.json({ success: true, message: 'Machine deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));
// --- Waste Types ---
// GET /api/admin/waste-types
router.get('/waste-types', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const types = yield WasteType_1.default.find();
        res.json({ success: true, data: types });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));
// POST /api/admin/waste-types
router.post('/waste-types', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, pointsPerUnit, unit, icon, color, isActive } = req.body;
        if (id) {
            // Update
            const updated = yield WasteType_1.default.findByIdAndUpdate(id, {
                name, pointsPerUnit, unit, icon, color, isActive
            }, { new: true });
            return res.json({ success: true, data: updated });
        }
        else {
            // Create
            const newType = new WasteType_1.default({ name, pointsPerUnit, unit, icon, color, isActive });
            yield newType.save();
            return res.json({ success: true, data: newType });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));
// --- Rewards ---
// GET /api/admin/rewards
router.get('/rewards', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rewards = yield Reward_1.default.find();
        res.json({ success: true, data: rewards });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));
// POST /api/admin/rewards
router.post('/rewards', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, cost, description, image, isActive } = req.body;
        if (id) {
            // Update
            const updated = yield Reward_1.default.findByIdAndUpdate(id, {
                name, cost, description, image, isActive
            }, { new: true });
            return res.json({ success: true, data: updated });
        }
        else {
            // Create
            const newReward = new Reward_1.default({ name, cost, description, image, isActive });
            yield newReward.save();
            return res.json({ success: true, data: newReward });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));
exports.default = router;
