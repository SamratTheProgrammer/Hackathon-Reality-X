"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./db"));
const webhooks_1 = __importDefault(require("./routes/webhooks"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const machineRoutes_1 = __importDefault(require("./routes/machineRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Connect to Database
(0, db_1.default)();
// Middleware
app.use((0, cors_1.default)());
// Webhooks (must be before body-parser json)
// We are handling raw body inside the route itself for /clerk
// But for other routes we might need JSON.
// However, since we are using 'bodyParser.raw' in the route definition,
// we can mount it before or after global json middleware as long as paths don't conflict.
// Best practice for robust webhook handling is often to mount it first or explicitly on the route.
// Our webhooks.ts mounts it on the route.
// Webhooks (must be before body-parser json to get raw body for signature verification)
app.use('/api/webhooks', webhooks_1.default);
app.use(express_1.default.json());
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
// Routes
app.use('/api/user', userRoutes_1.default);
app.use('/api/machine', machineRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Reality-X Server is Running');
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
