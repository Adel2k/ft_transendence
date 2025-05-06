storage "file" {
  path    = "/vault/file"
}


listener "tcp" {
  address     = "0.0.0.0:8300"
  tls_disable = true
}

ui = true

api_addr = "http://localhost:8300"
disable_mlock = true
cluster_addr = "https://127.0.0.1:8301"
