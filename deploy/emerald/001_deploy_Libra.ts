import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, getChainId } = hre
  const { deploy, get, execute, getOrNull } = deployments
  const { deployer } = await getNamedAccounts()

  await deploy("Libra", {
    from: deployer,
    log: true,
    skipIfAlreadyDeployed: true,
    args: [deployer, (await get("Vesting")).address],
  })
}
export default func
func.tags = ["Libra"]
