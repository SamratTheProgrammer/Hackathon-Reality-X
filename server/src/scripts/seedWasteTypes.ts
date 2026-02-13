
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WasteType from '../models/WasteType';

dotenv.config();

const connectionString = process.env.MONGO_URI || 'mongodb://localhost:27017/reality-x';
// Ensure connection string is valid
if (!connectionString) {
    console.error('MONGO_URI is not defined in .env and fallback failed.');
    process.exit(1);
}

const wasteTypes = [
    {
        name: 'Plastic Bottle',
        pointsPerUnit: 10,
        unit: 'item',
        icon: '🧴',
        color: 'bg-blue-500',
        isActive: true
    },
    {
        name: 'Aluminum Can',
        pointsPerUnit: 15,
        unit: 'item',
        icon: '🥫',
        color: 'bg-red-500',
        isActive: true
    },
    {
        name: 'Glass Bottle',
        pointsPerUnit: 20,
        unit: 'item',
        icon: '🍾',
        color: 'bg-green-500',
        isActive: true
    },
    {
        name: 'Paper/Cardboard',
        pointsPerUnit: 5,
        unit: 'kg',
        icon: '📄',
        color: 'bg-yellow-500',
        isActive: true
    },
    {
        name: 'E-Waste',
        pointsPerUnit: 50,
        unit: 'item',
        icon: '🔋',
        color: 'bg-purple-500',
        isActive: true
    },
    {
        name: 'Organic',
        pointsPerUnit: 2, // low points per kg for compost
        unit: 'kg',
        icon: '🍏',
        color: 'bg-lime-500',
        isActive: true
    },
    {
        name: 'Tetra Pak',
        pointsPerUnit: 8,
        unit: 'item',
        icon: '🥡',
        color: 'bg-orange-500',
        isActive: true
    },
    {
        name: 'Metal Scrap',
        pointsPerUnit: 12,
        unit: 'kg',
        icon: '🔩',
        color: 'bg-gray-500',
        isActive: true
    },
    {
        name: 'Textiles',
        pointsPerUnit: 15,
        unit: 'kg',
        icon: '👕',
        color: 'bg-pink-500',
        isActive: true
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(connectionString);
        console.log('Connected to DB');

        // Check if waste types already exist to avoid duplicates
        // Or clear and re-seed? Let's just add if not present by name

        // Clearing is safer for fresh seed request "give some types"
        console.log('Clearing existing waste types...');
        await WasteType.deleteMany({});

        console.log('Seeding waste types...');
        await WasteType.insertMany(wasteTypes);

        console.log('Waste types seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
