const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const path = require('path');

// 로그인 페이지
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

// 회원가입 페이지
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'register.html'));
});

// 로그인 상태 확인
router.get('/check', authController.checkAuth);

// 로그인
router.post('/login', authController.login);

// 회원가입
router.post('/register', authController.register);

// 로그아웃
router.post('/logout', authController.logout);

module.exports = router; 