import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { execute, get, getOrNull, log, read, save } = deployments
  const { deployer } = await getNamedAccounts()

  // Manually check if the pool is already deployed
  const libra3StablePool = await getOrNull("libra3StablePool")
  if (libra3StablePool) {
    log(`reusing "Libra3StablePool" at ${libra3StablePool.address}`)
  } else {
    // Constructor arguments
    const TOKEN_ADDRESSES = [
      (await get("USDT")).address,
      (await get("USDC")).address,
      (await get("UST")).address,
    ]
    const TOKEN_DECIMALS = [6, 6, 6]
    const LP_TOKEN_NAME = "Libra3Stable"
    const LP_TOKEN_SYMBOL = "3Stable"
    const INITIAL_A = 400
    const SWAP_FEE = 1e7 // 10bps
    const ADMIN_FEE = 0 // 10%

    await execute(
      "SwapFlashLoan",
      { from: deployer, log: true },
      "initialize",
      TOKEN_ADDRESSES,
      TOKEN_DECIMALS,
      LP_TOKEN_NAME,
      LP_TOKEN_SYMBOL,
      INITIAL_A,
      SWAP_FEE,
      ADMIN_FEE,
      (
        await get("LPToken")
      ).address,
    )

    await save("Libra3StablePool", {
      abi: (await get("SwapFlashLoan")).abi,
      address: (await get("SwapFlashLoan")).address,
    })

    const lpTokenAddress = (await read("Libra3StablePool", "swapStorage"))
      .lpToken
    log(`Libra 3Stable Pool LP Token at ${lpTokenAddress}`)

    await save("Libra3StablePoolLPToken", {
      abi: (await get("LPToken")).abi, // LPToken ABI
      address: lpTokenAddress,
    })

    console.log("3StablePool Deployment...")
  }
}
export default func
func.tags = ["Libra3StablePool"]
func.dependencies = ["SwapUtils", "SwapFlashLoan", "FtmUSDPoolTokens"]
