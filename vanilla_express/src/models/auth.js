const pool = require('../config/database');
const crypto = require('crypto');

// User creation (registration)
async function createUser({ username, email, password, isAdmin = false }) {
    try {
        // Check username availability
        const usernameCheck = await checkUsername(username);
        if (usernameCheck) {
            return { success: false, message: 'Username already exists' };
        }
        
        // Hash password using crypto
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        
        // Create user
        // **VULNERABLE CODE**: Directly concatenating user input into the query
        const sqlQuery = `INSERT INTO users (username, password, email, is_admin) VALUES ('${username}', '${hashedPassword}', '${email}', ${isAdmin})`;
        console.log('[VULNERABLE CODE] SQL Query:', sqlQuery);
        
        return { 
            success: true, 
            id: result.insertId,
            username,
            email
        };
    } catch (error) {
        console.error('Error creating user:', error);
        return { success: false, message: 'Database error' };
    }
}

// User lookup (login)
async function findUserByUsername(username) {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        return rows[0];
    } catch (error) {
        console.error('Error finding user:', error);
        return null;
    }
}

// Get user by ID
async function getUserById(id) {
    try {
        const [rows] = await pool.query(
            'SELECT id, username, email, is_admin, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    } catch (error) {
        console.error('Error getting user by ID:', error);
        return null;
    }
}

// Change password
async function updatePassword(userId, newPassword) {
    try {
        const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');
        const [result] = await pool.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, userId]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error updating password:', error);
        return false;
    }
}

async function checkUsername(username) {
    try {
        const [rows] = await pool.query(
            'SELECT id FROM users WHERE username = ?',
            [username]
        );
        return rows.length > 0;
    } catch (error) {
        console.error('Error checking username:', error);
        return true; // Return true on error to prevent registration
    }
}

module.exports = {
    createUser,
    findUserByUsername,
    getUserById,
    updatePassword,
    checkUsername
}; 