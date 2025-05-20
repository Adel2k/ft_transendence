FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install @fastify/static dotenv

COPY . .

COPY ./src/prisma ./prisma

WORKDIR /app/src

RUN mkdir -p ./prisma/images

WORKDIR /app
COPY load_secrets.sh .
RUN chmod +x load_secrets.sh

RUN apk add --no-cache curl jq && \
    curl -fsSL https://releases.hashicorp.com/vault/1.16.2/vault_1.16.2_linux_amd64.zip -o vault.zip && \
    unzip vault.zip && \
    mv vault /usr/local/bin/ && \
    chmod +x /usr/local/bin/vault && \
    rm vault.zip

EXPOSE 3000

CMD ["sh", "./load_secrets.sh"]
