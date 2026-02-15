
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Adjust path to .env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/reality-x';

const checkData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        const User = mongoose.connection.db?.collection('users');
        const Transaction = mongoose.connection.db?.collection('transactions');
        const WasteType = mongoose.connection.db?.collection('wastetypes');
        const Reward = mongoose.connection.db?.collection('rewards');

        const userCount = await User?.countDocuments() || 0;
        const txCount = await Transaction?.countDocuments() || 0;
        const wtCount = await WasteType?.countDocuments() || 0;
        const rwCount = await Reward?.countDocuments() || 0;

        console.log('--- DB STATS ---');
        console.log('Users:', userCount);
        console.log('Transactions:', txCount);
        console.log('WasteTypes:', wtCount);
        console.log('Rewards:', rwCount);

        if (txCount > 0) {
            const txs = await Transaction?.find().sort({ _id: -1 }).limit(5).toArray();
            console.log('Last 5 Transactions:', JSON.stringify(txs, null, 2));
        }

        if (userCount > 0) {
            const user = await User?.findOne({});
            console.log('Sample User:', JSON.stringify(user, null, 2));
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkData();
