# Libra Finance Contracts
The contracts are compiled with [Hardhat](https://hardhat.org/getting-started/), and tested using [Waffle](https://hardhat.org/guides/waffle-testing.html#testing-with-ethers-js-waffle) and [TypeScript](https://hardhat.org/guides/typescript.html#typescript-support).

## Installation

```bash
$ npm i
```

## Usage

### Build

```bash
$ npm run build
```

### Test

```bash
$ npm test
```

### Risk
Providing liquidity to Libra Finance is risky. Before using the protocol, we highly recommend reading the code and understanding the risks involved with being a Liquidity Provider (LP) and/or using the AMM to trade pegged value crypto assets.

### Audits
The Libra smart contracts were a clone of libra.finance, which were audited by OpenZeppelin, Quantstamp, and Certik.

Please keep in mind that security audits don’t completely eliminate risks. Do not supply assets that you cannot afford to lose to Libra as a liquidity provider.

Using Libra as an exchange user should be significantly less risky, but keep in mind there are still risks.

### Admin keys
Libra's admin keys initially are controlled by the founding team, which are endorsed by Oasis Protocol. In a more mature future state, the admin keys will be handled over to a Gnosis Safe multisig. The signers will be elected via votes.This multisig has capabilities to pause new deposits and trades in case of technical emergencies. Users will always be able to withdraw their funds regardless of new deposits being paused. The multisig can also change the swap/withdrawal fees and the per pool/account deposit limits.

### Permanent loss of a peg
If one of the assets in a pool significantly depegs, it will effectively mean that pool liquidity providers will be left holding only that asset.

Reset token approval to 0 when having partial approval beforehand.
As some tokens (eg. USDT) do not comply to ERC20 standards for `approve` function, when using limited approvals, you may have to reset the approvals to 0 before changing to another value. If gas usage is your concern, we recommend using unlimited approvals. Otherwise, we recommend using limited approvals for added security.

### ERC: Token standard · Issue #20 · ethereum/EIPs