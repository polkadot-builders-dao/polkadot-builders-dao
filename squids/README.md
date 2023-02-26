https://docs.subsquid.io/quickstart/quickstart-abi/

```bash
sqd init auctionhouse --template abi
cd auctionhouse
npm ci
npm install @subsquid/evm-processor@next
sqd generate --address 0xc6ff4cc65C48C7213d097254c5c6C586609e86DF --abi ../../contracts/deployments/moonbase/AuctionHouse.json --archive https://moonbase-evm.archive.subsquid.io --event '*' --function '*' --from 3782255
sqd build
sqd up
sqd migration:generate
sqd process
```

```bash
sqd serve
```
