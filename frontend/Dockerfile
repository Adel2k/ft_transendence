# === Stage 1: Build ===
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
ENV NODE_ENV=development
RUN npm install
RUN npm install tailwindcss-textshadow
COPY . .
RUN npm run build

# === Stage 2: Build ===
FROM nginx:alpine

COPY --from=build /app/index.html /usr/share/nginx/html/
COPY --from=build /app/dist /usr/share/nginx/html/dist
RUN  mkdir -p /usr/share/nginx/html/image/ && chmod 777 /usr/share/nginx/html/image/

COPY ./default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
