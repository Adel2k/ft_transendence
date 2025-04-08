FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

WORKDIR /app/src

RUN npx prisma generate 

WORKDIR /app

EXPOSE 3000

CMD ["node", "src/server.js"]