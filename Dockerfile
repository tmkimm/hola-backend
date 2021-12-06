# 베이스 이미지 지정
FROM node:16.11.1

# 앱 디렉터리 생성
WORKDIR /usr/src/app

# 캐싱을 위해 모듈 먼저 install
COPY package*.json ./
RUN npm install

# production 환경으로 설정
RUN npm ci --only=production
ENV NODE_ENV production

# COPY
COPY . .
RUN npm install -qq

# 포트 정의
EXPOSE 5000
# pm2 안쓰고 docker를 이용해서 자동 재시작 하도록 만들자
# https://stackoverflow.com/questions/51191378/what-is-the-point-of-using-pm2-and-docker-together
# pm2로 실행
RUN npm run build
CMD ["npm", "run", "start"]