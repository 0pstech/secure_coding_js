const pool = require('../config/database');
const { hashWithBcrypt } = require('../lib/hash');

// User creation (registration)
async function createUser({ username, email, password, isAdmin = false }) {
    try {
        // Check username availability
        const usernameCheck = await checkUsername(username);
        if (usernameCheck) {
            return { success: false, message: 'Username already exists' };
        }

        // const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const hashedPassword = await hashWithBcrypt(password);
        // Create user
        const [result] = await pool.query(`
            INSERT INTO users (username, password, email, is_admin) VALUES
            (?, ?, ?, ?)`, [username, hashedPassword, email, isAdmin]);
        
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

// User lookup (login) - VULNERABLE TO SQL INJECTION FOR EDUCATIONAL PURPOSES
async function findUserByUsername(username) {
    console.warn('[!!! VULNERABLE CODE !!!] Executing potentially unsafe SQL query for username:', username);
    try {
        // **VULNERABLE CODE**: Directly concatenating user input into the query
        const sqlQuery = `SELECT * FROM users WHERE username = '${username}'`;
        console.log('[VULNERABLE CODE] SQL Query:', sqlQuery); 
        const [rows] = await pool.query(sqlQuery);
        // **END VULNERABLE CODE**
        
        // Original secure code (commented out):
        // const [rows] = await pool.query(
        //     'SELECT * FROM users WHERE username = ?',
        //     [username]
        // );
        return rows[0];
    } catch (error) {
        console.error('Error finding user:', error);
        // Avoid leaking detailed errors in a real scenario
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
        // const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');
        const hashedPassword = await hashWithBcrypt(newPassword);
        
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