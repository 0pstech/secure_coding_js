const pool = require('../config/database');

const postModel = {
    // 모든 게시글 조회
    async getAllPosts() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`
                SELECT p.*, u.username as author_name
                FROM posts p
                LEFT JOIN users u ON p.author_id = u.id
                ORDER BY p.created_at DESC
            `);
            return rows;
        } finally {
            connection.release();
        }
    },

    // 특정 게시글 조회
    async getPostById(id) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`
                SELECT p.*, u.username as author_name
                FROM posts p
                LEFT JOIN users u ON p.author_id = u.id
                WHERE p.id = ?
            `, [id]);
            return rows[0] || null;
        } finally {
            connection.release();
        }
    },

    // 게시글 생성
    async createPost({ title, content, permission, author_id }) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query(`
                INSERT INTO posts (title, content, permission, author_id)
                VALUES (?, ?, ?, ?)
            `, [title, content, permission, author_id]);
            return result.insertId;
        } finally {
            connection.release();
        }
    },

    // 게시글 수정
    async updatePost(id, { title, content, permission }) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query(`
                UPDATE posts
                SET title = ?, content = ?, permission = ?
                WHERE id = ?
            `, [title, content, permission, id]);
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    },

    // 게시글 삭제
    async deletePost(id) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query(`
                DELETE FROM posts
                WHERE id = ?
            `, [id]);
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }
};

module.exports = postModel; 