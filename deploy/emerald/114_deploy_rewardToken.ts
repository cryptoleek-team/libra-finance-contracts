import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { BigNumber } from "ethers"
import { isTestNetwork } from "../../utils/network"

const USD_TOKENS_ARGS: { [token: string]: any[] } = {
  REWARD: ["REWARD", "RWD", "18"],
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, getChainId } = hre
  const { deploy, execute, save } = deployments
  const { deployer } = await getNamedAccounts()

  for (const token in USD_TOKENS_ARGS) {
    const result = await deploy(token, {
      from: deployer,
      log: true,
      contract: "GenericERC20",
      args: USD_TOKENS_ARGS[token],
      skipIfAlreadyDeployed: true,
    })

    await save("GenericERC20_REWARD", result)

    // If it's on hardhat, mint test tokens
    if (isTestNetwork(await getChainId())) {
      const decimals = USD_TOKENS_ARGS[token][2]
      await execute(
        token,
        { from: deployer, log: true },
        "mint",
        deployer,
        BigNumber.from(10).pow(decimals).mul(1_000_000_000),
      )
    }
  }
}
export default func
func.tags = ["FtmUSDPoolTokens"]
