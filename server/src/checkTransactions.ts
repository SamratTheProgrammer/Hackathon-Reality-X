
import mongoose from 'mongoose';
import Transaction from './models/Transaction';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkTransactions = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || '');
        console.log('Connected to MongoDB');

        const count = await Transaction.countDocuments();
        console.log(`Total Transactions: ${count}`);

        if (count > 0) {
            const latest = await Transaction.find().sort({ createdAt: -1 }).limit(5);
            console.log('Latest Transactions:', JSON.stringify(latest, null, 2));
        } else {
            console.log('No transactions found.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

checkTransactions();
