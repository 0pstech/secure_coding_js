const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { userModel } = require('../models/user');
    
// Admin dashboard
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            users,
            user: req.user
        });
    } catch (error) {
        console.error('Error in GET /admin:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Failed to load admin dashboard'
        });
    }
});

// Delete user
router.delete('/users/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Prevent deleting yourself
        if (userId === req.user.id) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        const success = await userModel.deleteUser(userId);
        if (!success) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error in DELETE /admin/users/:id:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router; 