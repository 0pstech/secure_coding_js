const { verifyWithBcrypt } = require('../lib/hash');

const jwt = require('jsonwebtoken');
const { auth } = require('../models');
const { isValidUsername, isValidEmail } = require('../lib/validator');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

class ValidationError extends Error {
    constructor(message, code = 'VALIDATION_ERROR') {
      super(message);
      this.name = 'ValidationError';
      this.code = code;
      this.status = 400;
    }
  }

const authService = {
    // Registration
    async register(userData) {

        // whitelist - accept only allowed data
        // blacklist - block some pattern 
        
        // userData validation
        if (!isValidUsername(userData.username)) {
            throw new ValidationError('Invalid username', 'INVALID_USERNAME');
        }

        if (!isValidEmail(userData.email)) {
            throw new ValidationError('Invalid email', 'INVALID_EMAIL');
        }

        const password = userData.password;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{15,64}$/;

        // password length & complexity check
        // return 400 Bad request 
        if (!passwordRegex.test(password)) {
            const error = new Error();
            error.code = 'PASSWORD_RULE_MISMATCH';
            throw error;
        }

        try {
            const user = await auth.createUser(userData);
            return user;
        } catch (error) {
            throw error;
        }
    },

    // Login
    async login(username, password) {
        console.log(`[authService/login] Attempting login for user: ${username}`);
        try {
            const user = await auth.findUserByUsername(username);
            if (!user) {
                console.log(`[authService/login] User not found - ${username}`);
                return { success: false, reason: 'User not found' };
            }
            console.log(`[authService/login] Found user: ${username}, Stored hash: ${user.password}`);
            console.log(`[authService/login] Password provided for comparison: ${password}`);

            const isValid = await verifyWithBcrypt(password, user.password);
            console.log(`[authService/login] Password validation result for ${username}: ${isValid}`);

            if (!isValid) {
                console.log(`[authService/login] Incorrect Password - ${username}`);
                return { success: false, reason: 'Incorrect Password' };
            }

            const token = jwt.sign(
                { 
                    id: user.id, 
                    email: user.email 
                }, 
                JWT_SECRET, 
                { expiresIn: '24h' }
            );

            return {
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                },
                token,
                maxAge: COOKIE_MAX_AGE
            };
        } catch (error) {
            throw error;
        }
    },

    // Token verification
    async verifyToken(token) {
        try {
            if (!token) {
                return { isLoggedIn: false };
            }

            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await auth.getUserById(decoded.id);

            if (!user) {
                return { isLoggedIn: false };
            }

            return {
                isLoggedIn: true,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    is_admin: user.is_admin
                }
            };
        } catch (error) {
            console.error('Token verification error:', error);
            return { isLoggedIn: false };
        }
    },

    // Password change
    async changePassword(userId, currentPassword, newPassword) {
        try {
            const success = await auth.updatePassword(userId, newPassword);
            if (!success) {
                throw new Error('Failed to update password');
            }
            return { message: 'Password updated successfully' };
        } catch (error) {
            throw error;
        }
    },
};

module.exports = authService; 