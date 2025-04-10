const jwt = require('jsonwebtoken');
const { userModel } = require('../models/user');

// Verify JWT token and set user
const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.redirect('/auth/login');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.getUserById(decoded.id);
        
        if (!user) {
            res.clearCookie('token');
            return res.redirect('/auth/login');
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.clearCookie('token');
        res.redirect('/auth/login');
    }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
    console.log('Checking admin status for user:', req.user);
    if (!req.user || !req.user.is_admin) {
        console.log('Access denied. User is not admin:', req.user);
        return res.status(403).render('error', {
            title: 'Access Denied',
            message: 'You do not have permission to access this page'
        });
    }
    console.log('User is admin:', req.user);
    next();
};

module.exports = {
    isAuthenticated,
    isAdmin
}; 