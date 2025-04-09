const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login page
router.get('/login', (req, res) => {
    res.render('login', { 
        title: 'Login',
        user: req.user
    });
});

// Registration page
router.get('/register', (req, res) => {
    res.render('register', { 
        title: 'Register',
        user: req.user
    });
});

// Check login status
router.get('/check', authController.checkAuth);

// Login
router.post('/login', authController.login);

// Register
router.post('/register', authController.register);

// Logout
router.post('/logout', authController.logout);

module.exports = router; 