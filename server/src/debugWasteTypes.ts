
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Adjust path to .env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/reality-x';

const WasteTypeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    pointsPerUnit: { type: Number, required: true },
    unit: { type: String, required: true },
    icon: { type: String, required: true },
    color: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const WasteType = mongoose.models.WasteType || mongoose.model('WasteType', WasteTypeSchema);

const listAndDeleteDuplicates = async () => {
    try {
        console.log('Connecting to MongoDB at', MONGO_URI);
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const allTypes = await WasteType.find();
        console.log('Current Waste Types in DB:');
        allTypes.forEach(t => console.log(`- ${t.name} (${t._id}) - ${t.pointsPerUnit} pts`));

        // Group by Name
        const groups: Record<string, any[]> = {};
        allTypes.forEach(t => {
            if (!groups[t.name]) groups[t.name] = [];
            groups[t.name].push(t);
        });

        const toDelete: string[] = [];

        for (const name in groups) {
            if (groups[name].length > 1) {
                console.log(`Found ${groups[name].length} duplicates for "${name}". Keeping the first one.`);
                // Keep the first one, delete the rest
                const [first, ...rest] = groups[name];
                rest.forEach(r => toDelete.push(r._id));
            }
        }

        if (toDelete.length > 0) {
            console.log(`Deleting ${toDelete.length} items...`);
            await WasteType.deleteMany({ _id: { $in: toDelete } });
            console.log('Deleted successfully.');
        } else {
            console.log('No duplicates found by name.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

listAndDeleteDuplicates();
