FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

WORKDIR /app/src

RUN npx prisma generate 

RUN mkdir -p ./prisma/images

WORKDIR /app

EXPOSE 3000

CMD ["node", "src/server.js"]