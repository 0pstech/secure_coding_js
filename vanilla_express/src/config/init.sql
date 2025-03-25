-- 사용자 권한 설정
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'password';
ALTER USER 'user'@'%' IDENTIFIED WITH mysql_native_password BY 'password';

-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS secure_coding CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE secure_coding;

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 게시글 테이블
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_id INT NOT NULL,
    permission ENUM('public', 'private') DEFAULT 'public',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- 세션 테이블
CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(128) NOT NULL PRIMARY KEY,
    expires INT NOT NULL,
    data TEXT
);

-- 테스트 사용자 생성 (비밀번호: test123)
INSERT INTO users (username, password, email) VALUES 
('test', '$2a$10$YourHashedPasswordHere', 'test@example.com')
ON DUPLICATE KEY UPDATE username=username;

-- 테스트 게시글 생성
INSERT INTO posts (title, content, author_id, permission) VALUES 
('테스트 게시글 1', '이것은 테스트 게시글입니다.', 1, 'public'),
('테스트 게시글 2', '이것은 두 번째 테스트 게시글입니다.', 1, 'public')
ON DUPLICATE KEY UPDATE title=title; 