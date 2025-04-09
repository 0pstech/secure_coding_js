const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');

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

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // 24시간

const authController = {
    // 로그인 처리
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            const [users] = await pool.execute(
                'SELECT * FROM users WHERE username = ?',
                [username]
            );

            if (users.length === 0) {
                return res.status(401).json({ message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
            }

            const user = users[0];
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({ message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
            }

            // JWT 토큰 생성
            const token = jwt.sign(
                { id: user.id, username: user.username },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            // 쿠키에 토큰 저장
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: COOKIE_MAX_AGE,
                sameSite: 'strict'
            });

            // 사용자 정보 반환
            res.json({
                message: '로그인 성공',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });
        } catch (error) {
            console.error('로그인 오류:', error);
            res.status(500).json({ message: '로그인 중 오류가 발생했습니다.' });
        }
    },

    // 회원가입 처리
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            // 비밀번호 해시화
            const hashedPassword = await bcrypt.hash(password, 10);

            // 사용자 생성
            await pool.execute(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [username, email, hashedPassword]
            );

            res.status(201).json({ message: '회원가입이 완료되었습니다.' });
        } catch (error) {
            console.error('회원가입 오류:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: '이미 사용 중인 아이디 또는 이메일입니다.' });
            }
            res.status(500).json({ message: '회원가입 중 오류가 발생했습니다.' });
        }
    },

    // 로그아웃 처리
    logout: (req, res) => {
        res.clearCookie('token');
        res.json({ message: '로그아웃되었습니다.' });
    },

    // 로그인 상태 확인
    checkAuth: (req, res) => {
        const token = req.cookies.token;
        
        if (!token) {
            return res.json({ isLoggedIn: false });
        }

        try {
            // 토큰 검증
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // 검증된 사용자 정보 반환
            res.json({
                isLoggedIn: true,
                user: {
                    id: decoded.id,
                    username: decoded.username
                }
            });
        } catch (error) {
            console.error('인증 확인 오류:', error);
            res.clearCookie('token'); // 유효하지 않은 토큰은 제거
            res.json({ isLoggedIn: false });
        }
    }
};

module.exports = authController; 