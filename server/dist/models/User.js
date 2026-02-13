"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
    },
    points: {
        type: Number,
        default: 0,
    },
    wasteStats: {
        plasticBottles: { type: Number, default: 0 },
        glassBottles: { type: Number, default: 0 },
        aluminumCans: { type: Number, default: 0 },
        paperWeight: { type: Number, default: 0 }, // in grams
        eWaste: { type: Number, default: 0 },
        totalWeight: { type: Number, default: 0 }, // in grams
        transactionsCount: { type: Number, default: 0 },
    },
    redemptions: [{
            code: String,
            rewardName: String,
            cost: Number,
            expiresAt: Date,
            createdAt: { type: Date, default: Date.now }
        }]
}, {
    timestamps: true,
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
