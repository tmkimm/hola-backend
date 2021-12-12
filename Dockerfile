# 베이스 이미지 지정
FROM node:16.11.1

# 앱 디렉터리 생성
WORKDIR /usr/src/app

# 캐싱을 위해 모듈 먼저 install
COPY package*.json ./
RUN npm install -qq

# production 환경으로 설정
RUN npm ci --only=production
ENV NODE_ENV production

# COPY
COPY . .

# 포트 정의
EXPOSE 5000

RUN npm run build
CMD ["npm", "run", "start"]