"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../db/prisma");
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET || 'super-secret-jwt-key', {
        expiresIn: '7d'
    });
};
const signup = async (req, res) => {
    try {
        const { username, password, favoriteColor, leastFavoriteColor, guestProgress } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { username }
        });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const user = await prisma_1.prisma.user.create({
            data: {
                username,
                passwordHash,
                favoriteColor: favoriteColor || '#FF5C5C',
                leastFavoriteColor: leastFavoriteColor || '#272a31'
            }
        });
        // Merge guest progress if provided
        if (guestProgress) {
            const { completedLevels = [], levelCode = {}, levelDimensions = {} } = guestProgress;
            const levelIds = new Set([
                ...completedLevels,
                ...Object.keys(levelCode),
                ...Object.keys(levelDimensions)
            ]);
            const progressData = Array.from(levelIds).map(levelId => {
                const dimensions = levelDimensions[levelId] || { width: 5, height: 5 };
                return {
                    userId: user.id,
                    levelId,
                    code: levelCode[levelId] || '',
                    width: dimensions.width || 5,
                    height: dimensions.height || 5,
                    completed: completedLevels.includes(levelId)
                };
            });
            if (progressData.length > 0) {
                await prisma_1.prisma.userProgress.createMany({
                    data: progressData
                });
            }
        }
        const token = generateToken(user.id);
        // Omit passwordHash
        const { passwordHash: _, ...safeUser } = user;
        res.json({ token, user: safeUser });
    }
    catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await prisma_1.prisma.user.findUnique({
            where: { username }
        });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const validPassword = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = generateToken(user.id);
        const { passwordHash: _, ...safeUser } = user;
        res.json({ token, user: safeUser });
    }
    catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { passwordHash: _, ...safeUser } = req.user;
    res.json(safeUser);
};
exports.getMe = getMe;
