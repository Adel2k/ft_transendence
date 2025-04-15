FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install tailwindcss-textshadow
# RUN npm install @babylonjs/core@6.36.0 @babylonjs/gui@6.36.0 @babylonjs/loaders@6.36.0
# RUN npm install typescript@5.3.3 --save-dev
# RUN npm uninstall @types/dom-webcodecs

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/index.html /usr/share/nginx/html/
COPY --from=build /app/dist /usr/share/nginx/html/dist

COPY ./default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
