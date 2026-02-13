"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const svix_1 = require("svix");
const body_parser_1 = __importDefault(require("body-parser"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
router.post('/clerk', body_parser_1.default.raw({ type: 'application/json' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const payload = req.body;
        const headers = req.headers;
        const svix_id = headers['svix-id'];
        const svix_timestamp = headers['svix-timestamp'];
        const svix_signature = headers['svix-signature'];
        if (!svix_id || !svix_timestamp || !svix_signature) {
            return res.status(400).send('Error: Missing svix headers');
        }
        const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
        if (!WEBHOOK_SECRET) {
            throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
        }
        const wh = new svix_1.Webhook(WEBHOOK_SECRET);
        let evt;
        try {
            evt = wh.verify(payload, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature,
            });
        }
        catch (err) {
            console.log('Error verifying webhook:', err.message);
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        // Handle the event
        const eventType = evt.type;
        console.log(`Webhook Event Type: ${eventType}`);
        const { id, email_addresses, first_name, last_name } = evt.data;
        // console.log('Webhook Data:', JSON.stringify(evt.data, null, 2));
        if (eventType === 'user.created') {
            const email = (_a = email_addresses[0]) === null || _a === void 0 ? void 0 : _a.email_address;
            const name = `${first_name} ${last_name}`;
            console.log(`Attempting to create user: ${id}, ${email}, ${name}`);
            const newUser = yield User_1.default.create({
                clerkId: id,
                email,
                name,
            });
            console.log(`User created in DB: ${newUser._id}`);
        }
        else if (eventType === 'user.updated') {
            const email = (_b = email_addresses[0]) === null || _b === void 0 ? void 0 : _b.email_address;
            const name = `${first_name} ${last_name}`;
            console.log(`Attempting to update user: ${id}`);
            const updatedUser = yield User_1.default.findOneAndUpdate({ clerkId: id }, {
                email,
                name,
            }, { new: true });
            console.log('User updatedResult:', updatedUser ? 'Success' : 'Not Found');
        }
        else if (eventType === 'user.deleted') {
            console.log(`Attempting to delete user: ${id}`);
            yield User_1.default.findOneAndDelete({ clerkId: id });
            console.log(`User deleted: ${id}`);
        }
        else {
            console.log(`Unhandled Event Type: ${eventType}`);
        }
        return res.status(200).json({
            success: true,
            message: 'Webhook received'
        });
    }
    catch (error) {
        console.error('Webhook Error Details:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}));
exports.default = router;
