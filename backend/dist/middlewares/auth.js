"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../db/prisma");
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'super-secret-jwt-key');
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: payload.userId }
        });
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.user = user;
        next();
    }
    catch (err) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};
exports.authenticate = authenticate;
