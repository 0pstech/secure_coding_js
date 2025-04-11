const authService = require('../services/authService');

const ipLoginAttempts = new Map();

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 1 * 60 * 1000;

function getClientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    return (forwarded ? forwarded.split(',')[0] : req.connection.remoteAddress)?.trim();
}

const authController = {
    // Handle login
    login: async (req, res) => {

        const ip = getClientIp(req);
        const now = Date.now();
        const attempt = ipLoginAttempts.get(ip);
            if (attempt && attempt.count >= MAX_ATTEMPTS && now - attempt.lastFailedAt < LOCK_TIME) {
            return res.status(429).json({ message: 'Too many login attempts. Try again later.' });
        }


        try {
            const { username, password } = req.body;
            const result = await authService.login(username, password);
            
            if (!result.success) {
                const now = Date.now();
                const attempt = ipLoginAttempts.get(ip);
                if (!attempt) {
                    ipLoginAttempts.set(ip, { count: 1, lastFailedAt: now});
                } else {
                    ipLoginAttempts.set(ip, { count: attempt.count + 1, lastFailedAt: now})
                }
                return res.status(401).json({message: 'username or password is incorrect'});
            }

            ipLoginAttempts.delete(ip);
            // Store token in cookie
            res.cookie('token', result.token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
                path: '/' // Cookie accessible from all paths
            });

            // Return user information
            res.json({
                message: 'Login successful',
                user: result.user
            });
        } catch (error) {
            res.status(500).json({ message: 'An error occurred during login.' });
        }
    },

    // Handle registration
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const isAdmin = false;
            await authService.register({ username, email, password, isAdmin });
            res.status(201).json({ message: 'Registration completed successfully.' });
        } catch (error) {
            console.error('Registration error:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Username or email already in use.' });
            } else if (error.code === 'PASSWORD_RULE_MISMATCH') {
                return res.status(400).json({ message: 'Password must be 15-64 chars. include uppercase, number, and special chars.' });
            } else if (error.name === 'ValidationError') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'An error occurred during registration.' });
        }
    },

    // Handle logout
    logout: (req, res) => {
        res.clearCookie('token');
        res.json({ message: 'Logged out successfully.' });
    },

    // Check login status
    checkAuth: async (req, res) => {
        try {
            const token = req.cookies.token;
            if (!token) {
                return res.json({ isLoggedIn: false });
            }

            const result = await authService.verifyToken(token);
            res.json(result);
        } catch (error) {
            console.error('Auth check error:', error);
            res.json({ isLoggedIn: false });
        }
    }
};

module.exports = authController; 