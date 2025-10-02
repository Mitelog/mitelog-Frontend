# 1단계 React 앱 빌드
FROM node:18 as build
WORKDIR app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# 2단계 Nginx로 정적 파일 제공
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD [nginx, -g, daemon off;]
