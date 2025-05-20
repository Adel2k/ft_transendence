#!/bin/sh

export VAULT_ADDR=http://vault:8300
export VAULT_TOKEN=hvs.CFMt8PNsCMuNfYnsTZBulKUG

echo "Fetching secrets from $VAULT_ADDR"

SECRET_JSON=$(curl -s --header "X-Vault-Token: $VAULT_TOKEN" "$VAULT_ADDR/v1/secret/data/transcendence")

echo "Vault response: $SECRET_JSON"
echo "---------------------------"

echo "DATABASE_URL=$(echo $SECRET_JSON | jq -r '.data.data.DATABASE_URL')" > .env
echo "JWT_SECRET=$(echo $SECRET_JSON | jq -r '.data.data.JWT_SECRET')" >> .env
echo "DEFAULT_AVATAR=$(echo $SECRET_JSON | jq -r '.data.data.DEFAULT_AVATAR')" >> .env
echo "HTTPS_CERT=$(echo $SECRET_JSON | jq -r '.data.data.HTTPS_CERT')" >> .env
echo "HTTPS_KEY=$(echo $SECRET_JSON | jq -r '.data.data.HTTPS_KEY')" >> .env
echo "JWT_EXPIRES_IN=$(echo $SECRET_JSON | jq -r '.data.data.JWT_EXPIRES_IN')" >> .env
echo "GOOGLE_CLIENT_ID=$(echo $SECRET_JSON | jq -r '.data.data.GOOGLE_CLIENT_ID')" >> .env

npx prisma generate
npx prisma migrate deploy

mkdir -p ./prisma/images

export $(cat .env | xargs) && node src/server.js

