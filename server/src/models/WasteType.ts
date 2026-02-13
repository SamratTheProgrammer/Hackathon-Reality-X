import mongoose from 'mongoose';

const WasteTypeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    pointsPerUnit: { type: Number, required: true },
    unit: { type: String, enum: ['item', 'kg', 'g'], required: true },
    icon: { type: String, required: true }, // Lucide icon name
    color: { type: String, required: true }, // Tailwind class
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('WasteType', WasteTypeSchema);
