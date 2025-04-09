const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');

// Home page
router.get('/', (req, res) => {
    res.render('index', { 
        title: 'Home',
        user: req.user 
    });
});

module.exports = router; 