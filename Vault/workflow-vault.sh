#!/usr/bin/env bash

# Start vault in background
vault server -config vault-test.hcl 

# Wait for it to start
until curl -s http://127.0.0.1:8200/v1/sys/health; do
  echo "Waiting for Vault to start..."
  sleep 2
done

export VAULT_ADDR='http://127.0.0.1:8200'
export VAULT_SKIP_VERIFY='true'

# Init Vault
vault operator init -key-shares=3 -key-threshold=2 > generated_keys.txt

mapfile -t keyArray < <(grep "Unseal Key " generated_keys.txt | cut -c15-)

vault operator unseal "${keyArray[0]}"
vault operator unseal "${keyArray[1]}"

mapfile -t rootToken < <(grep "Initial Root Token: " generated_keys.txt | cut -c21-)
echo "${rootToken[0]}" > root_token.txt
export VAULT_TOKEN="${rootToken[0]}"

vault secrets enable -version=1 kv
vault auth enable userpass
vault policy write spring-policy spring-policy.hcl
vault write auth/userpass/users/admin password="${SECRET_PASS}" policies=spring-policy
vault kv put kv/my-secret my-value=s3cr3t
