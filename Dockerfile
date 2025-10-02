# 1단계 React 앱 빌드
FROM node:18 as build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# 2단계 Nginx로 정적 파일 제공
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
# 👉 커스텀 Nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]