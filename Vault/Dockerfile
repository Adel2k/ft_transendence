FROM hashicorp/vault:latest

USER root

RUN apk add --no-cache bash curl

# Create directories
RUN mkdir -p /vault/config /vault/scripts

# Copy config and script files
COPY vault-test.hcl /vault/config/vault-test.hcl
COPY workflow-vault.sh /vault/scripts/workflow-vault.sh

# Make the script executable
RUN chmod +x /vault/scripts/workflow-vault.sh

# Set working directory to scripts folder
WORKDIR /vault/scripts

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["./workflow-vault.sh"]
