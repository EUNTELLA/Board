# Build stage
FROM node:18-alpine as build

WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# React 앱 빌드
RUN npm run build

# Production stage - Nginx로 서빙
FROM nginx:alpine

# 빌드된 파일을 Nginx로 복사
COPY --from=build /app/build /usr/share/nginx/html

# Nginx 설정 파일 복사 (API 프록시 설정)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
