const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const { isAuthenticated } = require('../middleware/auth');

// 게시글 목록 조회
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const posts = await Post.findAll(page);
        const total = await Post.count();
        res.json({ posts, total, currentPage: page });
    } catch (error) {
        console.error('게시글 목록 조회 실패:', error);
        res.status(500).json({ message: '게시글 목록 조회 중 오류가 발생했습니다.' });
    }
});

// 게시글 상세 조회
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }
        res.json(post);
    } catch (error) {
        console.error('게시글 상세 조회 실패:', error);
        res.status(500).json({ message: '게시글 상세 조회 중 오류가 발생했습니다.' });
    }
});

// 게시글 작성
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const { title, content, permission } = req.body;
        const postId = await Post.create({
            title,
            content,
            author: req.session.user.username,
            permission
        });
        res.status(201).json({ id: postId, message: '게시글이 작성되었습니다.' });
    } catch (error) {
        console.error('게시글 작성 실패:', error);
        res.status(500).json({ message: '게시글 작성 중 오류가 발생했습니다.' });
    }
});

// 게시글 수정
router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }
        if (post.author !== req.session.user.username) {
            return res.status(403).json({ message: '게시글 수정 권한이 없습니다.' });
        }
        const { title, content, permission } = req.body;
        const success = await Post.update(req.params.id, { title, content, permission });
        if (success) {
            res.json({ message: '게시글이 수정되었습니다.' });
        } else {
            res.status(500).json({ message: '게시글 수정에 실패했습니다.' });
        }
    } catch (error) {
        console.error('게시글 수정 실패:', error);
        res.status(500).json({ message: '게시글 수정 중 오류가 발생했습니다.' });
    }
});

// 게시글 삭제
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }
        if (post.author !== req.session.user.username) {
            return res.status(403).json({ message: '게시글 삭제 권한이 없습니다.' });
        }
        const success = await Post.delete(req.params.id);
        if (success) {
            res.json({ message: '게시글이 삭제되었습니다.' });
        } else {
            res.status(500).json({ message: '게시글 삭제에 실패했습니다.' });
        }
    } catch (error) {
        console.error('게시글 삭제 실패:', error);
        res.status(500).json({ message: '게시글 삭제 중 오류가 발생했습니다.' });
    }
});

module.exports = router; 