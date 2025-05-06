FROM hashicorp/vault:latest

COPY ./vault-config.hcl /vault/config/vault-config.hcl

RUN mkdir -p /vault/file /vault/data
RUN chown -R 1000:1000 /vault/file && chmod -R 700 /vault/file

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/bin/sh", "/entrypoint.sh"]
