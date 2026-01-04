# Backend

## Generating key pairs

PowerSync requires a private/public key pair for authentication and JWT signing.

Create private key

```
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:4096 -out powersync.private.pem
```

Create public key

```
openssl rsa -in powersync.private.pem -pubout -out powersync.public.pem
```

Encode as base 64 for .env

```
base64 -b 0 -i powersync.private.pem
base64 -b 0 -i powersync.public.pem
```
