FROM node:18-alpine

WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci --only=production

# 소스 코드 복사
COPY . .

# NestJS CLI 전역 설치
RUN npm install -g @nestjs/cli

# TypeScript 컴파일
RUN npm run build 2>/dev/null || nest build

# 포트 노출
EXPOSE 3001

# 애플리케이션 실행
CMD ["node", "dist/main"]
