import mongoose, { Schema, Document } from 'mongoose';

export interface IMachine extends Document {
    machineId: string;
    name: string;
    location: {
        lat: number;
        lng: number;
        address: string;
    };
    status: 'Available' | 'Full' | 'Maintenance';
    capacity: number;
    maxCapacity: number;
    password?: string; // Hashed in a real app, plaintext for hackathon speed if needed, but simple hash preferred
    isActive: boolean;
    lastActivity: Date;
}

const MachineSchema: Schema = new Schema({
    machineId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        address: { type: String, required: true }
    },
    status: { type: String, enum: ['Available', 'Full', 'Maintenance'], default: 'Available' },
    capacity: { type: Number, default: 0 },
    maxCapacity: { type: Number, default: 100 },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    lastActivity: { type: Date, default: Date.now }
});

export default mongoose.model<IMachine>('Machine', MachineSchema);
