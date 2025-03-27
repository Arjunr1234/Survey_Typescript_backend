"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = require("./config/db");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const app = (0, express_1.default)();
//const originUrl: string = 'https://survey-app-frontend-red.vercel.app';
//const originUrl: string = 'http://localhost:5173';
const originUrl = "https://survey-typescript-frontend.vercel.app";
const corsOptions = {
    origin: originUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
(0, db_1.connectDB)();
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use('/api', userRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
const PORT = parseInt(process.env.PORT, 10) || 5002;
app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
