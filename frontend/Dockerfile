FROM node:18-alpine AS build

WORKDIR /app

COPY package.json ./

RUN npm install

RUN npm install tailwindcss  tailwindcss-textshadow 
RUN npm install postcss autoprefixer
RUN npm install babylonjs @babylonjs/core @babylonjs/gui @babylonjs/loaders


COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html/

COPY ./default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
