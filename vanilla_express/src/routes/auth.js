const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// 로그인 상태 확인
router.get('/status', (req, res) => {
    if (req.session.user) {
        res.json({
            isLoggedIn: true,
            username: req.session.user.username
        });
    } else {
        res.json({
            isLoggedIn: false,
            username: null
        });
    }
});

// 회원가입
router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // 입력값 검증
        if (!username || !password || !email) {
            return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        // 사용자 생성
        await User.create({
            username,
            password: hashedPassword,
            email
        });

        res.status(201).json({ message: '회원가입이 완료되었습니다.' });
    } catch (error) {
        console.error('회원가입 실패:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ message: '이미 사용 중인 사용자명 또는 이메일입니다.' });
        } else {
            res.status(500).json({ message: '회원가입 중 오류가 발생했습니다.' });
        }
    }
});

// 로그인
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 입력값 검증
        if (!username || !password) {
            return res.status(400).json({ message: '사용자명과 비밀번호를 입력해주세요.' });
        }

        // 사용자 조회
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(401).json({ message: '잘못된 사용자명 또는 비밀번호입니다.' });
        }

        // 비밀번호 확인
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: '잘못된 사용자명 또는 비밀번호입니다.' });
        }

        // 세션에 사용자 정보 저장
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        res.json({ message: '로그인되었습니다.' });
    } catch (error) {
        console.error('로그인 실패:', error);
        res.status(500).json({ message: '로그인 중 오류가 발생했습니다.' });
    }
});

// 로그아웃
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('로그아웃 실패:', err);
            res.status(500).json({ message: '로그아웃 중 오류가 발생했습니다.' });
        } else {
            res.json({ message: '로그아웃되었습니다.' });
        }
    });
});

module.exports = router; 