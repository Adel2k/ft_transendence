FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install --save-dev vite
RUN npm install tailwindcss  tailwindcss-textshadow tailwind-scrollbar
RUN npm install @tailwindcss/postcss7-compat
RUN npm install postcss@latest postcss-nested@latest autoprefixer@latest
RUN npm install babylonjs @babylonjs/core @babylonjs/gui @babylonjs/loaders


COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html/

COPY ./default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
