import hre = require("hardhat")
import { HardhatRuntimeEnvironment } from "hardhat/types"

const enableTransfer = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { execute, get, getOrNull, log, read, save } = deployments
  const { deployer } = await getNamedAccounts()

  await execute(
    "SDL",
    { from: deployer, log: true, waitConfirmations: 3 },
    "enableTransfer",
  )
}

enableTransfer(hre)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
