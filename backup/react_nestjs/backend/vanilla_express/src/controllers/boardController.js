const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'tlzbdj!@12',
    database: process.env.DB_NAME || 'secure_coding',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const boardController = {
    // 게시글 목록 조회
    getPosts: async (req, res) => {
        try {
            const [posts] = await pool.execute(`
                SELECT p.*, u.username as author_name 
                FROM posts p 
                JOIN users u ON p.author_id = u.id 
                ORDER BY p.created_at DESC
            `);
            res.json(posts);
        } catch (error) {
            console.error('Get posts error:', error);
            res.status(500).json({ message: '게시글 목록을 불러오는 중 오류가 발생했습니다.' });
        }
    },

    // 게시글 상세 조회
    getPost: async (req, res) => {
        try {
            const { id } = req.params;
            const [posts] = await pool.execute(`
                SELECT p.*, u.username as author_name 
                FROM posts p 
                JOIN users u ON p.author_id = u.id 
                WHERE p.id = ?
            `, [id]);

            if (posts.length === 0) {
                return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
            }

            res.json(posts[0]);
        } catch (error) {
            console.error('Get post error:', error);
            res.status(500).json({ message: '게시글을 불러오는 중 오류가 발생했습니다.' });
        }
    },

    // 게시글 작성
    createPost: async (req, res) => {
        try {
            const { title, content, permission } = req.body;
            const authorId = req.user.id;

            const [result] = await pool.execute(
                'INSERT INTO posts (title, content, author_id, permission) VALUES (?, ?, ?, ?)',
                [title, content, authorId, permission || 'public']
            );

            res.status(201).json({ 
                message: '게시글이 작성되었습니다.',
                postId: result.insertId 
            });
        } catch (error) {
            console.error('Create post error:', error);
            res.status(500).json({ message: '게시글 작성 중 오류가 발생했습니다.' });
        }
    },

    // 게시글 수정
    updatePost: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, content, permission } = req.body;
            const userId = req.user.id;

            // 게시글 작성자 확인
            const [posts] = await pool.execute(
                'SELECT author_id FROM posts WHERE id = ?',
                [id]
            );

            if (posts.length === 0) {
                return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
            }

            if (posts[0].author_id !== userId) {
                return res.status(403).json({ message: '게시글을 수정할 권한이 없습니다.' });
            }

            await pool.execute(
                'UPDATE posts SET title = ?, content = ?, permission = ? WHERE id = ?',
                [title, content, permission, id]
            );

            res.json({ message: '게시글이 수정되었습니다.' });
        } catch (error) {
            console.error('Update post error:', error);
            res.status(500).json({ message: '게시글 수정 중 오류가 발생했습니다.' });
        }
    },

    // 게시글 삭제
    deletePost: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            // 게시글 작성자 확인
            const [posts] = await pool.execute(
                'SELECT author_id FROM posts WHERE id = ?',
                [id]
            );

            if (posts.length === 0) {
                return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
            }

            if (posts[0].author_id !== userId) {
                return res.status(403).json({ message: '게시글을 삭제할 권한이 없습니다.' });
            }

            await pool.execute('DELETE FROM posts WHERE id = ?', [id]);
            res.json({ message: '게시글이 삭제되었습니다.' });
        } catch (error) {
            console.error('Delete post error:', error);
            res.status(500).json({ message: '게시글 삭제 중 오류가 발생했습니다.' });
        }
    }
};

module.exports = boardController; 