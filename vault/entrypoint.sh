#!/bin/bash

vault server -config=/vault/config &

sleep 5

vault operator unseal /Li+SkCp+nopkQMMBEPQTNaAyN+WYa5XACcPLCvtgC0=

wait
