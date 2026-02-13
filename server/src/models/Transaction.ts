import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    userId: {
        type: String, // Clerk ID
        ref: 'User',
        required: false // Optional for machine transactions until claimed
    },
    userMismatch: { type: Boolean, default: false },
    userName: { type: String },
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
    machineLocation: {
        type: String, // Snapshot of address
        default: 'Unknown'
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Claimed'],
        default: 'Completed' // Default to Completed for direct user additions, 'Pending' for machine sync
    },
    transactionCode: {
        type: String,
        unique: true,
        sparse: true // Allow null/undefined for older records
    },
    claimedAt: {
        type: Date
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
