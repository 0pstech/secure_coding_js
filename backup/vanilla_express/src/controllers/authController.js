const authService = require('../services/authService');

const authController = {
    // Handle login
    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            const result = await authService.login(username, password);

            // Store token in cookie
            res.cookie('token', result.token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
                path: '/' // 모든 경로에서 쿠키 접근 가능
            });

            // Return user information
            res.json({
                message: 'Login successful',
                user: result.user
            });
        } catch (error) {
            console.error('Login error:', error);
            if (error.message === 'Username does not exist.' || error.message === 'Incorrect password.') {
                return res.status(401).json({ message: error.message });
            }
            res.status(500).json({ message: 'An error occurred during login.' });
        }
    },

    // Handle registration
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;
            await authService.register(username, email, password);
            res.status(201).json({ message: 'Registration completed successfully.' });
        } catch (error) {
            console.error('Registration error:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Username or email already in use.' });
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