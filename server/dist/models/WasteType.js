"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const WasteTypeSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    pointsPerUnit: { type: Number, required: true },
    unit: { type: String, enum: ['item', 'kg', 'g'], required: true },
    icon: { type: String, required: true }, // Lucide icon name
    color: { type: String, required: true }, // Tailwind class
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
exports.default = mongoose_1.default.model('WasteType', WasteTypeSchema);
