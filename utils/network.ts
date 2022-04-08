export const CHAIN_ID = {
  MAINNET: "1",
  ROPSTEN: "3",
  KOVAN: "42",
  HARDHAT: "31337",
  EMERALD: "42262",
  EMERALD_TESTNET: "42261",
}

export function isMainnet(networkId: string): boolean {
  return networkId == CHAIN_ID.MAINNET || networkId == CHAIN_ID.EMERALD
}

export function isTestNetwork(networkId: string): boolean {
  return (
    networkId == CHAIN_ID.HARDHAT ||
    networkId == CHAIN_ID.ROPSTEN ||
    networkId == CHAIN_ID.KOVAN ||
    networkId == CHAIN_ID.EMERALD_TESTNET
  )
}

export const ALCHEMY_BASE_URL = {
  [CHAIN_ID.MAINNET]: "https://eth-mainnet.alchemyapi.io/v2/",
  [CHAIN_ID.ROPSTEN]: "https://eth-ropsten.alchemyapi.io/v2/",
}
