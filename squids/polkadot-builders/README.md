# Subsquid for Polkadot Builders

## deploy to moonbase/moonbeam

IMPORTANT : run commands from this project's folder

```bash
# MOONBASE (TESTNET)
sqd deploy . -m squid-moonbase.yaml

# MOONBEAM
sqd deploy . -m squid-moonbeam.yaml
```

Frontend is using the [production alias](https://docs.subsquid.io/deploy-squid/promote-to-production/).

To update, use the `sqd prod` command :

```bash
# MOONBASE (TESTNET) using v2
sqd prod polkadot-builders-moonbase@v2

# MOONBEAM using v3
sqd prod polkadot-builders@v3
```
