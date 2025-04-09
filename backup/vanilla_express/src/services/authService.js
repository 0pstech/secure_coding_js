const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { auth } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // 24시간

const authService = {
    // 회원가입
    async register(userData) {
        try {
            const user = await auth.createUser(userData);
            return user;
        } catch (error) {
            throw error;
        }
    },

    // 로그인
    async login(username, password) {
        try {
            const user = await auth.findUserByUsername(username);
            if (!user) {
                throw new Error('User not found');
            }
            const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
            const isValid = await this.validatePassword(hashedPassword, user.password);
            if (!isValid) {
                throw new Error('Invalid password');
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

    // 토큰 검증
    async verifyToken(token) {
        try {
            if (!token) {
                return { isLoggedIn: false };
            }

            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await auth.findUserById(decoded.id);

            if (!user) {
                return { isLoggedIn: false };
            }

            return {
                isLoggedIn: true,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            };
        } catch (error) {
            return { isLoggedIn: false };
        }
    },

    // 비밀번호 변경
    async changePassword(userId, newPassword) {
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

    // 비밀번호 검증
    async validatePassword(inputPassword, hashedPassword) {
        return inputPassword === hashedPassword;
    },
};

module.exports = authService; 