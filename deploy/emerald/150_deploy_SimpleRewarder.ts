import { expect } from "chai"
import { BigNumber } from "ethers"
import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, getChainId, ethers } = hre
  const { deploy, execute, get, getOrNull, save, read } = deployments
  const { deployer } = await getNamedAccounts()

  if ((await getOrNull("SimpleRewarder")) == null) {
    const result = await deploy("SimpleRewarder", {
      from: deployer,
      log: true,
      args: [(await get("MiniChefV2")).address],
      skipIfAlreadyDeployed: true,
    })

    await save("SimpleRewarder_REWARD", result)

    const PID = 1
    const lpToken = (await get("Libra3StablePoolLPToken")).address
    const rewardToken = (await get("GenericERC20_REWARD")).address // Reward token
    const rewardAdmin = deployer // Reward team's multisig wallet
    const rewardPerSecond = BigNumber.from("5000000000000000000") // RewardToken reward per second

    // Ensure pid is correct
    expect(await read("MiniChefV2", "lpToken", PID)).to.eq(lpToken)

    // (IERC20 rewardToken, address owner, uint256 rewardPerSecond, IERC20 masterLpToken, uint256 pid)
    const data = ethers.utils.defaultAbiCoder.encode(
      ["address", "address", "uint256", "address", "uint256"],
      [
        rewardToken, // SPA token
        rewardAdmin, // SPA team's OpEx wallet
        rewardPerSecond, // 250k SPA weekly
        lpToken, // master LP token
        PID, // pid
      ],
    )

    await execute(
      "SimpleRewarder_REWARD",
      { from: deployer, log: true },
      "init",
      data,
    )
  }
}
export default func
func.tags = ["SimpleRewarder"]
