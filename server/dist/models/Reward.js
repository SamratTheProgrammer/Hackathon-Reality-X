"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RewardSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    cost: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Reward', RewardSchema);
