const { userModel } = require('../models/user');

const adminService = {
    // Get dashboard statistics
    getDashboardStats: async () => {
        try {
            const totalUsers = await userModel.countDocuments();
            const recentUsers = await userModel.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select('username email createdAt');
            
            return {
                totalUsers,
                recentUsers
            };
        } catch (error) {
            console.error('Error getting dashboard stats:', error);
            throw error;
        }
    },

    // Get all users
    getAllUsers: async () => {
        try {
            return await userModel.find()
                .select('username email role createdAt lastLogin')
                .sort({ createdAt: -1 });
        } catch (error) {
            console.error('Error getting users:', error);
            throw error;
        }
    },

    // Delete a user
    deleteUser: async (userId) => {
        try {
            const user = await userModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            
            // Prevent deleting admin users
            if (req.user.is_admin) {
                throw new Error('Cannot delete admin users');
            }
            
            await userModel.findByIdAndDelete(userId);
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }
};

module.exports = adminService; 