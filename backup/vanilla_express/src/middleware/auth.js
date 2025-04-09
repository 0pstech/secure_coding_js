const jwt = require('jsonwebtoken');
const { auth } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Authentication middleware
const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.redirect('/auth/login');
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await auth.findUserById(decoded.id);
        
        if (!user) {
            return res.redirect('/auth/login');
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.redirect('/auth/login');
    }
};

// Admin role check middleware
const isAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(403).render('error', {
                title: 'Access Denied',
                message: 'You do not have permission to access this page.'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await auth.findUserById(decoded.id);
        
        if (!user || user.role !== 'admin') {
            return res.status(403).render('error', {
                title: 'Access Denied',
                message: 'You do not have permission to access this page.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Admin auth error:', error);
        res.status(403).render('error', {
            title: 'Access Denied',
            message: 'You do not have permission to access this page.'
        });
    }
};

module.exports = {
    isAuthenticated,
    isAdmin
}; 