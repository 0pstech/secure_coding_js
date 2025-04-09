const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');
const { isAuthenticated } = require('../middleware/auth');
const path = require('path');

// 게시판 페이지 라우트
router.get('/write', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'write.html'));
});

router.get('/post/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'post.html'));
});

// API 엔드포인트
router.get('/', boardController.getPosts);
router.get('/:id', boardController.getPost);
router.post('/', isAuthenticated, boardController.createPost);
router.put('/:id', isAuthenticated, boardController.updatePost);
router.delete('/:id', isAuthenticated, boardController.deletePost);

module.exports = router; 