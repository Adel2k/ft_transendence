# === Stage 1: Build ===
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
ENV NODE_ENV=development
RUN npm install
COPY . .
RUN npm run build

# === Stage 2: Build ===
FROM nginx:alpine

COPY --from=build /app/index.html /usr/share/nginx/html/
COPY --from=build /app/dist /usr/share/nginx/html/dist
COPY --from=build /app/public /usr/share/nginx/html/public

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
