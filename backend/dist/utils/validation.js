"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUsername = void 0;
const bad_words_1 = __importDefault(require("bad-words"));
const filter = new bad_words_1.default();
const RESERVED_USERNAMES = [
    'admin', 'administrator', 'root', 'system', 'guest', 'ghost', 'support',
    'api', 'www', 'null', 'undefined', 'owner', 'staff', 'moderator', 'mod',
    'developer', 'dev', 'guppy', 'test', 'profile', 'account', 'user',
];
const validateUsername = (username) => {
    if (!username)
        return 'Username is required';
    if (username.length < 3 || username.length > 20) {
        return 'Username must be between 3 and 20 characters';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return 'Username can only contain letters, numbers, and underscores';
    }
    if (RESERVED_USERNAMES.includes(username.toLowerCase())) {
        return 'This username is reserved and cannot be used';
    }
    if (filter.isProfane(username)) {
        return 'Please choose a more appropriate username';
    }
    return null;
};
exports.validateUsername = validateUsername;
