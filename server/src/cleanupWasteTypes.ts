
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

const cleanupDuplicates = async () => {
    try {
        console.log('Connecting to MongoDB at', MONGO_URI);
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const allTypes = await WasteType.find();
        const seenNames = new Set();
        const duplicates = [];

        for (const type of allTypes) {
            if (seenNames.has(type.name)) {
                console.log('Found duplicate:', type.name);
                duplicates.push(type._id);
            } else {
                seenNames.add(type.name);
            }
        }

        if (duplicates.length > 0) {
            console.log(`Found ${duplicates.length} duplicates. Deleting...`);
            await WasteType.deleteMany({ _id: { $in: duplicates } });
            console.log('Duplicates deleted.');
        } else {
            console.log('No duplicates found.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Cleanup Error:', error);
        process.exit(1);
    }
};

cleanupDuplicates();
