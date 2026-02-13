import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db';
import webhookRoutes from './routes/webhooks';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());

// Webhooks (must be before body-parser json)
// We are handling raw body inside the route itself for /clerk
// But for other routes we might need JSON.
// However, since we are using 'bodyParser.raw' in the route definition, 
// we can mount it before or after global json middleware as long as paths don't conflict.
// Best practice for robust webhook handling is often to mount it first or explicitly on the route.
// Our webhooks.ts mounts it on the route.

// Webhooks (must be before body-parser json to get raw body for signature verification)
app.use('/api/webhooks', webhookRoutes);

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Reality-X Server is Running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
