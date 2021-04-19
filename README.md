# Obyte Assets Ledger (obyte-assets-ledger)

General Notes and System Requirements

## System Requirements

### Full Node
* 1 CPU
* 4 GB RAM 
* 70+ GB SSD (additional ~15 GB per year)

### Light Node
* 1 CPU
* 512 MB RAM 
* 1 GB HDD (NodeJs + dependencies + database)

## Install Node js v10 or v12 on Ubuntu
```bash
curl -fsSL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## Install Yarn (optional, but recommended for v12)
```bash
npm install -g yarn
```

## Documentation
* [User Inteface demo](./client/README.md)
* [Server API app](./server/README.md)
