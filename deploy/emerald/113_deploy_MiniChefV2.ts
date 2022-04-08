import { BIG_NUMBER_1E18 } from "../../test/testUtils"
import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { MiniChefV2 } from "../../build/typechain"
import { ethers } from "hardhat"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, getChainId } = hre
  const { deploy, get, execute, getOrNull, log } = deployments
  const { deployer } = await getNamedAccounts()

  const miniChef = await getOrNull("MiniChefV2")
  if (miniChef) {
    log(`Reusing MiniChefV2 at ${miniChef.address}`)
  } else {
    // Deploy retroactive vesting contract for airdrops
    await deploy("MiniChefV2", {
      from: deployer,
      log: true,
      skipIfAlreadyDeployed: true,
      args: [(await get("Libra")).address],
    })

    const minichef: MiniChefV2 = await ethers.getContract("MiniChefV2")

    // 90% of the Total Libra will be rewarded to the community
    // 5% to team vested
    // 1% to oasis foundation for advisory vested
    // 2% as initial liquidity permenantly locked
    // 2% as marketing and operating fee
    const TOTAL_LM_REWARDS = BIG_NUMBER_1E18.mul(900_000_00)
    // 24 months (96 weeks)
    const lmRewardsPerSecond = TOTAL_LM_REWARDS.div(24 * 4 * 7 * 24 * 3600)

    const batchCall = [
      await minichef.populateTransaction.setSaddlePerSecond(lmRewardsPerSecond),
      await minichef.populateTransaction.add(
        1,
        "0x0000000000000000000000000000000000000000", // blank lp token to enforce totalAllocPoint != 0
        "0x0000000000000000000000000000000000000000",
      ),
      await minichef.populateTransaction.add(
        5000,
        (
          await get("Libra3StablePoolLPToken")
        ).address,
        "0x0000000000000000000000000000000000000000",
      ),
    ]

    const batchCallData = batchCall.map((x) => x.data)

    // Send batch call
    await execute(
      "MiniChefV2",
      { from: deployer, log: true },
      "batch",
      batchCallData,
      false,
    )
  }
}
export default func
func.tags = ["MiniChef"]
