FROM hashicorp/vault:latest

RUN apk add --no-cache bash

RUN apk update && apk add curl

COPY vault-test.hcl /Vault/vault-test.hcl

COPY workflow-vault.sh /Vault/workflow-vault.sh

RUN chmod +x /Vault/workflow-vault.sh

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["./Vault/workflow-vault.sh"]