# Squids

This folder contains 1 project per squid. These are NPM projects and should not be considered as workspaces of the monorepo.
squid uses npm only, yarn is not supported.

## Generate a squid from an ABI

https://docs.subsquid.io/quickstart/quickstart-abi/

Generate and start indexer :

```bash
sqd init pb-auctionhouse-moonbase --template abi
cd pb-auctionhouse-moonbase
npm ci
# adjust address & from (block number)
sqd generate --address 0x89bE56Ce74C86eA90e429fBb98824aEf435C8e87 --abi ../../contracts/deployments/moonbase/AuctionHouse.json --archive https://moonbase-evm.archive.subsquid.io --event '*' --function '*' --from 4065903
sqd build
sqd up
sqd migration:generate
sqd process
```

Or Reset project for a new contract :

```bash
sqd down
rm -rf db
sqd build
sqd up
sqd migration:generate
sqd process

```

Serve graph API at http://localhost:4350/graphql :

```bash
sqd serve
```
