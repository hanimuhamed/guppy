"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveProgress = exports.getProgress = void 0;
const prisma_1 = require("../db/prisma");
const getProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const progressRecords = await prisma_1.prisma.userProgress.findMany({
            where: { userId }
        });
        const completedLevels = [];
        const levelCode = {};
        const levelDimensions = {};
        for (const record of progressRecords) {
            if (record.completed) {
                completedLevels.push(record.levelId);
            }
            if (record.code) {
                levelCode[record.levelId] = record.code;
            }
            levelDimensions[record.levelId] = { width: record.width, height: record.height };
        }
        res.json({
            completedLevels,
            levelCode,
            levelDimensions
        });
    }
    catch (err) {
        console.error('Get progress error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getProgress = getProgress;
const saveProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { levelId, code, dimensions, completed } = req.body;
        if (!levelId) {
            return res.status(400).json({ error: 'levelId is required' });
        }
        // Upsert progress
        await prisma_1.prisma.userProgress.upsert({
            where: {
                userId_levelId: {
                    userId,
                    levelId
                }
            },
            update: {
                code: code !== undefined ? code : undefined,
                width: dimensions?.width,
                height: dimensions?.height,
                completed: completed !== undefined ? completed : undefined
            },
            create: {
                userId,
                levelId,
                code: code || '',
                width: dimensions?.width || 5,
                height: dimensions?.height || 5,
                completed: completed || false
            }
        });
        // Optionally create a submission record if we consider this a final submit attempt
        // Currently, Guppy frontend hits "saveProgress" even on partial writes/dimensions change.
        // We only record a submission if it was specifically a 'completed = true' request,
        // or we can just let it update the progress. We'll skip submission history for now 
        // unless explicitly needed by a separate endpoint.
        res.json({ success: true });
    }
    catch (err) {
        console.error('Save progress error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.saveProgress = saveProgress;
