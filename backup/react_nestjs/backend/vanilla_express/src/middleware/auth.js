const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const isAuthenticated = (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({ message: '로그인이 필요합니다.' });
        }

        // JWT 토큰 검증
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // req.user에 사용자 정보 설정
        req.user = {
            id: decoded.id,
            username: decoded.username
        };

        next();
    } catch (error) {
        console.error('인증 오류:', error);
        res.clearCookie('token');
        res.status(401).json({ message: '유효하지 않은 인증입니다.' });
    }
};

module.exports = {
    isAuthenticated
}; 