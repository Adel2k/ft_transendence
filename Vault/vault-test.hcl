storage "file" {
  path = "/vault/data"
}

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = 1  # Only for development; never disable TLS in production
}

disable_mlock = true
ui = true
