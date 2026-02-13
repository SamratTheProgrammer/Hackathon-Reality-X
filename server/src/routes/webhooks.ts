import express, { Request, Response } from 'express';
import { Webhook } from 'svix';
import bodyParser from 'body-parser';
import User from '../models/User';

const router = express.Router();

router.post('/clerk', bodyParser.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        const headers = req.headers;

        const svix_id = headers['svix-id'] as string;
        const svix_timestamp = headers['svix-timestamp'] as string;
        const svix_signature = headers['svix-signature'] as string;

        if (!svix_id || !svix_timestamp || !svix_signature) {
            return res.status(400).send('Error: Missing svix headers');
        }

        const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

        if (!WEBHOOK_SECRET) {
            throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
        }

        const wh = new Webhook(WEBHOOK_SECRET);
        let evt: any;

        try {
            evt = wh.verify(payload, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature,
            });
        } catch (err: any) {
            console.log('Error verifying webhook:', err.message);
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        // Handle the event
        const eventType = evt.type;
        const { id, email_addresses, first_name, last_name } = evt.data;

        if (eventType === 'user.created') {
            const email = email_addresses[0]?.email_address;
            const name = `${first_name} ${last_name}`;

            await User.create({
                clerkId: id,
                email,
                name,
            });
            console.log(`User created: ${id}`);
        }
        else if (eventType === 'user.updated') {
            const email = email_addresses[0]?.email_address;
            const name = `${first_name} ${last_name}`;

            await User.findOneAndUpdate({ clerkId: id }, {
                email,
                name,
            });
            console.log(`User updated: ${id}`);
        }
        else if (eventType === 'user.deleted') {
            await User.findOneAndDelete({ clerkId: id });
            console.log(`User deleted: ${id}`);
        }

        return res.status(200).json({
            success: true,
            message: 'Webhook received'
        });

    } catch (error: any) {
        console.error('Webhook Error:', error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
