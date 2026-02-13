"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const transactionSchema = new mongoose_1.default.Schema({
    userId: {
        type: String, // Clerk ID
        required: true,
        ref: 'User'
    },
    userMismatch: { type: Boolean, default: false }, // If userId doesn't match a User (rare)
    userName: { type: String }, // Cache name for easier feed display
    machineId: {
        type: String,
        required: true,
    },
    items: [{
            wasteId: String,
            count: Number,
            points: Number
        }],
    totalPoints: {
        type: Number,
        required: true
    },
    totalWeight: {
        type: Number,
        default: 0
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
const Transaction = mongoose_1.default.model('Transaction', transactionSchema);
exports.default = Transaction;
