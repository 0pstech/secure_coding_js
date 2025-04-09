const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth');

// Apply admin middleware to all routes
router.use(isAdmin);

// Admin dashboard
router.get('/', adminController.getDashboard);

// User management routes
router.get('/users', adminController.getUsers);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router; 