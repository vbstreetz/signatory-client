![](https://siasky.net/PAMGM9PeehQQWOYCCC7B8ux2go5FgiMIu0gxvSO-0v770A)

## The Problem

Need for a Do It Yourself Ethereum (Hardware) Wallet.

## The Goal

An Ethereum Wallet GUI powered by [Signatory Server](https://signatory.dev), that:

- [x] Creates accounts from imported mnemonic phrases or keystore files
- [x] Allows generation of mnemonic phrases and keystore files
- [x] Provides ability to sign and verify messages
- [x] Provides ability to sign and broadcast transactions
- [ ] Interact with smart contracts
- [ ] Send ERC20 tokens

It is greatly inspired by [MyCrypto Wallet](https://github.com/MyCryptoHQ/MyCrypto), an electronjs client for generating ether wallets, handling ERC-20 tokens, and interacting with the blockchain more easily.

## Getting started

1. Setup [docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/install/).

2. Copy `.env.sample` to `.env` and configure appropriately.

3. Clone this repo and run:

   \$ make run

4. Visit app at http://localhost:4444

## Video Demo

https://youtu.be/G_I-pEhTmmo

## Contributing

How to contribute, build and release are outlined in [CONTRIBUTING.md](CONTRIBUTING.md), [BUILDING.md](BUILDING.md) and [RELEASING.md](RELEASING.md) respectively. Commits in this repository follow the [CONVENTIONAL_COMMITS.md](CONVENTIONAL_COMMITS.md) specification.
