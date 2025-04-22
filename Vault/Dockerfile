FROM hashicorp/vault:1.9.0

RUN apk add --no-cache bash curl

# Copy Vault configuration and scripts into the container
COPY vault-test.hcl /Vault/vault-test.hcl
COPY workflow-vault.sh /Vault/workflow-vault.sh

# Set execute permission on the script
RUN chmod +x /Vault/workflow-vault.sh

# Start Vault and run the script
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["/Vault/workflow-vault.sh"]
