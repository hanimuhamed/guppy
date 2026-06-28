"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMe = exports.updateMe = exports.getMe = exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../db/prisma");
const validation_1 = require("../utils/validation");
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET || 'super-secret-jwt-key', {
        expiresIn: '7d'
    });
};
// Helper to fetch user info from Google using access_token
const getGoogleUser = async (accessToken) => {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch Google user profile');
    }
    return response.json();
};
const signup = async (req, res) => {
    try {
        const { token, username, favoriteColor } = req.body;
        if (!token || !username) {
            return res.status(400).json({ error: 'Google token and username are required' });
        }
        const validationError = (0, validation_1.validateUsername)(username);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }
        const payload = await getGoogleUser(token);
        if (!payload || !payload.email || !payload.sub) {
            return res.status(400).json({ error: 'Invalid Google token' });
        }
        const email = payload.email;
        const googleId = payload.sub;
        const existingUser = await prisma_1.prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { googleId },
                    { username: { equals: username, mode: 'insensitive' } }
                ]
            }
        });
        if (existingUser) {
            if (existingUser.username.toLowerCase() === username.toLowerCase()) {
                return res.status(400).json({ error: 'Username already exists' });
            }
            return res.status(400).json({ error: 'Account already exists. Please log in.' });
        }
        const user = await prisma_1.prisma.user.create({
            data: {
                username,
                email,
                googleId,
                favoriteColor: favoriteColor || '#FF5C5C',
            }
        });
        const jwtToken = generateToken(user.id);
        res.json({ token: jwtToken, user });
    }
    catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Internal server error or invalid token' });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ error: 'Google token is required' });
        }
        const payload = await getGoogleUser(token);
        if (!payload || !payload.email) {
            return res.status(400).json({ error: 'Invalid Google token' });
        }
        const email = payload.email;
        const user = await prisma_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            return res.status(404).json({ error: 'Account not found. Please sign up first.' });
        }
        const jwtToken = generateToken(user.id);
        res.json({ token: jwtToken, user });
    }
    catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error or invalid token' });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json(req.user);
};
exports.getMe = getMe;
const updateMe = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { username, favoriteColor } = req.body;
    try {
        if (username && username !== req.user.username) {
            const validationError = (0, validation_1.validateUsername)(username);
            if (validationError) {
                return res.status(400).json({ error: validationError });
            }
            const existingUser = await prisma_1.prisma.user.findFirst({
                where: { username: { equals: username, mode: 'insensitive' } }
            });
            if (existingUser) {
                return res.status(400).json({ error: 'Username already exists' });
            }
        }
        const updatedUser = await prisma_1.prisma.user.update({
            where: { id: req.user.id },
            data: {
                username: username || req.user.username,
                favoriteColor: favoriteColor || req.user.favoriteColor
            }
        });
        res.json(updatedUser);
    }
    catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};
exports.updateMe = updateMe;
const deleteMe = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        // Prisma will cascade delete UserProgress if configured correctly in schema
        // Otherwise we need to explicitly delete it first
        await prisma_1.prisma.userProgress.deleteMany({
            where: { userId: req.user.id }
        });
        await prisma_1.prisma.user.delete({
            where: { id: req.user.id }
        });
        res.json({ success: true, message: 'Account deleted successfully' });
    }
    catch (err) {
        console.error('Delete account error:', err);
        res.status(500).json({ error: 'Failed to delete account' });
    }
};
exports.deleteMe = deleteMe;
