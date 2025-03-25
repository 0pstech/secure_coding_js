FROM node:20-alpine

WORKDIR /app

# nodemon 전역 설치
RUN npm install -g nodemon

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

# 초기화 및 실행
CMD sh -c "sleep 10 && npm run init-db && npm run dev" 