import hre = require("hardhat")
import { HardhatRuntimeEnvironment } from "hardhat/types"

const harvest = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { execute, get, getOrNull, log, read, save } = deployments
  const { deployer } = await getNamedAccounts()

  await execute(
    "MiniChefV2",
    { from: deployer, log: true, waitConfirmations: 3 },
    "set",
    1,
    5000,
    "0xD9fe8D6bae3d9cf70430A7890d2c525362D19f54",
    true,
  )
}

harvest(hre)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
