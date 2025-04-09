const fs = require('fs');
const path = require('path');

const models = {};

// 현재 디렉토리의 모든 파일을 읽어옴
fs.readdirSync(__dirname)
    .filter(file => {
        // index.js와 .js로 끝나는 파일만 필터링
        return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        // 파일 이름에서 .js 확장자를 제거하여 모델 이름으로 사용
        const modelName = file.replace('.js', '');
        // 모델 파일을 require하여 models 객체에 추가
        models[modelName] = require(path.join(__dirname, file));
    });

module.exports = models;
