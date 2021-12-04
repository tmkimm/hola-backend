FROM node:16.11.1

# 앱 디렉터리 생성
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# pm2 설치
RUN npm install -g pm2 

RUN npm ci --only=production
ENV NODE_ENV production

COPY . .

EXPOSE 5000

RUN npm run build

CMD ["pm2-runtime", "start", "pm2.config.js"]