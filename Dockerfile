# 1단계: Vite 빌드
FROM node:20 AS build
WORKDIR /app

# package.json 및 lock 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 나머지 소스 복사
COPY . .

# Vite 빌드 (출력: /dist)
RUN npm run build

# 2단계: Nginx로 정적 파일 제공
FROM nginx:alpine

# Vite 결과물을 Nginx 경로로 복사
COPY --from=build /app/dist /usr/share/nginx/html

# (선택) 커스텀 Nginx 설정 적용
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
