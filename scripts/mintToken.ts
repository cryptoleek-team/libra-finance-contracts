import { HardhatRuntimeEnvironment } from "hardhat/types"
import { BigNumber } from "ethers"
import hre = require("hardhat")

const USD_TOKENS_ARGS: { [token: string]: any[] } = {
  USDT: ["Tether", "USDT", "6"],
  USDC: ["USD Coin", "USDC", "6"],
}

const mintToken = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, getChainId } = hre
  const { deploy, execute } = deployments
  const { deployer } = await getNamedAccounts()

  for (const token in USD_TOKENS_ARGS) {
    // If it's on hardhat, mint test tokens
    const decimals = USD_TOKENS_ARGS[token][2]
    await execute(
      token,
      { from: deployer, log: true },
      "mint",
      deployer,
      BigNumber.from(10).pow(decimals).mul(1000000),
    )
  }
}
mintToken(hre)
