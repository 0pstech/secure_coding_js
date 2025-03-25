const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
    let connection;
    try {
        // MySQL 연결
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT
        });

        // 데이터베이스 생성
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log(`데이터베이스 ${process.env.DB_NAME} 생성 완료`);

        // 데이터베이스 선택
        await connection.query(`USE ${process.env.DB_NAME}`);

        // users 테이블 생성
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('users 테이블 생성 완료');

        // posts 테이블 생성
        await connection.query(`
            CREATE TABLE IF NOT EXISTS posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(200) NOT NULL,
                content TEXT NOT NULL,
                author VARCHAR(50) NOT NULL,
                permission ENUM('public', 'private') DEFAULT 'public',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (author) REFERENCES users(username) ON DELETE CASCADE
            )
        `);
        console.log('posts 테이블 생성 완료');

        // 테스트 사용자 생성
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        try {
            await connection.query(
                'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
                ['admin', hashedPassword, 'admin@example.com']
            );
            console.log('테스트 사용자 생성 완료');

            // 초기 게시글 생성
            const samplePosts = [
                {
                    title: '게시판 이용 안내',
                    content: '게시판 이용에 대한 안내사항입니다.\n\n1. 모든 게시글은 로그인 후 작성 가능합니다.\n2. 자신의 게시글만 수정/삭제가 가능합니다.\n3. 비공개 게시글은 작성자만 볼 수 있습니다.',
                    author: 'admin',
                    permission: 'public'
                },
                {
                    title: '환영합니다!',
                    content: '게시판에 오신 것을 환영합니다.\n\n많은 이용 부탁드립니다.',
                    author: 'admin',
                    permission: 'public'
                },
                {
                    title: '비밀 게시글입니다',
                    content: '이 게시글은 비공개로 설정되어 있습니다.',
                    author: 'admin',
                    permission: 'private'
                },
                {
                    title: '게시판 규칙',
                    content: '게시판 이용 규칙입니다.\n\n1. 타인을 비방하는 게시글은 금지합니다.\n2. 스팸성 게시글은 삭제될 수 있습니다.\n3. 적절한 카테고리에 게시글을 작성해주세요.',
                    author: 'admin',
                    permission: 'public'
                },
                {
                    title: '공지사항',
                    content: '중요한 공지사항입니다.\n\n게시판 점검 예정: 2024년 3월 1일 새벽 2시 ~ 4시',
                    author: 'admin',
                    permission: 'public'
                }
            ];

            for (const post of samplePosts) {
                await connection.query(
                    'INSERT INTO posts (title, content, author, permission) VALUES (?, ?, ?, ?)',
                    [post.title, post.content, post.author, post.permission]
                );
            }
            console.log('초기 게시글 생성 완료');
        } catch (error) {
            if (error.code !== 'ER_DUP_ENTRY') {
                throw error;
            }
        }

        // 생성된 테이블 목록 조회
        const [tables] = await connection.query('SHOW TABLES');
        console.log('생성된 테이블 목록:', tables.map(table => Object.values(table)[0]));

    } catch (error) {
        console.error('데이터베이스 초기화 중 오류 발생:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

initializeDatabase(); 