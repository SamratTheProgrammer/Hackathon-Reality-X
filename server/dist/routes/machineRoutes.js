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
const Machine_1 = __importDefault(require("../models/Machine"));
const router = express_1.default.Router();
// Get all machines (for Admin)
router.get('/all', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const machines = yield Machine_1.default.find();
        res.json({ success: true, data: machines });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
}));
// Register a new machine (for setup/Admin)
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { machineId, name, location, password, maxCapacity } = req.body;
        // Auto-generate ID if not provided (Format: M-1000)
        let finalMachineId = machineId;
        if (!finalMachineId) {
            const count = yield Machine_1.default.countDocuments();
            finalMachineId = `M-${1000 + count + 1}`;
        }
        const existing = yield Machine_1.default.findOne({ machineId: finalMachineId });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Machine ID already exists' });
        }
        const newMachine = new Machine_1.default({
            machineId: finalMachineId,
            name,
            location,
            password, // In prod, hash this!
            maxCapacity: maxCapacity || 100,
            isActive: false // Pending approval
        });
        yield newMachine.save();
        res.status(201).json({ success: true, data: newMachine, message: 'Registration successful. Waiting for Admin Approval.' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
}));
// Admin Approve Machine
router.post('/approve', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { machineId } = req.body;
        const machine = yield Machine_1.default.findOne({ machineId });
        if (!machine) {
            return res.status(404).json({ success: false, message: 'Machine not found' });
        }
        machine.isActive = true;
        yield machine.save();
        res.json({ success: true, message: `Machine ${machineId} activated.` });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
}));
// Machine Login
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { machineId, password } = req.body;
        const machine = yield Machine_1.default.findOne({ machineId });
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
}));
// Update Machine Status/Capacity
router.post('/update-status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { machineId, capacity, status } = req.body;
        const machine = yield Machine_1.default.findOne({ machineId });
        if (!machine) {
            return res.status(404).json({ success: false, message: 'Machine not found' });
        }
        if (capacity !== undefined)
            machine.capacity = capacity;
        if (status)
            machine.status = status;
        // Auto-update status based on capacity if not explicitly set to Maintenance
        if (machine.status !== 'Maintenance') {
            if (machine.capacity >= machine.maxCapacity) {
                machine.status = 'Full';
            }
            else {
                machine.status = 'Available';
            }
        }
        machine.lastActivity = new Date();
        yield machine.save();
        res.json({ success: true, data: machine });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
}));
;
// Sync Transaction from Machine
router.post('/transaction', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { machineId, transaction } = req.body;
        // transaction: { id, items, totalPoints, timestamp }
        const machine = yield Machine_1.default.findOne({ machineId });
        if (!machine) {
            return res.status(404).json({ success: false, message: 'Machine not found' });
        }
        // In a real app, we would save this to a MachineTransaction collection
        // For now, we'll just acknowledge it and maybe update machine stats if we had them
        machine.lastActivity = new Date();
        yield machine.save();
        res.json({ success: true, message: 'Transaction synced' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
}));
exports.default = router;
