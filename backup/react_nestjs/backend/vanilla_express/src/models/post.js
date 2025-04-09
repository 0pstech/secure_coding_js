const db = require('../config/database');

class Post {
    static async create({ title, content, author, permission = 'public' }) {
        const [result] = await db.execute(
            'INSERT INTO posts (title, content, author, permission) VALUES (?, ?, ?, ?)',
            [title, content, author, permission]
        );
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await db.execute(
            'SELECT * FROM posts WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async findAll(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const [rows] = await db.execute(
            'SELECT * FROM posts ORDER BY created_at DESC LIMIT ?, ?',
            [offset, limit]
        );
        return rows;
    }

    static async update(id, { title, content, permission }) {
        const [result] = await db.execute(
            'UPDATE posts SET title = ?, content = ?, permission = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [title, content, permission, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM posts WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    static async count() {
        const [rows] = await db.execute('SELECT COUNT(*) as total FROM posts');
        return rows[0].total;
    }
}

module.exports = Post; 