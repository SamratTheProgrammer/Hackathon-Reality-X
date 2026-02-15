
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Adjust path to .env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/reality-x';

// Waste Type Schema (Inline definitions to avoid import issues)
const WasteTypeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    pointsPerUnit: { type: Number, required: true },
    unit: { type: String, required: true, enum: ['item', 'kg', 'g'] },
    icon: { type: String, required: true }, // Store as string (e.g., 'Bottle') or emoji
    color: { type: String, default: 'text-gray-500' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const WasteType = mongoose.models.WasteType || mongoose.model('WasteType', WasteTypeSchema);

const seedWasteTypes = async () => {
    try {
        console.log('Connecting to MongoDB at', MONGO_URI);
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const wasteTypes = [
            {
                name: 'Plastic Bottle',
                pointsPerUnit: 10,
                unit: 'item',
                icon: '🧴',
                color: 'text-blue-500',
                isActive: true
            },
            {
                name: 'Glass Bottle',
                pointsPerUnit: 15,
                unit: 'item',
                icon: '🍾',
                color: 'text-green-500',
                isActive: true
            },
            {
                name: 'Aluminum Can',
                pointsPerUnit: 12,
                unit: 'item',
                icon: '🥫',
                color: 'text-gray-400',
                isActive: true
            },
            {
                name: 'E-Waste',
                pointsPerUnit: 50,
                unit: 'item',
                icon: '🔋',
                color: 'text-red-500',
                isActive: true
            }
        ];

        // Check if exists
        const count = await WasteType.countDocuments();
        if (count === 0) {
            await WasteType.insertMany(wasteTypes);
            console.log('Waste Types Seeded Successfully');
        } else {
            console.log('Waste Types already exist. Skipping seed.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
};

seedWasteTypes();
