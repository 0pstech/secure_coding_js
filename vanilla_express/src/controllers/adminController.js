const adminService = require('../services/adminService');

const adminController = {
    // Get admin dashboard
    getDashboard: async (req, res) => {
        try {
            const stats = await adminService.getDashboardStats();
            res.render('admin/dashboard', { 
                title: 'Admin Dashboard',
                stats
            });
        } catch (error) {
            console.error('Dashboard error:', error);
            res.status(500).render('error', { 
                message: 'Error loading dashboard',
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    },

    // Get all users
    getUsers: async (req, res) => {
        try {
            const users = await adminService.getAllUsers();
            res.render('admin/users', { 
                title: 'User Management',
                users
            });
        } catch (error) {
            console.error('Get users error:', error);
            res.status(500).render('error', { 
                message: 'Error loading users',
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    },

    // Delete a user
    deleteUser: async (req, res) => {
        try {
            const userId = req.params.id;
            await adminService.deleteUser(userId);
            res.json({ success: true, message: 'User deleted successfully' });
        } catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error deleting user',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }
};

module.exports = adminController; 