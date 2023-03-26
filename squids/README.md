# Squids

This folder contains 1 project per squid. These are NPM projects and should not be considered as workspaces of the monorepo.
squid uses npm only, yarn is not supported.

## Generate a squid from an ABI

https://docs.subsquid.io/quickstart/quickstart-abi/

Generate and start indexer :

```bash
sqd init auctionhouse --template abi
cd auctionhouse
npm ci
# adjust address & from (block number)
sqd generate --address 0xed51a10D1423C5f10241E313aB7c34657b905b60 --abi ../../contracts/deployments/moonbase/AuctionHouse.json --archive https://moonbase-evm.archive.subsquid.io --event '*' --function '*' --from 3832215
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
