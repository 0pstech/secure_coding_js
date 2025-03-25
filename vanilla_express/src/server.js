require('dotenv').config();
const app = require('./app');

const port = process.env.PORT || 8080;

// 서버 시작
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// 서버 종료 처리
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
}); 