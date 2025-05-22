#!/bin/bash

vault server -config=/vault/config &

sleep 5

vault operator unseal ${UNSEAL_KEY}

wait
