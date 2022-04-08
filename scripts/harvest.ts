import hre = require("hardhat")
import { HardhatRuntimeEnvironment } from "hardhat/types"

const harvest = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { execute, get, getOrNull, log, read, save } = deployments
  const { deployer } = await getNamedAccounts()

  await execute(
    "MiniChefV2",
    { from: deployer, log: true, waitConfirmations: 3 },
    "harvest",
    1,
    deployer,
  )
}

harvest(hre)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
