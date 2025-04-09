const pool = require('../config/database');
const crypto = require('crypto');

const authModel = {
    // 사용자 생성 (회원가입)
    async createUser({ username, password, email }) {
        const connection = await pool.getConnection();
        try {
            // 사용자명 중복 체크
            const [existingUsers] = await connection.query(
                'SELECT id FROM users WHERE username = ?',
                [username]
            );

            if (existingUsers.length > 0) {
                throw new Error('Username already exists');
            }
            // 비밀번호 해시화
            const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

            // 사용자 생성
            const [result] = await connection.query(
                'INSERT INTO users (username, password, email, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
                [username, hashedPassword, email]
            );

            return {
                id: result.insertId,
                username,
                email
            };
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    },

    // 사용자 조회 (로그인)
    async findUserByUsername(username) {
        const connection = await pool.getConnection();
        try {
            const [users] = await connection.query(
                'SELECT * FROM users WHERE username = ?',
                [username]
            );

            return users[0] || null;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    },

    // 사용자 ID로 조회
    async findUserById(id) {
        const connection = await pool.getConnection();
        try {
            const [users] = await connection.query(
                'SELECT id, username, email, created_at FROM users WHERE id = ?',
                [id]
            );

            return users[0] || null;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    },

    // 비밀번호 변경
    async updatePassword(userId, newPassword) {
        const connection = await pool.getConnection();
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const [result] = await connection.query(
                'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
                [hashedPassword, userId]
            );

            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }
};

module.exports = authModel; 