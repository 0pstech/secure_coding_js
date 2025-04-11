const pool = require('../config/database');

// Get all posts
async function getAllPosts() {
    try {
        const [rows] = await pool.query(`
            SELECT p.*, u.username as author_name 
            FROM posts p
            LEFT JOIN users u ON p.author_id = u.id
            ORDER BY p.created_at DESC
        `);
        return rows;
    } catch (error) {
        console.error('Error in postModel.getAllPosts:', error);
        throw error;
    }
}

// VULNERABLE TO SQL INJECTION / TYPE ERRORS FOR EDUCATIONAL PURPOSES
async function getPostById(id) {
    try {
        // prepared statement/parameterized query
        const [rows] = await pool.query(`
            SELECT p.*, u.username as author_name 
            FROM posts p
            LEFT JOIN users u ON p.author_id = u.id
            WHERE p.id = ?
        `, [id]);

        return rows[0]; // May return no result
    } catch (error) {
        console.error('Error in VULNERABLE getPostById:', error);
        // Re-throw the error so it can be caught by the route handler's catch block
        throw error;
    }
}

// Create post
async function createPost({ title, content, permission, author_id }) {
    try {
        const [result] = await pool.query(`
            INSERT INTO posts (title, content, permission, author_id) 
            VALUES (?, ?, ?, ?)
        `, [title, content, permission, author_id]);
        return result.insertId;
    } catch (error) {
        console.error('Error in postModel.createPost:', error);
        throw error;
    }
}

// Update post
async function updatePost(id, { title, content, permission }) {
    try {
        const [result] = await pool.query(`
            UPDATE posts 
            SET title = ?, content = ?, permission = ?, updated_at = NOW()
            WHERE id = ?
        `, [title, content, permission, id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error in postModel.updatePost:', error);
        throw error;
    }
}

// Delete post
async function deletePost(id) {
    try {
        const [result] = await pool.query('DELETE FROM posts WHERE id = ?', [id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error in postModel.deletePost:', error);
        throw error;
    }
}

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
}; 